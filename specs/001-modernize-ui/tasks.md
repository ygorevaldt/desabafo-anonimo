---
description: "Task list for modernizing UI with Shadcn/UI, Redux, and Dark Mode"
---

# Tasks: Modernização da UI com Shadcn/UI, Redux e Modo Escuro

**Input**: Design documents from `specs/001-modernize-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Conforme a Constituição (Princípio I), testes de integração ponta a ponta com banco real garantem que todos os contratos da API permaneçam 100% íntegros e funcionais.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)

## Path Conventions

- **Frontend Pages**: `src/app/`
- **UI Components**: `src/components/` e `src/components/ui/`
- **Redux Store**: `src/store/`
- **HTTP Clients**: `src/http/`
- **Integration Tests**: `tests/integration/app/api/v1/`

---

## Phase 1: Setup (Shared Infrastructure & Dependencies)

**Purpose**: Instalação de pacotes e atualização do Next.js para compatibilidade Vercel

- [X] T001 Atualizar dependências no package.json (Next.js estável, clsx, tailwind-merge, class-variance-authority, @reduxjs/toolkit, react-redux, next-themes)
- [X] T002 Executar npm install e verificar resolução limpa de dependências
- [X] T003 [P] Criar utilitário cn em src/lib/utils.ts para suporte a componentes Shadcn/UI

---

## Phase 2: Foundational (Theme & Redux Core Architecture)

**Purpose**: Estrutura base de estado global e provedores visuais

- [X] T004 Configurar Redux Store centralizada em src/store/store.ts
- [X] T005 [P] Criar hooks tipados useAppDispatch e useAppSelector em src/store/hooks.ts
- [X] T006 Criar StoreProvider cliente em src/store/StoreProvider.tsx
- [X] T007 [P] Criar ThemeProvider em src/components/ThemeProvider.tsx com next-themes
- [X] T008 Atualizar src/app/layout.tsx envolvendo a aplicação com ThemeProvider e StoreProvider

---

## Phase 3: User Story 1 - Experiência Visual Acolhedora e Minimalista no Feed (Priority: P1) 🎯 MVP

**Goal**: Interface moderna, suave, no estilo Google/Material 3, com feed de desabafos e canal de apoio ao CVV 188 em evidência

**Independent Test**: Acessar `/` e `/unburdens`, validando layout limpo, cartões suaves e responsivos com desfoque de conteúdo sensível

### Tests for User Story 1 (MANDATÓRIO - Testes de Integração) ⚠️

- [X] T009 [P] [US1] Executar testes de integração de unburdens em tests/integration/app/api/v1/unburden/get.test.ts

### Implementation for User Story 1

- [X] T010 [P] [US1] Criar componente base Button em src/components/ui/button.tsx
- [X] T011 [P] [US1] Criar componente base Card em src/components/ui/card.tsx
- [X] T012 [P] [US1] Criar componente base Badge em src/components/ui/badge.tsx
- [X] T013 [P] [US1] Criar componente base Skeleton em src/components/ui/skeleton.tsx
- [X] T014 [US1] Implementar feedSlice em src/store/slices/feedSlice.ts para listagem e paginação
- [X] T015 [US1] Modernizar NavBar com identidade visual suave e destaque ao CVV 188 em src/components/NavBar.tsx
- [X] T016 [US1] Modernizar Footer minimalista em src/components/Footer.tsx
- [X] T017 [US1] Modernizar componente Unburden/UnburdenCard com design Google/Material em src/components/Unburden.tsx
- [X] T018 [US1] Atualizar UnburdenListItem em src/components/UnburdenListItem.tsx
- [X] T019 [US1] Modernizar UnburdenList conectada ao feedSlice do Redux em src/components/UnburdenList.tsx
- [X] T020 [US1] Modernizar página inicial em src/app/page.tsx e feed em src/app/unburdens/page.tsx

**Checkpoint**: User Story 1 completa e testável de forma independente.

---

## Phase 4: User Story 2 - Alternância Fluida de Tema Claro e Escuro (Priority: P2)

**Goal**: Permitir alternância entre modo claro e modo escuro com cores acolhedoras e sem FOUC

**Independent Test**: Alternar o tema através do botão no cabeçalho e verificar persistência em localStorage e transição sem flashes brancos

### Implementation for User Story 2

- [X] T021 [P] [US2] Definir variáveis CSS de tema (--background, --foreground, --card, --primary, etc.) em src/app/globals.css
- [X] T022 [P] [US2] Atualizar tailwind.config.ts para suporte a darkMode: ["class"] e cores semânticas do tema
- [X] T023 [US2] Implementar componente ThemeToggle em src/components/ThemeToggle.tsx
- [X] T024 [US2] Integrar ThemeToggle no cabeçalho em src/components/NavBar.tsx

**Checkpoint**: User Stories 1 e 2 operando perfeitamente juntas.

---

## Phase 5: User Story 3 - Publicação Acolhedora de Desabafo com Redux State (Priority: P2)

**Goal**: Formulário de desabafo seguro, sem distrações, com contador de caracteres, toggle de conforto IA e sincronização no Redux

**Independent Test**: Cadastrar novo desabafo e verificar inclusão automática no topo do feed e redirecionamento suave

### Tests for User Story 3 (MANDATÓRIO - Testes de Integração) ⚠️

- [X] T025 [P] [US3] Executar testes de integração de publicação em tests/integration/app/api/v1/unburden/post.test.ts

### Implementation for User Story 3

- [X] T026 [P] [US3] Criar componente Textarea em src/components/ui/textarea.tsx
- [X] T027 [P] [US3] Criar componente Input em src/components/ui/input.tsx
- [X] T028 [P] [US3] Criar componente Switch em src/components/ui/switch.tsx
- [X] T029 [US3] Modernizar UnburdenForm em src/components/UnburdenForm.tsx com contador e toggle de acolhimento IA
- [X] T030 [US3] Modernizar página de novo desabafo em src/app/unburden/page.tsx

**Checkpoint**: Fluxo de publicação operando com Redux e design moderno.

---

## Phase 6: User Story 4 - Apoio Empático e Comentários com Sincronização em Tempo Real (Priority: P3)

**Goal**: Permitir apoio instantâneo (otimista) e envio/visualização de comentários empáticos

**Independent Test**: Apoiar um desabafo e adicionar comentário na página de detalhes, observando atualização em tempo real

### Tests for User Story 4 (MANDATÓRIO - Testes de Integração) ⚠️

- [X] T031 [P] [US4] Executar testes de integração de comentários e apoios em tests/integration/app/api/v1/comment/post.test.ts e tests/integration/app/api/v1/support/post.test.ts

### Implementation for User Story 4

- [X] T032 [US4] Implementar activeUnburdenSlice em src/store/slices/activeUnburdenSlice.ts
- [X] T033 [US4] Modernizar SupportButton com microanimação e despacho otimista no Redux em src/components/SupportButton.tsx
- [X] T034 [US4] Modernizar CommentForm e CommentList em src/components/CommentForm.tsx e src/components/CommentList.tsx
- [X] T035 [US4] Modernizar página de detalhes do desabafo em src/app/unburden/[id]/page.tsx
- [X] T036 [US4] Modernizar página Sobre em src/app/about/page.tsx com apresentação acolhedora da iniciativa

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verificação completa de qualidade, build e conformidade

- [X] T037 [P] Executar linting completo: npm run lint
- [X] T038 Executar suíte completa de testes de integração: npm test
- [X] T039 Executar compilação de produção: npm run build
- [X] T040 Atualizar documentação no README.md se necessário

---

## Dependencies & Execution Order

- Phase 1 (Setup) -> Phase 2 (Foundational) -> Phase 3 (US1 - MVP) -> Phase 4 (US2 - Dark Mode) -> Phase 5 (US3 - Novo Desabafo) -> Phase 6 (US4 - Apoio & Comentários) -> Phase 7 (Polish).
