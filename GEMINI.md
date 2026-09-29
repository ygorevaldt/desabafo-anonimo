# GEMINI.md - Diretrizes para Desenvolvimento com Google Gemini

## Visão Geral

Este documento fornece as diretrizes e padrões de desenvolvimento para modelos e agentes Google Gemini atuando no projeto **Desabafo Anônimo**.

---

## Integração com Google GenAI (`@google/genai`)

O projeto utiliza o SDK oficial `@google/genai` para executar tarefas de moderação de conteúdo e geração de conforto empático.

### Configuração de Ambiente

As variáveis de ambiente para a IA residem no arquivo `.env`:

```env
GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-2.5-flash
```

### Arquitetura dos Serviços de IA

1. **`AiModerationService`** (`src/app/api/services/ai-moderation.service.ts`):

   - Avalia posts e comentários antes de persistir no banco.
   - Categorias: `APPROVED`, `SENSITIVE`, `BLOCKED`.
   - **Resiliência e Fallback:** Se `GEMINI_API_KEY` for omitida ou houver falha de rede, aciona automaticamente o fallback heurístico `fallbackModeration()`.

2. **`AiComfortService`** (`src/app/api/services/ai-comfort.service.ts`):
   - Gera acolhimento empático humanizado.
   - Foca em escuta ativa, acolhimento e indicação preventiva do CVV (188).

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
