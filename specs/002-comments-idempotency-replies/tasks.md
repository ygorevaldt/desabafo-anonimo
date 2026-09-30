# Tasks: Correção de Duplicação, Idempotência em Operações Críticas, Acolhimento Assíncrono por IA e Respostas a Comentários

**Input**: Design documents from `specs/002-comments-idempotency-replies/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verificação de tipos compartilhados e contratos de interface

- [X] T001 [P] Atualizar tipagem de comentários com campos de subcomentários em src/types/comment.type.ts
- [X] T002 [P] Atualizar DTO de resposta de comentários para incluir subcomentários em src/app/api/v1/dtos/comment-response.dto.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Estrutura básica de repositório e serviços que servem de base para as histórias

- [X] T003 Atualizar interface de repositório de comentário com suporte a subcomentários em src/app/api/repositories/comment/comment-repository.interface.ts
- [X] T004 Atualizar repositório Prisma de comentário com ordenação e inclusão de subcomentários em src/app/api/repositories/comment/prisma-comment.repository.ts

**Checkpoint**: Camada de repositório e DTOs pronta para suportar idempotência, desacoplamento assíncrono e respostas a comentários.

---

## Phase 3: User Story 1 - Correção da Duplicação de Comentários e Garantia de Idempotência (Priority: P1) 🎯 MVP

**Goal**: Garantir que a submissão de comentários seja estritamente idempotente, não gere duplicações visuais no Redux e bloqueie submissões simultâneas no frontend e backend.

**Independent Test**: Disparar ações repetidas e submeter comentário no formulário, verificando presença única na lista e contador correto.

### Tests for User Story 1 (MANDATORY - TDD Integration Tests) ⚠️

- [X] T005 [P] [US1] Adicionar testes de integração para prevenção de requisições duplicadas e idempotência de comentários em tests/integration/app/api/v1/comment/post.test.ts

### Implementation for User Story 1

- [X] T006 [US1] Blindar reducer addComment com checagem de unicidade por id em src/store/slices/activeUnburdenSlice.ts
- [X] T007 [US1] Eliminar dispatch duplicado de addComment mantendo disparo unívoco em src/components/CommentForm.tsx
- [X] T008 [US1] Ajustar handler de novo comentário na página do desabafo evitando re-dispatch redundante em src/app/unburden/[id]/page.tsx
- [X] T009 [US1] Garantir desabilitação rigorosa do botão de envio durante loading e prevenção de duplo clique em src/components/CommentForm.tsx

**Checkpoint**: User Story 1 completa e testada: comentários nunca mais duplicam na interface ou no estado global.

---

## Phase 4: User Story 2 - Acolhimento Imediato por IA de Forma Assíncrona e Não-Bloqueante (Priority: P1)

**Goal**: Desacoplar a geração de acolhimento por IA do ciclo síncrono da requisição HTTP de publicação do desabafo.

**Independent Test**: Chamar `POST /api/v1/unburden` com `wantsAiComfort: true` e validar que a resposta `201 Created` é retornada instantaneamente (< 300ms) sem aguardar a LLM, e que o comentário é gerado em background.

### Tests for User Story 2 (MANDATORY - TDD Integration Tests) ⚠️

- [X] T010 [P] [US2] Adicionar teste de integração garantindo retorno imediato de POST /api/v1/unburden com wantsAiComfort true em tests/integration/app/api/v1/unburden/post.test.ts

### Implementation for User Story 2

- [X] T011 [US2] Modificar RegisterUnburdenService para disparar geração de acolhimento em segundo plano (background async) em src/app/api/services/register-unburden.service.ts
- [X] T012 [US2] Assegurar captura resiliente de falhas de IA em background com fallback e logs sem afetar a resposta HTTP em src/app/api/services/register-unburden.service.ts

**Checkpoint**: User Story 2 completa: desabafos com IA são criados instantaneamente sem latência perceptível para o usuário.

---

## Phase 5: User Story 3 - Respostas a Comentários (Threaded / Subcomentários) (Priority: P2)

**Goal**: Permitir que usuários respondam diretamente a um comentário existente, com persistência adequada e renderização aninhada na UI.

**Independent Test**: Enviar uma resposta a um comentário via API e validar retorno `201`, consultar comentários do desabafo e validar lista de subcomentários, e testar UI de resposta inline no frontend.

### Tests for User Story 3 (MANDATORY - TDD Integration Tests) ⚠️

- [X] T013 [P] [US3] Adicionar teste de integração para criação de resposta a comentário em tests/integration/app/api/v1/comment/post.test.ts
- [X] T014 [P] [US3] Adicionar teste de integração para listagem de comentários com respostas aninhadas em tests/integration/app/api/v1/comment/get.test.ts

### Implementation for User Story 3

- [X] T015 [US3] Atualizar schema de validação para permitir comment_id (resposta) ou unburden_id em src/app/api/v1/schemas/register-comment-body.schema.ts
- [X] T016 [US3] Integrar RegisterSubcommentService no Route Handler POST /api/v1/comment para processar respostas em src/app/api/v1/comment/route.ts
- [X] T017 [US3] Atualizar ListCommentService para incluir subcomentários ordenados na listagem em src/app/api/services/list-comment.service.ts
- [X] T018 [US3] Criar função HTTP de envio de resposta a comentário em src/http/register-comment-reply.ts
- [X] T019 [US3] Adicionar reducer de adição de resposta a comentário específico em src/store/slices/activeUnburdenSlice.ts
- [X] T020 [US3] Atualizar CommentList e criar componente de formulário de resposta inline em src/components/CommentList.tsx

**Checkpoint**: User Story 3 completa: usuários podem dialogar respondendo diretamente a mensagens de apoio na UI.

---

## Phase 6: User Story 4 - Ajustes de Usabilidade: IA Desabilitada por Padrão e Tema Claro Padronizado (Priority: P3)

**Goal**: Padronizar a preferência default de tema para Light Mode, desativar acolhimento por IA por padrão e utilizar ícone sólido para o sol.

**Independent Test**: Verificar estado inicial de `wantsAiComfort` no formulário de desabafo e renderização padrão em Light Mode no layout.

### Implementation for User Story 4

- [X] T021 [P] [US4] Alterar estado inicial de wantsAiComfort para false em src/components/UnburdenForm.tsx
- [X] T022 [P] [US4] Configurar defaultTheme="light" e enableSystem={false} no ThemeProvider em src/app/layout.tsx
- [X] T023 [P] [US4] Atualizar ícone do sol para cor sólida e sóbria no botão de alternância de tema em src/components/ThemeToggle.tsx

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verificação de qualidade geral e execução de testes

- [X] T024 Executar validação de linter com npm run lint
- [X] T025 Executar suite de testes automatizados com npm test / vitest run
- [X] T026 Validar cenários ponta a ponta conforme quickstart.md

---

## Phase 8: Refinamentos Críticos de Usabilidade e Consistência (Priority: P1)

**Goal**: Garantir fixação do comentário de IA no topo da lista, completude estrita do texto da LLM e sincronização fidedigna dos contadores de comentários entre o feed e a página de detalhes.

- [X] T027 [P] Fixar comentário de IA sempre no topo (index 0) no repositório (`findMany`), reducer (`setComments`, `addComment`) e adicionar badge visual `📌 Fixado` em `src/components/CommentList.tsx`.
- [X] T028 [P] Sincronizar contagem total de comentários e respostas (subcomentários) no feed (`feedSlice.ts`, `UnburdenList.tsx`) e na página de detalhes (`unburden/[id]/page.tsx`), com self-healing recursivo de órfãos em `prisma-unburden.repository.ts`.
- [X] T029 [P] Eliminar risco de truncamento do acolhimento por IA: elevação para 1500 tokens, instrução estrita de conclusão e validação pós-geração em `src/app/api/services/ai-comfort.service.ts`.

