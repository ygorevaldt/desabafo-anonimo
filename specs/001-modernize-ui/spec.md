# Feature Specification: Modernização da Interface com Shadcn/UI, Redux e Modo Escuro

**Feature Branch**: `001-modernize-ui`

**Created**: 2026-09-29

**Status**: Ready

**Input**: User description: "Fazer modernização da UI do projeto focando nos seguintes princípios: não perder a essência do site; design moderno com cores leves e acolhedoras; design clean e agradável ao usuário para fazer com que ele sinta vontade de desabafar e fornecer apoio; utilizar biblioteca Shadcn/UI com TailwindCSS; utilizar Redux para gerenciamento de estado melhorado; interface clean, moderna e acolhedora como os projetos do Google; fornecer opção dark/light mode ao usuário."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE.
  CONSTITUIÇÃO DO PROJETO: Cada Acceptance Scenario (Given-When-Then) DEVE ser diretamente
  traduzido em um teste de integração no ciclo TDD antes do início da implementação.
-->

### User Story 1 - Experiência Visual Acolhedora e Minimalista no Feed (Priority: P1)

Como uma pessoa buscando um espaço seguro para expressar sentimentos ou apoiar o próximo,
quero navegar em uma interface limpa, calorosa, livre de poluição visual e inspirada no estilo moderno e amigável do Google,
para me sentir verdadeiramente acolhido e confortável ao ler e interagir com os desabafos da comunidade.

**Why this priority**: É a porta de entrada e a essência emocional do produto. Se a primeira impressão for caótica ou desconfortável, o usuário não se sentirá seguro para desabafar ou acolher outros.

**Independent Test**: Acessar a página inicial e a lista de desabafos, verificando renderização harmoniosa dos cartões, tipografia suave, espaçamento equilibrado, botões claros e acesso imediato ao canal de apoio emergencial (CVV 188).

**Acceptance Scenarios**:

1. **Given** um visitante acessando a página inicial do Desabafo Anônimo,
   **When** a página é carregada,
   **Then** o cabeçalho exibe uma mensagem acolhedora em tons suaves, um botão proeminente e convidativo para "Desabafar", o atalho de apoio rápido ao CVV 188 e os cartões de desabafo renderizados com acabamento visual moderno e legível.

2. **Given** um desabafo classificado como sensível no feed,
   **When** o usuário visualiza o cartão,
   **Then** o conteúdo sensível é mantido protegido por desfoque visual suave com alerta amigável de conteúdo sensível e botão claro para revelar/ocultar sem saltos bruscos de layout.

---

### User Story 2 - Alternância Fluida de Tema Claro e Escuro (Priority: P2)

Como usuário navegando no site (frequentemente à noite ou em momentos de insônia e angústia),
quero alternar entre o Modo Claro (cores leves e calorosas) e o Modo Escuro (tons escuros confortáveis e não agressivos),
para que a leitura não cause fadiga ocular em nenhum momento do dia.

**Why this priority**: Desabafos ocorrem com grande frequência em horários noturnos. Um tema escuro bem planejado com cores suaves e acolhedoras proporciona conforto visual crucial.

**Independent Test**: Clicar no alternador de tema na barra de navegação e verificar a transição instantânea de paleta de cores (fundo, texto, cartões, bordas), persistindo a escolha entre recarregamentos e respeitando a preferência do sistema operacional por padrão.

**Acceptance Scenarios**:

1. **Given** que o usuário está no modo claro padrão,
   **When** ele clica no botão de alternância de tema no cabeçalho,
   **Then** toda a interface transiciona suavemente para o modo escuro (Dark Mode), aplicando fundo escuro acolhedor, tipografia de alto contraste confortável e preservando a tonalidade rose suave nos elementos de destaque.

2. **Given** que o usuário definiu o modo escuro e recarrega a página ou fecha o navegador,
   **When** ele retorna ao site,
   **Then** a preferência de tema escuro é lembrada e aplicada imediatamente sem piscar de tela branca (FOUC).

---

### User Story 3 - Publicação Acolhedora de Desabafo com Redux State (Priority: P2)

Como uma pessoa precisando desabafar sobre um momento difícil ou conquista,
quero preencher um formulário simples, focado e livre de distrações, com a opção de receber acolhimento de IA,
para registrar meu desabafo e ver o estado da aplicação atualizado imediatamente sem recarregamentos lentos ou inconsistências.

**Why this priority**: Registrar um desabafo é a ação primária de valor do produto; a experiência de escrita precisa transmitir paz, segurança e fluidez imediata.

**Independent Test**: Submeter um novo desabafo com e sem a opção de IA e verificar a transição visual, o feedback de sucesso suave e a inserção reativa no estado global do Redux sem quebras.

**Acceptance Scenarios**:

1. **Given** o usuário na página de novo desabafo `/unburden`,
   **When** ele digita o título e o conteúdo,
   **Then** o formulário fornece contagem visível de caracteres, campo de texto confortável com foco visual suave e um toggle acolhedor para solicitar conforto por IA.

2. **Given** que o usuário envia o desabafo com sucesso,
   **When** a resposta de criação é confirmada,
   **Then** o desabafo recém-criado é adicionado ao estado global do Redux e o usuário é redirecionado de maneira fluida para o desabafo ou para o feed atualizado.

