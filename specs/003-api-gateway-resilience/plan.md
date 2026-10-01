# Implementation Plan: Padrão API Gateway com Proxy Reverso, Circuit Breaker e Rate Limiting

**Branch**: `003-api-gateway-resilience` | **Date**: 2026-10-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-api-gateway-resilience/spec.md`

## Summary

Esta funcionalidade introduz o padrão arquitetural de API Gateway como a porta de entrada única, segura e resiliente da aplicação. Implementa um proxy reverso inteligente através de Route Handler dinâmico (`/api/gateway/[...path]`), dotado de:
1. **Controle de Sobrecarga (Rate Limiting)** em memória com algoritmo de janela deslizante/token bucket por IP, aplicando limites diferenciados para leitura (60 req/min) e mutação sensível (15 req/min), retornando HTTP `429 Too Many Requests` com cabeçalho `Retry-After`.
2. **Resiliência e Prevenção de Falhas em Cascata (Circuit Breaker com Opossum)** com gerenciamento dos estados `CLOSED`, `OPEN` e `HALF-OPEN`, limiar de falha de 50%, timeout de 5s e fail-fast imediato em menos de 5ms com HTTP `503 Service Unavailable`.
3. **Encapsulamento e Blindagem do Backend**: Omissão de cabeçalhos de identificação (`X-Powered-By`), sanitização completa de falhas 500 sem vazamento de stack traces e roteamento transparente.
4. **Integração do Cliente Frontend**: Migração do cliente HTTP Axios (`src/http/client.ts`) para canalizar requisições pelo Gateway, com interceptores para feedback humanizado ao usuário.

## Technical Context

**Language/Version**: Node.js 20+ com TypeScript 5 (modo estrito habilitado)  
**Primary Dependencies**: Next.js 15.2 (App Router), React 19, Axios 1.7.7, Opossum 8.1+ (`opossum` e `@types/opossum`), Zod 3.23, Prisma ORM 5.22  
**Storage**: PostgreSQL 16+ via Prisma ORM  
**Testing**: Vitest 2.1.4 + Supertest 7.3 (Testes de integração de API contra banco real)  
**Target Platform**: Web (Next.js SSR + Client Components)  
**Project Type**: Monolito modular full-stack web  
**Performance Goals**: Latência adicional do Gateway < 5ms para requisições aceitas; bloqueio de Rate Limit em < 10ms; fail-fast de Circuit Breaker em < 5ms  
**Constraints**: Zero chamadas diretas do frontend aos serviços internos; 100% de conformidade com os princípios da Constituição v1.3.0 (TDD estrito de integração, Clean Code sem comentários em código, arquitetura em camadas)  
**Scale/Scope**: Todas as operações de leitura e mutação públicas da aplicação (desabafos, comentários, apoios e status)  

## Constitution Check

*GATE: Pre-research and post-design validation.*

- [x] **TDD via Integration Tests**: Every acceptance scenario has a planned integration test in `tests/integration/app/api/gateway/route.test.ts` to be written and failing BEFORE implementation begins.
- [x] **Integration-Only Scope**: Only integration tests are used with `testClient` and real PostgreSQL database (NO isolated unit tests with excessive mocks).
- [x] **Layered Architecture**: Respects the unidirectional flow: Gateway Route Handler (`src/app/api/gateway/[...path]/route.ts`) -> Rate Limiter / Circuit Breaker Layer -> Domain Handlers/Services -> DTOs / Sanitized Responses.
- [x] **Simplicity & Maintainability**: Adheres to KISS and YAGNI; avoids premature abstractions or unnecessary complexity (in-memory rate limiting with modular interface, avoiding unneeded Redis container).
- [x] **AI Safety & Async Processing**: Downstream AI comfort generation remains non-blocking; circuit breaker provides isolated protection per domain resource.
- [x] **Idempotency in Critical Operations**: Preserves existing idempotency guarantees for all mutating operations passed through the gateway.
- [x] **DRY & Modular Reuse**: Rate limiter and circuit breaker registries are central, single sources of truth under `src/app/api/gateway/`.
- [x] **Clean Code & Self-Explanatory Implementation**: Strict prohibition of explanatory implementation comments. Code must be self-explanatory through expressive naming, structure, and design (no comments in implementation).
- [x] **Parity & Automation**: Database operations and test runs leverage the established Docker and scripts pipeline (`infra/compose.yaml`, `npm test`).

## Project Structure

### Documentation (this feature)

```text
specs/003-api-gateway-resilience/
├── plan.md              # This file
├── research.md          # Technical decisions and architecture
├── data-model.md        # Entities, rate limit configs, and circuit states
├── quickstart.md        # Step-by-step validation guide
├── contracts/
│   └── gateway-api.md   # Gateway routing and HTTP resilience contracts
└── tasks.md             # Decomposed tasks for implementation (Phase 2 output)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── api/
│       ├── gateway/
│       │   ├── circuit-breaker/
│       │   │   ├── circuit-breaker-registry.ts    # Fábrica e registro de instâncias Opossum por domínio
│       │   │   └── circuit-breaker.types.ts       # Tipagens dos estados do circuito
│       │   ├── rate-limit/
│       │   │   ├── rate-limiter.ts                # Limitador de taxa em memória por IP (Sliding Window)
│       │   │   └── rate-limit.types.ts            # Tipagens e políticas de taxa
│       │   ├── utils/
│       │   │   ├── extract-client-ip.util.ts      # Extração confiável do IP do cliente
│       │   │   └── sanitize-headers.util.ts       # Higienização de cabeçalhos de resposta
│       │   └── [...path]/
│       │       └── route.ts                       # Route Handler dinâmico do Gateway (Proxy Reverso)
│       └── v1/                                    # Serviços e rotas de domínio internos existentes
├── http/
│   └── client.ts                                  # Cliente HTTP centralizado apontando para o Gateway com interceptors 429/503
└── utils/
    └── alert.ts                                   # Notificações amigáveis do SweetAlert2

tests/
└── integration/
    └── app/
        └── api/
            └── gateway/
                └── route.test.ts                  # Testes de integração ponta a ponta do Gateway
```

**Structure Decision**: Padrão API Gateway integrado como camada de orquestração sob o App Router do Next.js, mantendo paridade com a arquitetura em camadas e execução in-memory via `testClient`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Inclusão da biblioteca `opossum` | Necessária para implementar o padrão Circuit Breaker solicitado com fail-fast, timeouts e monitoramento estatístico | Re-implementar manualmente violaria DRY e seria suscetível a bugs de concorrência e estado |
