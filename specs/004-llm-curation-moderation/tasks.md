# Tasks: Curadoria com IA, Structured Outputs, Cache Hash e Auditoria Assíncrona de Denúncias

**Input**: Design documents from `specs/004-llm-curation-moderation/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/report-api.md](./contracts/report-api.md), [quickstart.md](./quickstart.md)

**Tests**: TDD com testes de integração é OBRIGATÓRIO (Princípio I da Constituição). Escrever os testes de integração PRIMEIRO, baseados nos critérios de aceite de cada história de usuário (spec.md), verificar que FALHAM (Red), para então implementar.

**Organization**: Tarefas agrupadas por histórias de usuário para permitir implementação e testes independentes de cada fatia de funcionalidade.

## Format: `[ID] [P?] [Story] Description with file path`

- **[P]**: Pode rodar em paralelo (arquivos distintos, sem dependência direta)
- **[Story]**: História de usuário correspondente (ex.: [US1], [US2], [US3], [US4])

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialização das constantes e estrutura básica compartilhada

- [X] T001 Configure environment constants and report audit threshold in `src/app/api/constants/report-constants.ts`
- [X] T002 [P] Setup in-memory moderation cache service with TTL in `src/app/api/services/cache/moderation-cache.service.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura de banco de dados e repositório que DEVE estar pronta antes da implementação das histórias de usuário

**⚠️ CRITICAL**: Nenhuma história de usuário pode ser iniciada antes da conclusão desta fase

- [X] T003 Update Prisma schema with `Report` (`denuncia`) model and `deletedAt` field on `Unburden` in `prisma/schema.prisma`
- [X] T004 Create and apply Prisma migration for Report table and soft delete field in `prisma/migrations/`
- [X] T005 [P] Update `IUnburdenRepository` interface with `softDelete` and filtered `findMany`/`findUnique` in `src/app/api/repositories/unburden/unburden-repository.interface.ts`
- [X] T006 Update `PrismaUnburdenRepository` with `where: { deletedAt: null }` and `softDelete` method in `src/app/api/repositories/unburden/prisma-unburden.repository.ts`
- [X] T007 [P] Create content normalization and SHA-256 hash generator utility in `src/app/api/utils/generate-content-hash.util.ts`

**Checkpoint**: Fundação pronta - a implementação das histórias de usuário orientada a testes pode começar.

---

## Phase 3: User Story 1 - Curadoria de Conteúdo com Structured Outputs e Classificação Determinística (Priority: P1) 🎯 MVP

**Goal**: Avaliar desabafos utilizando Structured Outputs do Google GenAI com validação estrita via schema Zod, classificando em APPROVED, SENSITIVE (com sinalização e acolhimento) ou BLOCKED (rejeição com 401 Unauthorized para apologia a crimes, estupro e violência).

**Independent Test**: Enviar posts com conteúdo seguro (201), conteúdo sensível/trauma (201 com `sensitiveContent: true`) e apologia a crimes/ódio (401 Unauthorized), validando resposta estruturada.

### Tests for User Story 1 (MANDATORY - TDD Integration Tests) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation (Red)**

- [X] T008 [P] [US1] Write integration tests for structured outputs moderation and classifications in `tests/integration/app/api/v1/unburden/moderation-structured.test.ts`

### Implementation for User Story 1

- [X] T009 [P] [US1] Create Zod schema for structured output moderation verdict in `src/app/api/services/schemas/moderation-verdict.schema.ts`
- [X] T010 [US1] Refactor `AiModerationService` in `src/app/api/services/ai-moderation.service.ts` to utilize Google GenAI `responseSchema` with JSON Schema and runtime Zod validation
- [X] T011 [US1] Update `RegisterUnburdenService` in `src/app/api/services/register-unburden.service.ts` to enforce structured verdicts and sensitive content assignment
- [X] T012 [US1] Verify integration tests PASS (Green) and refactor code cleanly without comments (Refactor)

**Checkpoint**: User Story 1 funcional e testada independentemente.

---

## Phase 4: User Story 2 - Deduplicação, Idempotência e Caching de Moderação por Chave Hash (Priority: P1)

**Goal**: Identificar textos idênticos via hash SHA-256 do conteúdo normalizado e reaproveitar vereditos em cache, evitando chamadas repetidas à IA externa e garantindo respostas instantâneas (< 5ms).

**Independent Test**: Enviar duas requisições consecutivas com o mesmo conteúdo (ou com espaços extras redundantes) e verificar que a segunda é resolvida do cache sem chamada externa.

### Tests for User Story 2 (MANDATORY - TDD Integration Tests) ⚠️

- [X] T013 [P] [US2] Write integration tests for hash caching and duplicate content moderation in `tests/integration/app/api/v1/unburden/moderation-cache.test.ts`

### Implementation for User Story 2

- [X] T014 [US2] Integrate `ModerationCacheService` and `generateContentHash` into `AiModerationService` in `src/app/api/services/ai-moderation.service.ts`
- [X] T015 [US2] Verify integration tests PASS (Green) and refactor code cleanly without comments (Refactor)

**Checkpoint**: User Stories 1 e 2 funcionais e integradas de forma independente.

---

## Phase 5: User Story 3 - Registro Idempotente de Denúncias por Usuário (Priority: P2)

**Goal**: Disponibilizar endpoint e serviço para que membros da comunidade sinalizem desabafos de forma idempotente por sessão, impedindo denúncias duplicadas da mesma pessoa.

**Independent Test**: Enviar denúncia para um post ativo (201/200), reenviar com a mesma sessão (200 com `alreadyReported: true` sem duplicar contagem) e tentar denunciar post inexistente (404).

