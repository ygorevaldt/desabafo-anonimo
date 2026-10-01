# Research & Technical Decisions: Curadoria com IA, Structured Outputs, Cache Hash e Auditoria de Denúncias

**Feature**: `004-llm-curation-moderation`  
**Date**: 2026-10-01  
**Status**: Concluído  

---

## 1. Structured Outputs com `@google/genai` e Validação Estrita com Zod

### Contexto e Problema
Atualmente, o `AiModerationService` enviava instruções em texto livre no prompt para que o Gemini respondesse em JSON, fazendo parsing com `JSON.parse`. Essa abordagem corre riscos de alucinação de formato, campos faltantes ou respostas malformadas caso o modelo produza texto explicativo antes/depois do bloco JSON.

### Decisão
Utilizar o suporte nativo a **Structured Outputs** do SDK `@google/genai` (`responseMimeType: "application/json"` associado a `responseSchema`), combinado com validação em tempo de execução via **schema Zod** (`moderationVerdictSchema`).

```typescript
export const moderationVerdictSchema = z.object({
  status: z.enum(["APPROVED", "SENSITIVE", "BLOCKED"]),
  category: z.enum([
    "safe",
    "self_harm_distress",
    "apology_violence",
    "sexual_violence",
    "hate_speech",
    "illegal",
  ]),
  isSensitive: z.boolean(),
  reason: z.string().optional(),
});
```

### Racional
1. **Determinismo e Previsibilidade**: O schema no `@google/genai` força a decodificação da LLM segundo uma gramática estrita de tokens, garantindo que o retorno seja 100% JSON sintaticamente válido.
2. **Segurança de Tipos em Runtime**: A validação complementar com Zod garante tipagem TypeScript estrita e impede que propriedades inesperadas ou tipos incompatíveis atravessem a camada de serviço.
3. **Resiliência e Fallback**: O fallback heurístico determinístico (`checkContentTemperature`) permanece ativo para contingências de rede ou ausência de chave de API em ambiente de desenvolvimento/testes.

### Alternativas Consideradas
- **Regex Extraction / Parsing Manual**: Rejeitado por ser frágil e suscetível a mudanças sutis de formatação na resposta do modelo.
- **Validação Apenas em Prompt**: Rejeitado pois prompts não garantem 100% de conformidade estrutural sintática em cenários de alta carga ou textos com aspas/quebras de linha atípicas.

---

## 2. Deduplicação, Idempotência e Caching de Moderação por Chave Hash

### Contexto e Problema
A mesma postagem ou textos idênticos podem ser submetidos repetidamente (ex.: cliques repetidos, spam idêntico ou revalidações). Fazer chamadas adicionais à LLM adiciona latência desnecessária (>500ms) e consome cota de requisições.

### Decisão
Implementar um serviço de cache de vereditos (`ModerationCacheService`) indexado por um **hash criptográfico determinístico (SHA-256)** gerado a partir do conteúdo textual normalizado do desabafo.

1. **Normalização de Texto**:
   - Concatenação de título e conteúdo.
   - Remoção de espaços em branco extras (`\s+` -> ` `).
   - `.trim()` e conversão uniforme para minúsculas.
2. **Geração do Hash**:
   - Hash SHA-256 via `node:crypto` (`createHash("sha256").update(normalizedText).digest("hex")`).
3. **Cache em Memória com TTL**:
   - Armazenamento em memória com limite de registros e TTL configurável (ex.: 24 horas), com interface desacoplada para permitir substituição por Redis em escala futura.

### Racional
1. **Latência Sub-Milissegundo**: Requisições repetidas de moderação respondem em menos de 1ms diretamente do cache.
2. **Economia de Recursos**: Zero custo de tokens e zero consumo de cota da API do Google para posts duplicados ou reanálises com o mesmo texto.

---

## 3. Modelo de Dados de Denúncias e Soft Delete no Banco de Dados

### Contexto e Problema
A comunidade precisa sinalizar desabafos ofensivos ou nocivos. Quando um desabafo atinge certo número de denúncias e a auditoria confirma violação, ele deve ser excluído logicamente (*soft delete*), saindo das listagens públicas sem perder rastreabilidade histórica.

### Decisão
1. **Tabela de Denúncias (`denuncia` / `Report`)**:
   - `id`: UUID (Primary Key).
   - `session_id`: VarChar(36) (Sessão do denunciante).
   - `id_desabafo`: UUID (Chave estrangeira referenciando `desabafo`).
   - `motivo`: VarChar(255) (Opcional).
   - `created_at`: Timestamp (Data/hora do registro).
   - Constraint de Unicidade: `@@unique([sessionId, unburdenId])` para assegurar idempotência estrita (1 denúncia por sessão por post).
2. **Coluna de Exclusão Lógica (`deleted_at` / `deletedAt`)**:
   - Adicionar `deletedAt DateTime? @map("deleted_at")` na tabela `desabafo` (`Unburden`).
3. **Filtro de Leitura**:
   - As consultas `findMany` e `findUnique` no repositório de desabafos passam a incluir `where: { deletedAt: null }`.
   - Método de repositório `softDelete(id: string): Promise<void>` que atualiza `deletedAt: new Date()`.

---

## 4. Fluxo Assíncrono de Reavaliação e Auditoria por IA

### Contexto e Problema
O processamento de denúncia não pode penalizar o usuário denunciante retendo a conexão HTTP enquanto a IA reavalia o post. Além disso, a auditoria deve agir autonomamente sem intervenção humana manual.

### Decisão
1. **Limiar de Denúncias**: Limiar padrão de **3 denúncias únicas** (`REPORT_AUDIT_THRESHOLD = 3`, configurável via ambiente).
2. **Registro Rápido e Idempotente**: A rota `POST /api/v1/unburden/[id]/report` registra a denúncia e retorna status de sucesso imediatamente (`200 OK` / `201 Created`).
3. **Disparo Assíncrono Desacoplado**:
   - Ao detectar que `totalDenuncias >= limiar`, o serviço dispara `AuditUnburdenService.triggerAsyncAudit(unburdenId)` de forma não-bloqueante (`setImmediate` / worker assíncrono).
   - O worker recupera o post, executa a moderação com IA estruturada (`AiModerationService.moderate`).
   - Se veredito for `BLOCKED`: executa `unburdenRepository.softDelete(unburdenId)`.
   - Se veredito for `SENSITIVE`: atualiza `sensitiveContent: true` no post se ainda não estiver marcado.
   - Se veredito for `APPROVED`: mantém o post ativo sem alterações.

### Racional
Atende integralmente ao **Princípio IV (Resiliência de IA e Não-Bloqueio Assíncrono)** da Constituição do projeto, garantindo resposta imediata ao usuário e processamento em segundo plano.

---

## 5. Integração com o API Gateway e Frontend

### Decisão
1. **API Gateway**:
   - Adicionar o manipulador da rota `POST /v1/unburden/[id]/report` no `GatewayDispatcher`.
   - Aplicar proteção de rate limit e circuit breaker no gateway.
2. **Frontend**:
   - Atualizar `src/components/Unburden.tsx` para chamar a função HTTP `registerReport(unburdenId)` ao confirmar a denúncia no diálogo SweetAlert2.
   - Exibir notificação amigável de conclusão e marcar o botão como "Sinalizado".
