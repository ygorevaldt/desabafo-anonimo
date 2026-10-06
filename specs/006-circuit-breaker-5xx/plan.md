# Implementation Plan: Circuit Breaker 5xx Error Tripping and Downstream Resilience

**Branch**: `006-circuit-breaker-5xx` | **Date**: 2026-10-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-circuit-breaker-5xx/spec.md`

## Summary

Esta feature aprimora a integração entre o API Gateway e a biblioteca `opossum`, garantindo que respostas downstream com status HTTP >= 500 (falhas internas, erros de banco de dados ou exceções não tratadas) sejam registradas como falhas no Circuit Breaker. Quando o limite de tolerância é ultrapassado, o disjuntor abre automaticamente (Fail-Fast com HTTP 503 `CIRCUIT_BREAKER_OPEN`), protegendo a infraestrutura do monólito. Respostas 4xx (erros do cliente) continuam isoladas e não afetam a saúde do disjuntor.

## Technical Context

**Language/Version**: TypeScript 5+ / Node.js 20+
**Primary Dependencies**: Next.js 15, Opossum, Zod
**Storage**: PostgreSQL 16 com Prisma ORM
**Testing**: Vitest + Supertest via `testClient` (Testes de integração)
**Target Platform**: Linux server / Node.js runtime
**Project Type**: Monólito Modular Full-Stack Next.js (App Router)
**Performance Goals**: Fail-Fast sob circuito aberto em < 20ms
**Constraints**: Single-process Event Loop (Node.js); proteção contra exaustão de conexões PostgreSQL
**Scale/Scope**: Módulos sob `/api/gateway/v1/*`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **TDD via Integration Tests**: Cenários de aceite mapeados para testes de integração em `tests/integration/app/api/gateway/circuit-breaker.test.ts`.
- [x] **Integration-Only Scope**: Testes usam `testClient` diretamente contra os Route Handlers do Next.js sem mocks desnecessários.
- [x] **Layered Architecture**: Separação clara entre gateway, despachante e disjuntor.
- [x] **Simplicity & Maintainability**: Adota classe de erro `DownstreamError` limpa sem sobre-engenharia.
- [x] **AI Safety & Async Processing**: Não interfere com as rotinas de moderação e acolhimento.
- [x] **Idempotency in Critical Operations**: Preservada.
- [x] **DRY & Modular Reuse**: Constantes centralizadas (`HttpStatusCode`) e utilitários reutilizáveis.
- [x] **Clean Code & Self-Explanatory Implementation**: Sem comentários explicativos no código de produção.
- [x] **Parity & Automation**: Validação executada via `npm test` e Docker Compose.

## Project Structure

### Documentation (this feature)

```text
specs/006-circuit-breaker-5xx/
├── plan.md              # Este plano de implementação
├── research.md          # Decisões de arquitetura e design
├── data-model.md        # Modelos e definições de erro
├── quickstart.md        # Instruções de validação e execução
├── checklists/          # Checklists de qualidade
└── tasks.md             # Tarefas de implementação (gerado pelo /speckit-tasks)
```

### Source Code (repository root)

```text
src/
└── app/
    └── api/
        └── gateway/
            ├── circuit-breaker/
            │   ├── circuit-breaker-registry.ts
            │   ├── circuit-breaker.types.ts
            │   └── downstream-error.ts           # Nova classe DownstreamError
            └── [...path]/
                └── route.ts                      # Interceptação de respostas >= 500

tests/
└── integration/
    └── app/
        └── api/
            └── gateway/
                └── circuit-breaker.test.ts       # Testes de integração de auto-tripping
```

**Structure Decision**: Monólito modular full-stack Next.js com App Router.

## Complexity Tracking

Nenhuma violação aos princípios constitucionais.
