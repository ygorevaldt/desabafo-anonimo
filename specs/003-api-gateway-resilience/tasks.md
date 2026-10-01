# Tasks: Padrão API Gateway com Proxy Reverso, Circuit Breaker e Rate Limiting

**Input**: Design documents from `specs/003-api-gateway-resilience/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/gateway-api.md`, `quickstart.md`  

**Tests**: TDD com testes de integração é **OBRIGATÓRIO** (Princípio I da Constituição). Escrever os testes de integração PRIMEIRO para cada história de usuário, verificar que FALHAM (Red), para então implementar (Green) e refatorar sem comentários explicativos no código (Clean Code).

---

## Phase 1: Setup (Dependencies & Infrastructure)

**Purpose**: Instalar dependências externas e criar estruturas base de tipos e utilitários compartilhados do Gateway.

- [x] T001 Instalar dependências `opossum` e `@types/opossum` em package.json
- [x] T002 [P] Criar tipagens e contratos de requisição e resposta do Gateway em src/app/api/gateway/types/gateway.types.ts
- [x] T003 [P] Implementar utilitário de extração segura de IP do cliente a partir de cabeçalhos proxy em src/app/api/gateway/utils/extract-client-ip.util.ts
- [x] T004 [P] Implementar utilitário de sanitização e supressão de cabeçalhos de identificação de servidor (X-Powered-By) em src/app/api/gateway/utils/sanitize-headers.util.ts

---

## Phase 2: Foundational (Core Gateway Dispatcher & Error Handler)

**Purpose**: Infraestrutura fundamental de despacho de requisições e tratamento centralizado de erros do Gateway.

**⚠️ CRITICAL**: Nenhuma história de usuário pode ser finalizada antes da conclusão desta fase.

- [x] T005 Implementar despachante interno de rotas downstream (GatewayDispatcher) mapeando rotas públicas para os Route Handlers internos em src/app/api/gateway/dispatcher/gateway-dispatcher.ts
- [x] T006 [P] Implementar tratador de erro centralizado com sanitização de stack traces e erro 500 padronizado em src/app/api/gateway/utils/handle-gateway-error.util.ts

**Checkpoint**: Base do Gateway configurada e pronta para o desenvolvimento orientado a testes (TDD).

---

## Phase 3: User Story 1 - Roteamento Seguro e Encapsulamento via API Gateway (Priority: P1) 🎯 MVP

**Goal**: Atuar como proxy reverso seguro, recebendo requisições em `/api/gateway/[...path]`, delegando aos serviços internos, sanitizando erros não tratados e suprimindo assinaturas tecnológicas.

**Independent Test**: Disparar requisições válidas de leitura e escrita através de `/api/gateway/unburden` e `/api/gateway/comment`, verificando respostas com status 200/201 corretos, headers sanitizados (sem `X-Powered-By`) e mascaramento de erros 500 sem stack trace.

### Tests for User Story 1 (MANDATORY - TDD Integration Tests) ⚠️
> **NOTE: Escrever estes testes PRIMEIRO e garantir que FALHEM (Red) antes da implementação.**

- [x] T007 [P] [US1] Criar testes de integração para roteamento proxy transparente, supressão de headers e sanitização de erros 500 em tests/integration/app/api/gateway/proxy.test.ts

### Implementation for User Story 1

- [x] T008 [US1] Implementar Route Handler dinâmico catch-all com suporte a GET, POST, PUT e DELETE em src/app/api/gateway/[...path]/route.ts
- [x] T009 [US1] Integrar sanitização de cabeçalhos de saída e mascaramento de erros ao Route Handler em src/app/api/gateway/[...path]/route.ts
- [x] T010 [US1] Executar testes de integração de US1 e verificar aprovação com 100% de sucesso (Green) e refatorar sem comentários em código (Refactor)

**Checkpoint**: User Story 1 totalmente funcional e testável de forma independente (MVP concluído).

---

## Phase 4: User Story 2 - Proteção contra Sobrecarga e Abuso com Rate Limiting (Priority: P1)

**Goal**: Proteger o backend contra floods e abusos através de limitador de taxa em memória por IP (janela deslizante), retornando HTTP `429 Too Many Requests` com cabeçalho `Retry-After` e limites diferenciados para leitura (60 req/min) e mutação (15 req/min).

