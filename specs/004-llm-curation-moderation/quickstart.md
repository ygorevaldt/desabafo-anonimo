# Quickstart: Validação e Testes de Curadoria por IA, Cache Hash e Denúncias

**Feature**: `004-llm-curation-moderation`  
**Date**: 2026-10-01  
**Status**: Concluído  

---

## 1. Pré-Requisitos

1. **Node.js**: Versão 20+ instalada.
2. **Docker**: Docker Desktop ou daemon Docker ativo para execução do PostgreSQL via Compose.
3. **Ambiente**: Arquivo `.env` configurado com `DATABASE_URL` e `GEMINI_API_KEY` (opcional em testes devido ao fallback determinístico).

---

## 2. Preparação do Ambiente e Banco de Dados

Suba a infraestrutura de banco de dados e aplique as migrações:

```bash
# Subir o banco PostgreSQL e aplicar as migrações Prisma
npm run test:prepare
```

---

## 3. Execução dos Testes de Integração Automatizados (TDD)

Execute a suite completa de testes de integração com banco de dados real:

```bash
# Execução completa orquestrada
npm test

# Ou execução direta via Vitest
npm run test:run
```

Para rodar os testes específicos desta funcionalidade:

```bash
# Testes de moderação, structured outputs e cache por hash
npx vitest run tests/integration/app/api/v1/unburden/moderation-cache.test.ts

# Testes de denúncias, idempotência e auditoria assíncrona com soft delete
npx vitest run tests/integration/app/api/v1/unburden/report.test.ts
```

---

## 4. Roteiro de Validação Ponta a Ponta

### Cenário 1: Curadoria com Structured Outputs e Classificação
1. Disparar `POST /api/gateway/v1/unburden` com conteúdo cotidiano.
   - **Resultado Esperado**: Status `201 Created`, `sensitiveContent: false`.
2. Disparar `POST /api/gateway/v1/unburden` com desabafo de dor/luto em primeira pessoa.
   - **Resultado Esperado**: Status `201 Created`, `sensitiveContent: true`.
3. Disparar `POST /api/gateway/v1/unburden` com apologia explícita a crimes ou ódio.
   - **Resultado Esperado**: Status `401 Unauthorized`, post não persistido.

### Cenário 2: Deduplicação e Caching por Chave Hash
1. Disparar uma primeira requisição de moderação para um texto inédito.
   - **Resultado Esperado**: Processado e veredito armazenado no cache.
2. Disparar imediatamente uma segunda requisição com o mesmo texto (ou com espaços adicionais normalizados).
   - **Resultado Esperado**: Retorno instantâneo (< 5ms) recuperado do cache sem chamada externa à API da LLM.

### Cenário 3: Registro de Denúncias e Idempotência
1. Criar um desabafo válido no banco.
2. Disparar `POST /api/gateway/v1/unburden/[id]/report` com header `x-session-id: session-user-1`.
   - **Resultado Esperado**: Status `201 Created`, `alreadyReported: false`, `reportCount: 1`.
3. Disparar a mesma requisição com o mesmo `session-user-1`.
   - **Resultado Esperado**: Status `200 OK`, `alreadyReported: true`, `reportCount: 1` (sem duplicidade).

### Cenário 4: Auditoria Assíncrona e Soft Delete por Acúmulo de Denúncias
1. Enviar 3 denúncias de sessões distintas (`session-1`, `session-2`, `session-3`) para um post com conteúdo proibido.
2. A terceira denúncia dispara o worker assíncrono de auditoria por IA.
3. Aguardar o processamento em background.
4. Consultar `GET /api/gateway/v1/unburden` e `GET /api/gateway/v1/unburden/[id]`.
   - **Resultado Esperado**: O post é excluído logicamente (`deletedAt != null`), não aparece na listagem pública e o acesso direto responde com `404 Not Found`.