### Tests for User Story 3 (MANDATORY - TDD Integration Tests) ⚠️

- [X] T016 [P] [US3] Write integration tests for report registration and idempotency in `tests/integration/app/api/v1/unburden/report.test.ts`

### Implementation for User Story 3

- [X] T017 [P] [US3] Create validation schema for report body in `src/app/api/v1/schemas/register-report-body.schema.ts`
- [X] T018 [P] [US3] Create response DTO for report in `src/app/api/v1/dtos/report-response.dto.ts`
- [X] T019 [P] [US3] Define `IReportRepository` interface in `src/app/api/repositories/report/report-repository.interface.ts`
- [X] T020 [US3] Implement `PrismaReportRepository` in `src/app/api/repositories/report/prisma-report.repository.ts`
- [X] T021 [US3] Implement `RegisterReportService` in `src/app/api/services/register-report.service.ts`
- [X] T022 [US3] Implement factory `makeRegisterReportService` in `src/app/api/services/factories/make-register-report-service.ts`
- [X] T023 [US3] Implement Route Handler for report in `src/app/api/v1/unburden/[id]/report/route.ts`
- [X] T024 [US3] Register report route in `GatewayDispatcher` in `src/app/api/gateway/dispatcher/gateway-dispatcher.ts`
- [X] T025 [US3] Verify report integration tests PASS (Green) and refactor code cleanly without comments (Refactor)

**Checkpoint**: User Stories 1, 2 e 3 funcionando e testadas independentemente.

---

## Phase 6: User Story 4 - Auditoria Assíncrona por IA e Exclusão Lógica de Conteúdo Denunciado (Priority: P2)

**Goal**: Acionar worker assíncrono não-bloqueante quando um post acumular X denúncias (limiar: 3), reavaliar o conteúdo com a IA e executar exclusão lógica (`deletedAt`) se confirmado como `BLOCKED`, ocultando-o de todas as listagens públicas.

**Independent Test**: Enviar 3 denúncias de sessões distintas para um post tóxico, aguardar o worker assíncrono e validar que o post sofre soft delete, sumindo da listagem pública e retornando 404 em consultas individuais.

### Tests for User Story 4 (MANDATORY - TDD Integration Tests) ⚠️

- [X] T026 [P] [US4] Write integration tests for async audit and soft deletion in `tests/integration/app/api/v1/unburden/report-audit.test.ts`

### Implementation for User Story 4

- [X] T027 [US4] Implement `AuditUnburdenService` in `src/app/api/services/audit-unburden.service.ts` to asynchronously evaluate reported post and execute soft delete on `BLOCKED` verdict
- [X] T028 [US4] Implement factory `makeAuditUnburdenService` in `src/app/api/services/factories/make-audit-unburden-service.ts`
- [X] T029 [US4] Integrate async audit trigger into `RegisterReportService` in `src/app/api/services/register-report.service.ts` when report threshold is reached
- [X] T030 [US4] Create frontend HTTP report client in `src/http/register-report.ts`
- [X] T031 [US4] Integrate report button and sweetalert confirmation dialog in `src/components/Unburden.tsx`
- [X] T032 [US4] Verify async audit and soft delete integration tests PASS (Green) and refactor code cleanly without comments (Refactor)

**Checkpoint**: Todas as histórias de usuário funcionais, integradas e testadas ponta a ponta.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verificação de conformidade, limpeza, linting e garantia de 100% dos testes aprovados

- [X] T033 [P] Run linter to verify full code style compliance: `npm run lint`
- [X] T034 Run complete integration test suite with real PostgreSQL database: `npm test`
- [X] T035 [P] Update documentation in `GEMINI.md` and `README.md` reflecting new structured moderation, hash caching, and report audit capabilities

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências - pode iniciar imediatamente.
- **Foundational (Phase 2)**: Depende do Setup - BLOQUEIA todas as histórias de usuário.
- **User Story 1 (Phase 3)**: Depende da Fase 2 (Foundational).
- **User Story 2 (Phase 4)**: Depende da Fase 3 (User Story 1).
- **User Story 3 (Phase 5)**: Depende da Fase 2 (Foundational) e pode rodar em paralelo ou após US2.
- **User Story 4 (Phase 6)**: Depende da Fase 5 (User Story 3) e Fase 3 (User Story 1).
- **Polish (Phase 7)**: Depende da conclusão de todas as histórias de usuário.

---

## Parallel Opportunities

- **Fase 1**: T001 e T002 podem rodar em paralelo.
- **Fase 2**: T005 e T007 podem rodar em paralelo.
- **Fase 3 (US1)**: T008 (testes) e T009 (schema) podem rodar em paralelo.
- **Fase 5 (US3)**: T016 (testes), T017 (schema), T018 (DTO) e T019 (interface) podem rodar em paralelo.
- **Fase 6 (US4)**: T026 (testes) e T030 (cliente HTTP) podem rodar em paralelo.
- **Fase 7**: T033 e T035 podem rodar em paralelo.

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)
1. Completar Setup (Fase 1) e Foundational (Fase 2).
2. Implementar User Story 1 (Structured Outputs com Zod).
3. Implementar User Story 2 (Deduplicação e Cache por Hash).
4. Validar MVP com testes de integração.

### Entrega Incremental
1. Adicionar User Story 3 (Registro Idempotente de Denúncias).
2. Adicionar User Story 4 (Auditoria Assíncrona e Soft Delete).
3. Executar `npm run lint` e `npm test` (suite completa aprovada).