**Independent Test**: Disparar rajada de requisições excedendo a cota do IP configurada e validar bloqueio imediato com status 429, headers `Retry-After` e `X-RateLimit-*`, bem como restauração do acesso após o término da janela.

### Tests for User Story 2 (MANDATORY - TDD Integration Tests) ⚠️
> **NOTE: Escrever estes testes PRIMEIRO e garantir que FALHEM (Red) antes da implementação.**

- [x] T011 [P] [US2] Criar testes de integração para rate limiting, bloqueio com 429, cabeçalho Retry-After e renovação de cota em tests/integration/app/api/gateway/rate-limit.test.ts

### Implementation for User Story 2

- [x] T012 [P] [US2] Criar tipagens e políticas de rate limiting (leitura vs mutação) em src/app/api/gateway/rate-limit/rate-limit.types.ts
- [x] T013 [US2] Implementar serviço de limitação de taxa em memória (RateLimiter) com janela deslizante e limpeza em src/app/api/gateway/rate-limit/rate-limiter.ts
- [x] T014 [US2] Integrar verificação de Rate Limiting e injeção de cabeçalhos no Route Handler em src/app/api/gateway/[...path]/route.ts
- [x] T015 [US2] Executar testes de integração de US2 e verificar aprovação com 100% de sucesso (Green) e refatorar sem comentários em código (Refactor)

**Checkpoint**: User Stories 1 e 2 operando e protegendo a aplicação de forma independente.

---

## Phase 5: User Story 3 - Resiliência e Prevenção de Falhas em Cascata com Circuit Breaker (Priority: P2)

**Goal**: Monitorar a saúde dos serviços downstream utilizando Opossum com circuitos isolados por domínio, aplicando timeout de 5s, limiar de erro de 50%, repouso de 10s e fail-fast imediato com HTTP `503 Service Unavailable` em estado aberto.

**Independent Test**: Simular falhas consecutivas downstream atingindo o limiar de tolerância, validar transição para OPEN e fail-fast com status 503 sem acionar o serviço interno; validar teste no modo HALF-OPEN e restauração para CLOSED.

### Tests for User Story 3 (MANDATORY - TDD Integration Tests) ⚠️
> **NOTE: Escrever estes testes PRIMEIRO e garantir que FALHEM (Red) antes da implementação.**

- [x] T016 [P] [US3] Criar testes de integração para abertura do Circuit Breaker, fail-fast com 503 e recuperação HALF-OPEN em tests/integration/app/api/gateway/circuit-breaker.test.ts

### Implementation for User Story 3

- [x] T017 [P] [US3] Criar tipagens e configurações de Circuit Breaker em src/app/api/gateway/circuit-breaker/circuit-breaker.types.ts
- [x] T018 [US3] Implementar registro de circuitos isolados por domínio (CircuitBreakerRegistry) usando Opossum em src/app/api/gateway/circuit-breaker/circuit-breaker-registry.ts
- [x] T019 [US3] Integrar execução protegida por Circuit Breaker e captura de EOPENBREAKER no Route Handler em src/app/api/gateway/[...path]/route.ts
- [x] T020 [US3] Executar testes de integração de US3 e verificar aprovação com 100% de sucesso (Green) e refatorar sem comentários em código (Refactor)

**Checkpoint**: User Stories 1, 2 e 3 integradas e resilientes contra falhas em cascata.

---

## Phase 6: User Story 4 - Adaptação do Cliente Frontend e Tratamento Amigável de Erros de Resiliência (Priority: P2)

**Goal**: Migrar o cliente HTTP do frontend para se comunicar exclusivamente através do Gateway (`/api/gateway/*`) e exibir alertas compreensíveis e humanizados para respostas 429 e 503.

**Independent Test**: Validar que as chamadas originadas no frontend alcançam os endpoints do Gateway e que respostas com códigos 429 ou 503 acionam modais informativos via SweetAlert2 sem quebrar o fluxo do usuário.

### Implementation for User Story 4

