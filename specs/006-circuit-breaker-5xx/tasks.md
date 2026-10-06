# Tasks: Circuit Breaker 5xx Error Tripping and Downstream Resilience

**Input**: Design documents from `/specs/006-circuit-breaker-5xx/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: TDD com testes de integração é OBRIGATÓRIO (Princípio I da Constituição). Escrever os testes de integração PRIMEIRO em `tests/integration/app/api/gateway/circuit-breaker.test.ts`, verificar que FALHAM (Red), para então implementar (Green) e refatorar (Refactor).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup & Foundational

**Purpose**: Estrutura básica e exceções de suporte

- [ ] T001 [P] Criar a classe `DownstreamError` em `src/app/api/gateway/circuit-breaker/downstream-error.ts`

**Checkpoint**: Base foundational pronta para as histórias de usuário

---

## Phase 2: User Story 1 - Proteção Automática contra Falhas de Servidor / Banco de Dados (Priority: P1) 🎯 MVP

**Goal**: Garantir que respostas downstream com status HTTP >= 500 sejam computadas como falhas no Circuit Breaker do domínio, disparando a abertura automática para estado `OPEN` quando o limiar for alcançado.

**Independent Test**: Disparar sucessivas requisições que retornam status 500 no domínio `unburden` ou `status` e comprovar que o circuito abre automaticamente para `OPEN` e passa a responder 503 `CIRCUIT_BREAKER_OPEN` em < 20ms sem chamar o handler downstream.

### Tests for User Story 1 (MANDATORY - TDD Integration Tests) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation (Red)**

- [ ] T002 [US1] Adicionar teste de integração em `tests/integration/app/api/gateway/circuit-breaker.test.ts` verificando que respostas repetidas com HTTP 500 fazem o disjuntor abrir automaticamente para OPEN e falhar rápido com 503

### Implementation for User Story 1

- [ ] T003 [US1] Atualizar `src/app/api/gateway/[...path]/route.ts` para verificar `response.status >= HttpStatusCode.INTERNAL_SERVER_ERROR` dentro da ação do circuit breaker, lançando `DownstreamError`, e tratando o erro no catch para retornar a resposta 5xx original com cabeçalhos sanitizados enquanto o disjuntor estiver fechado
- [ ] T004 [US1] Verificar testes da US1 passando (Green) e refatorar conforme necessário

**Checkpoint**: User Story 1 totalmente funcional e testada de forma independente

---

## Phase 3: User Story 2 - Isolamento de Erros de Cliente 4xx (Priority: P2)

**Goal**: Garantir que respostas HTTP da família 4xx (400, 401, 404) não sejam contabilizadas como falhas de infraestrutura e mantenham o disjuntor fechado.

**Independent Test**: Executar uma sequência contínua de requisições inválidas que retornam status 400 ou 404 e verificar que o disjuntor permanece em estado `CLOSED`.

### Tests for User Story 2 (MANDATORY - TDD Integration Tests) ⚠️

- [ ] T005 [US2] Adicionar teste de integração em `tests/integration/app/api/gateway/circuit-breaker.test.ts` confirmando que requisições repetidas com status 400 ou 404 mantêm o disjuntor em estado `CLOSED`

### Implementation for User Story 2

- [ ] T006 [US2] Validar que o fluxo no gateway preserva respostas < 500 como resolvidas com sucesso e verificar testes da US2 passando (Green)

**Checkpoint**: User Story 2 totalmente funcional e testada de forma independente

---

## Phase 4: User Story 3 - Recuperação Gradual e Canary Request (Priority: P3)

**Goal**: Garantir que, após o tempo de resfriamento (`resetTimeout`), o disjuntor permita requisições canário e feche automaticamente se a resposta for saudável.

**Independent Test**: Abrir o circuito com falhas 5xx, aguardar o tempo de reset, enviar uma requisição bem-sucedida (status 200) e verificar retorno ao estado `CLOSED`.

### Tests for User Story 3 (MANDATORY - TDD Integration Tests) ⚠️

- [ ] T007 [US3] Atualizar/adicionar teste de integração em `tests/integration/app/api/gateway/circuit-breaker.test.ts` cobrindo o ciclo de recuperação automática com transição Half-Open e fechamento via canary request bem-sucedido

### Implementation for User Story 3

- [ ] T008 [US3] Verificar testes da US3 passando (Green) e refatorar sem duplicidade

**Checkpoint**: Todas as histórias de usuário implementadas e validadas

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verificações finais de qualidade e conformidade

- [ ] T009 Executar suíte completa de testes de integração via `npm test`
- [ ] T010 Executar build de produção via `npm run build`

---

## Dependencies & Execution Order

- **Phase 1 (Setup)** -> **Phase 2 (US1)** -> **Phase 3 (US2)** -> **Phase 4 (US3)** -> **Phase 5 (Polish)**
- US1 é o MVP e pré-requisito funcional do comportamento do Circuit Breaker.
- US2 e US3 validam estabilidade e recuperação sem introduzir novas dependências externas.
