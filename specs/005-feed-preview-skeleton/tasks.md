# Tasks: Feed Post Preview and Lively Skeleton Loading

**Input**: Design documents from `/specs/005-feed-preview-skeleton/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Testes de integração existentes e validação visual de ponta a ponta dos componentes e rotas.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Review environment and current component setup in `src/components/Unburden.tsx` and `src/components/UnburdenList.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core UI primitives that MUST be ready before user stories

- [x] T002 [P] Aprimorar o contraste e animação pulsante no componente base em `src/components/ui/skeleton.tsx`

**Checkpoint**: Base skeleton pronta para suportar o estado de carregamento do feed.

---

## Phase 3: User Story 1 - Prévia Concisa no Feed de Desabafos (Priority: P1) 🎯 MVP

**Goal**: Permitir que os cards na listagem apresentem textos truncados visualmente com navegação direta para a visualização completa.

**Independent Test**: Renderizar desabafos longos no feed e verificar limitação a 3-4 linhas com link funcional para `/unburden/[id]`.

### Implementation for User Story 1

- [x] T003 [US1] Adicionar suporte à propriedade `previewMode` e line-clamp de texto no componente `src/components/Unburden.tsx`
- [x] T004 [US1] Atualizar `src/components/UnburdenListItem.tsx` para passar `previewMode={true}` ao componente `Unburden`
- [x] T005 [US1] Garantir navegação acessível e preservação do evento de clique nos botões de apoio e denúncia em `src/components/Unburden.tsx`

**Checkpoint**: User Story 1 funcional - Feed com cards compactos e navegação para a página de detalhes.

---

## Phase 4: User Story 2 - Prévia Compacta de Conteúdo Sensível no Feed (Priority: P2)

**Goal**: Conter a proteção de desabafos sensíveis na mesma altura compacta da prévia, eliminando blocos gigantes de blur no feed.

**Independent Test**: Renderizar desabafo com `sensitive_content: true` no feed e confirmar altura contida e indicação para ler na íntegra.

### Implementation for User Story 2

- [x] T006 [US2] Implementar contêiner compacto de desfoque e proteção sensível para modo feed em `src/components/Unburden.tsx`
- [x] T007 [US2] Restringir o botão de alternância/revelação total de sensibilidade apenas para a página de detalhes (`/unburden/[id]`) em `src/components/Unburden.tsx`

**Checkpoint**: User Stories 1 e 2 funcionais - Feed uniforme mesmo para posts com conteúdo sensível.

---

## Phase 5: User Story 3 - Feedback Visual de Carregamento com Skeletons Dinâmicos (Priority: P3)

**Goal**: Exibir esqueletos animados com linhas e botões proporcionais aos cards reais enquanto os dados são carregados da API.

**Independent Test**: Simular carregamento inicial em `UnburdenList` e validar exibição de skeletons animados com contraste nítido em tema claro e escuro.

### Implementation for User Story 3

- [x] T008 [US3] Estruturar os cards de skeleton em `src/components/UnburdenList.tsx` refletindo a nova anatomia compacta (título, prévias e rodapé)
- [x] T009 [US3] Ajustar compatibilidade visual e contraste nos modos claro e escuro em `src/components/UnburdenList.tsx` e `src/components/ui/skeleton.tsx`

**Checkpoint**: Todas as histórias de usuário implementadas e validadas visualmente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificação de qualidade, testes e conformidade constitucional

- [x] T010 [P] Executar validação de formatação e lint: `npm run lint`
- [x] T011 Executar suite completa de testes de integração com banco de dados real: `npm test`
- [x] T012 Validar Clean Code em todos os arquivos modificados (ausência de comentários no código de implementação)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Inicia imediatamente.
- **Foundational (Phase 2)**: Depende do Setup.
- **User Story 1 (Phase 3)**: Depende de Foundational (MVP).
- **User Story 2 (Phase 4)**: Integra com US1 em `Unburden.tsx`.
- **User Story 3 (Phase 5)**: Integra com a anatomia definida em US1/US2.
- **Polish (Phase 6)**: Validação final após todas as histórias implementadas.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Concluir T001 e T002.
2. Implementar T003, T004 e T005.
3. Testar a visualização compacta dos cards no feed.

### Incremental Delivery
1. Entregar US1 (cards compactos com prévia).
2. Entregar US2 (tratamento compacto para desabafos sensíveis).
3. Entregar US3 (esqueletos dinâmicos de carregamento).
4. Rodar testes finais e lint.