---

### User Story 4 - Apoio Empático e Comentários com Sincronização em Tempo Real de Estado (Priority: P3)

Como membro da comunidade lendo um desabafo que ressoa comigo,
quero clicar em "Apoiar" ou enviar um comentário de conforto e ver a contagem e o estado atualizados instantaneamente,
para sentir que meu gesto de carinho teve impacto imediato na vida daquela pessoa.

**Why this priority**: A conexão humana e o apoio comunitário fecham o ciclo de conforto mútuo da plataforma.

**Independent Test**: Clicar no botão de apoio e postar um comentário em um desabafo, verificando atualização otimista/reativa do contador via Redux e estado visual desabilitado para apoios já concedidos na sessão.

**Acceptance Scenarios**:

1. **Given** um desabafo na listagem ou na página de detalhes,
   **When** o usuário clica no botão de Apoiar,
   **Then** o botão reflete visualmente o apoio concedido com microinteração suave, o contador de apoios incrementa de imediato no estado Redux e o estado persiste para a sessão do usuário.

2. **Given** a página de detalhes de um desabafo,
   **When** o usuário envia um comentário de acolhimento,
   **Then** o comentário é incluído na lista de comentários através da store do Redux e exibido de forma fluida com indicação clara de tempo e autor anônimo.

---

### Edge Cases

- **Erro de Conexão durante o envio**: Se a rede falhar ao publicar desabafo ou comentário, a interface deve exibir um toast/alerta amigável, sem perder o texto digitado pelo usuário.
- **Transição de Tema com Conteúdo Sensível**: O desfoque e os avisos de segurança/CVV devem manter legibilidade e contraste estrito tanto no tema claro quanto no escuro.
- **Carregamento Lento ou Sem Desabafos**: Em caso de lista vazia ou primeira carga, deve haver esqueletos (skeletons) de carregamento elegantes e mensagem de incentivo acolhedora para o primeiro desabafo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE fornecer componentes de interface construídos com Shadcn/UI e TailwindCSS, com estética clean, minimalista e acolhedora, respeitando bordas arredondadas e espaçamentos harmônicos.
- **FR-002**: O sistema DEVE fornecer um seletor de tema (Light Mode / Dark Mode) acessível no cabeçalho de navegação.
- **FR-003**: O sistema DEVE persistir a escolha de tema do usuário no armazenamento local (`localStorage`) e aplicar a classe de tema no documento raiz sem flashes visuais.
- **FR-004**: O sistema DEVE gerenciar o estado dos desabafos, comentários, contadores de apoio e status de carregamento através do Redux Toolkit (`@reduxjs/toolkit` e `react-redux`).
- **FR-005**: O sistema DEVE manter integralmente as funcionalidades e a essência originais do Desabafo Anônimo (anonimato absoluto, apoio via botão de coração, moderação de conteúdo sensível, acolhimento de IA opcional e canal de apoio CVV 188 em evidência).
- **FR-006**: O sistema DEVE fornecer feedback visual acessível para estados de carregamento (Skeletons/Spinners suaves) e estados vazios com ilustrações ou mensagens empáticas.
- **FR-007**: O sistema DEVE assegurar total responsividade em dispositivos móveis, tablets e telas desktop, com tipografia legível e botões acessíveis ao toque.
- **FR-008**: O sistema DEVE utilizar a paleta temática oficial acolhedora: tons de Rose/Coral suaves para ações principais, neutros quentes para fundos e cartões, e cinzas balanceados para tipografia secundária.

### Key Entities

- **ThemeState**: Estado do tema visual (`theme: 'light' | 'dark' | 'system'`).
- **UnburdenFeedState**: Estado do feed no Redux (lista de desabafos, paginação atual, total de registros, filtros, status de loading).
- **ActiveUnburdenState**: Estado do desabafo atualmente visualizado e sua árvore de comentários/subcomentários.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Transição de tema (Light/Dark) ocorre instantaneamente em menos de 100ms sem travamento perceptível de tela.
- **SC-002**: O tempo percebido de resposta na interação de apoio reduz para < 50ms através da atualização otimista no Redux.
- **SC-003**: 100% das páginas existentes (`/`, `/about`, `/unburdens`, `/unburden`, `/unburden/[id]`) modernizadas com a nova identidade visual.
- **SC-004**: 100% dos testes de integração existentes da API e dos novos componentes permanecem totalmente verdes (`npm test`).
- **SC-005**: Acessibilidade e contraste de cores atendem aos padrões WCAG AA tanto no modo claro quanto no modo escuro.

## Assumptions

- A stack de base utiliza Next.js 15 App Router e TailwindCSS v3/v4 já configurado.
- Os Route Handlers e a API REST `/api/v1/...` permanecem inalterados em seus contratos, garantindo retrocompatibilidade total com a constituição do projeto.
- O Redux Toolkit será estruturado de forma desacoplada com Provider dedicado no nível de layout cliente.
- O Shadcn/UI utilizará a abordagem de componentes modulares sob `src/components/ui/` utilizando `lucide-react` ou `react-icons` para iconografia consistente.