- [x] T021 [P] [US4] Adicionar funções auxiliares de alerta amigável para limite de taxa e instabilidade temporária em src/utils/alert.ts
- [x] T022 [US4] Configurar Axios com baseURL e interceptors para tratamento automático de respostas 429 e 503 em src/http/client.ts
- [x] T023 [P] [US4] Atualizar rotas de requisição de unburden para utilizar o caminho do Gateway em src/http/fetch-unburdens-list.ts, src/http/fetch-unique-unburden.ts e src/http/register-unburden.ts
- [x] T024 [P] [US4] Atualizar rotas de requisição de comentários e apoios para o Gateway em src/http/fetch-unburden-comments.ts, src/http/register-comment.ts, src/http/register-comment-reply.ts e src/http/register-support-to-unburden.ts
- [x] T025 [US4] Validar integração do cliente frontend com as rotas do Gateway e tratamento de erros de resiliência

**Checkpoint**: Todas as histórias de usuário (US1 a US4) completas, testadas e integradas.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verificação global de qualidade, ausência de regressões e conformidade estrita com a Constituição.

- [x] T026 [P] Executar checagem de linter: npm run lint
- [x] T027 Executar suíte completa de testes de integração com banco de dados real: npm test
- [x] T028 [P] Atualizar documentação e links de verificação em specs/003-api-gateway-resilience/quickstart.md
- [x] T029 Revisão final de Clean Code assegurando conformidade estrita com o Princípio VIII da Constituição (zero comentários explicativos em código de produção)
- [x] T030 Revisão final de DRY assegurando conformidade estrita com o Princípio VII da Constituição (zero duplicação de regras, tipos e constantes)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências prévias — inicialização imediata.
- **Foundational (Phase 2)**: Depende da conclusão do Setup — bloqueia todas as histórias de usuário.
- **User Stories (Phase 3 a 6)**:
  - **US1 (Phase 3)**: Depende da Fase Foundational.
  - **US2 (Phase 4)**: Depende de US1 e da Fase Foundational (pode ter testes escritos em paralelo).
  - **US3 (Phase 5)**: Depende de US1 e da Fase Foundational.
  - **US4 (Phase 6)**: Depende de US1, US2 e US3 para validar o fluxo ponta a ponta com o frontend.
- **Polish (Phase 7)**: Depende da conclusão de todas as histórias de usuário.

---

## Parallel Execution Examples

### Execução Paralela da Fase 1 (Setup)
```bash
# Tipos e Utilitários executados em arquivos independentes:
Task: T002 Criar tipagens e contratos do Gateway em src/app/api/gateway/types/gateway.types.ts
Task: T003 Implementar utilitário de extração de IP em src/app/api/gateway/utils/extract-client-ip.util.ts
Task: T004 Implementar utilitário de sanitização de headers em src/app/api/gateway/utils/sanitize-headers.util.ts
```

### Execução Paralela TDD (Escrever Testes Primeiro)
```bash
# Testes de integração escritos em paralelo por arquivo de teste:
Task: T007 [US1] Criar testes de integração de proxy em tests/integration/app/api/gateway/proxy.test.ts
Task: T011 [US2] Criar testes de integração de rate limit em tests/integration/app/api/gateway/rate-limit.test.ts
Task: T016 [US3] Criar testes de integração de circuit breaker em tests/integration/app/api/gateway/circuit-breaker.test.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Apenas)
1. Concluir Phase 1 (Setup de dependências e tipos base).
2. Concluir Phase 2 (Foundational: despachante e sanitização de erro 500).
3. Concluir Phase 3 (User Story 1: TDD de proxy reverso e Route Handler catch-all).
4. **VALIDAÇÃO INDEPENDENTE DO MVP**: Executar testes de integração de US1 e comprovar o roteamento e encapsulamento inicial.

### Entrega Incremental
1. **Incremento 1 (MVP)**: Gateway básico redirecionando chamadas com headers limpos e segurança de erros (US1).
2. **Incremento 2**: Blindagem contra floods e sobrecargas adicionando Rate Limiting em memória (US2).
3. **Incremento 3**: Blindagem contra falhas em cascata integrando Circuit Breaker Opossum com fail-fast (US3).
4. **Incremento 4**: Integração completa do cliente frontend com tratamento amigável de limites e contingência (US4).
5. **Verificação Final**: `npm run lint` e `npm test` garantindo 100% de integridade e aderência à Constituição.
