# GEMINI.md - Diretrizes para Desenvolvimento com Google Gemini

## Visão Geral

Este documento fornece as diretrizes e padrões de desenvolvimento para modelos e agentes Google Gemini atuando no projeto **Desabafo Anônimo**.

---

## Integração com Google GenAI (`@google/genai`)

O projeto utiliza o SDK oficial `@google/genai` para executar tarefas de moderação de conteúdo, structured outputs, deduplicação por hash, auditoria assíncrona de denúncias e geração de conforto empático.

### Configuração de Ambiente

As variáveis de ambiente para a IA residem no arquivo `.env`:

```env
GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-2.5-flash
REPORT_AUDIT_THRESHOLD=3
MODERATION_CACHE_TTL_MS=86400000
MAX_MODERATION_CACHE_ENTRIES=5000
```

### Arquitetura dos Serviços de IA

1. **`AiModerationService`** (`src/app/api/services/ai-moderation.service.ts`):
   - Avalia posts e comentários antes de persistir no banco.
   - **Structured Outputs com Schema Zod:** Utiliza `responseMimeType: "application/json"` com `responseSchema` estrito validado em tempo de execução via `moderationVerdictSchema`.
   - **Categorias:** `APPROVED`, `SENSITIVE`, `BLOCKED`.
   - **Deduplicação e Caching por Hash:** Normaliza o texto e computa hash SHA-256 via `generateContentHash()`, consultando o `ModerationCacheService` para respostas sub-5ms em submissões idênticas e zero custo redundante de API.
   - **Resiliência e Fallback:** Se `GEMINI_API_KEY` for omitida ou houver falha de rede, aciona automaticamente o fallback heurístico determinístico `fallbackModeration()`.

2. **`AiComfortService`** (`src/app/api/services/ai-comfort.service.ts`):
   - Gera acolhimento empático humanizado em segundo plano (não-bloqueante).
   - Foca em escuta ativa, acolhimento e indicação preventiva do CVV (188).

3. **`AuditUnburdenService`** (`src/app/api/services/audit-unburden.service.ts`):
   - Disparado assincronamente quando um post acumula o limiar de denúncias únicas (`REPORT_AUDIT_THRESHOLD`).
   - Reavalia o post através de structured outputs da IA e executa exclusão lógica (`softDelete`) caso a violação seja confirmada, ocultando o post de consultas públicas.

---

## Infraestrutura e Estabilização dos Testes (Padrão devnews)

- **Container Docker:** `desabafo-anonimo-postgres` (definido em `infra/compose.yaml`).
- **Health Check:** `infra/scripts/wait-for-postgres.js` valida `pg_isready` e porta TCP 5432.
- **Orquestração de Testes:** `infra/scripts/run-tests.js` prepara o banco, roda a suite com Vitest e finaliza o container automaticamente caso o Next.js não esteja ativo na porta 3000.
- **Testes In-Memory:** `tests/integration/app/api/utils/test-client.ts` utiliza `supertest` diretamente contra os Route Handlers do App Router.

---

## Comandos Operacionais

- **Subir dev completo:** `npm run dev`
- **Subir Postgres:** `npm run services:up`
- **Aguardar Postgres:** `npm run wait-for-postgres`
- **Aplicar Migrações:** `npm run migration:up`
- **Parar Postgres:** `npm run services:stop`
- **Rodar Testes com Orquestração:** `npm test`
- **Rodar Testes Diretamente:** `npm run test:run`
