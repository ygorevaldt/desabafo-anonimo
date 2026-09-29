# CLAUDE.md - Guia do Projeto Desabafo Anônimo

## Visão Geral do Projeto

O **Desabafo Anônimo** é uma aplicação web full-stack que oferece um espaço seguro, acolhedor e anônimo para pessoas expressarem sentimentos, angústias e dores sem receios, recebendo palavras de apoio de outros usuários e conforto inicial mediado por Inteligência Artificial.

A plataforma conta com um sistema de **moderação semântica com IA** para proteger o ambiente contra crimes, apologia a estupro, morte e discursos de ódio, além de integração com canais de apoio à saúde mental (CVV - 188).

---

## Stack Tecnológica

- **Linguagem & Tipagem:** TypeScript 5
- **Framework Web:** Next.js 15 (App Router) & React 19
- **Estilização:** Tailwind CSS 3
- **ORM & Banco de Dados:** Prisma ORM 5 com PostgreSQL (Bitnami) via Docker Compose
- **Validação de Schemas:** Zod
- **SDK de Inteligência Artificial:** `@google/genai` (Google Gemini 2.5 Flash)
- **Testes Automatizados:** Vitest & Supertest (execução in-memory isolada via `testClient`)
- **Feedback & Alertas:** SweetAlert2 & React Icons

---

## Arquitetura de Infraestrutura e Estabilização (Padrão devnews)

O ambiente local e os testes foram estabilizados seguindo a arquitetura de excelência do `devnews`:

1. **Docker Compose:**
   - Arquivo em `infra/compose.yaml`.
   - Nome do container fixo: `container_name: "desabafo-anonimo-postgres"` para fácil identificação no Docker Desktop.
2. **Health Check do Postgres (`infra/scripts/wait-for-postgres.js`):**
   - Verifica `pg_isready` dentro do container E a conectividade TCP na porta 5432 antes de liberar a execução do Next.js ou testes.
3. **Orquestração de Testes (`infra/scripts/run-tests.js`):**
   - Executa `npm run test:prepare` (sobe o banco, aguarda ficar pronto e aplica migrations).
   - Executa a suite de testes com Vitest.
   - Detecta se a aplicação já estava rodando na porta 3000 via `/api/v1/status`:
     - Se o dev estava com `next dev` rodando, mantém o banco ativo.
     - Se não havia aplicação rodando, para o container do banco automaticamente (`npm run services:stop`), deixando o computador limpo.
4. **Testes In-Memory (`testClient`):**
   - Utilitário em `tests/integration/app/api/utils/test-client.ts`.
   - Permite executar testes de integração com `supertest` diretamente contra os Route Handlers do App Router, sem precisar de servidor HTTP externo ativo.

---

## Comandos Principais

```bash
# Subir ambiente de desenvolvimento (Postgres + health check + migrations + Next.js)
npm run dev

# Subir apenas os containers Docker
npm run services:up

# Parar containers Docker
npm run services:stop

# Derrubar containers e rede Docker
npm run services:down

# Aguardar Postgres estar 100% pronto
npm run wait-for-postgres

# Aplicar migrações do banco (Prisma)
npm run migration:up

# Executar suite completa de testes automatizados com orquestração
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage

# Build de produção (aplica migrations e gera build)
npm run build
```

---

## Diretrizes de Moderação e Inteligência Artificial

### Moderação Semântica (`AiModerationService`)

- **`BLOCKED`**: Violação grave (apologia a estupro/abuso sexual, incitação a crimes/morte, ódio, ameaças). Lança `UnauthorizedContentException` (HTTP 401).
- **`SENSITIVE`**: Sofrimento profundo ou ideação autolesiva em 1ª pessoa em busca de apoio. Aceito com `sensitiveContent: true` (ativa blur, aviso de gatilho e recomendação do CVV 188).
- **`APPROVED`**: Desabafos cotidianos, tristeza, ansiedade, cansaço, estresse.
- **Fallback Heurístico:** Se `GEMINI_API_KEY` não for informada, o sistema usa o analisador leetspeak `checkContentTemperature.util.ts`.
