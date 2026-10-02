# Feature Specification: Feed Post Preview and Lively Skeleton Loading

**Feature Branch**: `master`

**Created**: 2026-10-02

**Status**: Ready for Review

**Input**: User description: "fix direto na master mesmo para tratar um detalhe no layout. - Quando o post é muito grande, na listagem dos posts ele ocupa muito espaço vertical da página, deixando layout feio, e tbm não instiga o usuário a entrar no post e deixar uma mensagem de apoio. Então proponho deixar apenas uma prévia do post na listagem, o usuário só poderá ver ele na íntegra de clicar nele. Isso já elimina o problema de um bloco de blur de conteúdo sensivel enorme quando o post é grande demais. - Ao acessar a página de listagem de posts (inicio, desabafos) até que os posts sejam trazidos do backend, no lugar deles ficam apenas quadrados brancos estáticos. Ok a ideia é legal, mas deveria funcionar com um layout mais vivo estilo eskeleton, que da a entender que algo esta sendo carregado."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Prévia Concisa no Feed de Desabafos (Priority: P1)

Como uma pessoa navegando pelo feed (página inicial ou listagem de desabafos), quero visualizar apenas uma prévia resumida e compacta dos textos longos em cada card, para que o layout permaneça harmonioso, escaneável e me instigue a entrar no desabafo para ler na íntegra e prestar apoio.

**Why this priority**: É o cerne da experiência de navegação da comunidade. Cartões de tamanho excessivo sobrecarregam a visão, desestimulam o engajamento e prejudicam o fluxo de acolhimento mútuo.

**Independent Test**: Pode ser testado de forma independente renderizando posts de tamanhos variados na listagem e verificando que textos extensos recebem truncamento/limitação de linhas padronizada com link para detalhes, enquanto a página individual (`/unburden/[id]`) renderiza 100% do conteúdo original.

**Acceptance Scenarios**:

1. **Given** um desabafo cadastrado com texto longo (com múltiplos parágrafos ou mais de 250 caracteres), **When** o usuário visualiza a listagem de desabafos na Home (`/`) ou em Todos os Desabafos (`/unburdens`), **Then** o card deve exibir apenas uma prévia limitada verticalmente com indicação de continuidade/reticências, mantendo a altura do card balanceada.
2. **Given** um card de desabafo na listagem exibindo um resumo/prévia, **When** o usuário clica no título ou na área do card, **Then** o sistema deve navegar para a página de detalhes (`/unburden/[id]`), onde o texto é apresentado em sua totalidade.
3. **Given** um desabafo cadastrado com texto curto (menor que o limite da prévia), **When** o usuário visualiza o card na listagem, **Then** o texto deve ser exibido completamente sem cortes artificiais, mantendo o espaçamento uniforme dos cards.

---

### User Story 2 - Prévia Compacta e Tratamento Harmonioso de Conteúdo Sensível no Feed (Priority: P2)

Como uma pessoa leitora no feed, quero que desabafos com conteúdo sensível apresentem sua caixa de aviso e proteção contidas nas dimensões compactas da prévia, para evitar blocos gigantes de desfoque/blur que quebram o layout visual da página.

**Why this priority**: Posts sensíveis extensos atualmente geram um bloco opaco/borrado desproporcional no meio do feed. Padronizar o contêiner de proteção sensível mantém o refúgio seguro e esteticamente agradável.

**Independent Test**: Pode ser testado isoladamente exibindo desabafos com `sensitive_content: true` no feed e validando que o elemento de proteção mantém altura uniforme e alinhada à prévia com aviso visual de sensibilidade e indicação de acesso.

**Acceptance Scenarios**:

1. **Given** um desabafo classificado como conteúdo sensível com texto longo, **When** o card for renderizado no feed, **Then** o bloco de aviso e proteção com efeito de desfoque deve ocupar a mesma altura padronizada da prévia, sem esticar o card verticalmente.
2. **Given** um card de conteúdo sensível na listagem, **When** o usuário clica no desabafo para abrir seus detalhes, **Then** na página individual (`/unburden/[id]`) o usuário tem acesso ao controle completo de visualização/ocultação do texto sensível na íntegra.

---

### User Story 3 - Feedback Visual de Carregamento Vivo com Skeletons Dinâmicos (Priority: P3)

Como uma pessoa usuária acessando o site, quero ver esqueletos de carregamento ("skeletons") animados, pulsantes e com contraste perceptível enquanto os desabafos são buscados no backend, para ter certeza de que o sistema está carregando o conteúdo de forma viva e interativa.

**Why this priority**: Substitui os retângulos brancos estáticos quase imperceptíveis por uma animação fluida que transmite velocidade, polimento e confiabilidade na experiência do usuário.

**Independent Test**: Pode ser testado isoladamente acionando o estado de carregamento inicial da listagem e verificando que a estrutura visual do skeleton exibe animação ativa de pulso/shimmer com contraste nítido em tema claro e escuro.

**Acceptance Scenarios**:

1. **Given** que a listagem de desabafos está aguardando a resposta da requisição de busca, **When** o usuário acessa a página inicial ou a página de desabafos, **Then** devem ser exibidos cards de skeleton simulando o título, linhas de prévia de texto com larguras variadas e rodapé de ações, com pulso animado perceptível no tema ativo.
2. **Given** que a busca de desabafos é finalizada com sucesso, **When** os dados são recebidos pelo cliente, **Then** os cards de skeleton devem ser substituídos suavemente pela lista de desabafos reais.

---

### Edge Cases

- **Textos contínuos sem espaço**: Desabafos contendo palavras ou caracteres contínuos sem espaçamento não devem vazar horizontalmente para fora da borda do card de prévia.
- **Quebras de linha múltiplas**: Desabafos com sequências repetidas de saltos de linha (`\n\n\n`) devem ter seu espaçamento sanitizado visualmente na prévia para não consumir a altura de linhas úteis.
- **Falhas de rede ou indisponibilidade**: Se a requisição de desabafos falhar durante o estado de carregamento, o sistema deve ocultar os skeletons e exibir um estado de erro amigável com botão para tentar novamente.
- **Ações rápidas no card**: O clique nos botões de apoio e denúncia dentro do card da listagem não deve disparar acidentalmente a navegação para a página de detalhes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE limitar a exibição do conteúdo de texto dos desabafos nos cards de listagem (Home e Todos os Desabafos) a uma prévia concisa de até 3 a 4 linhas visuais (line-clamp).
- **FR-002**: O sistema DEVE disponibilizar navegação direta e acessível para a página de detalhes do desabafo (`/unburden/[id]`) ao clicar no título ou na área principal do card de listagem.
- **FR-003**: O sistema DEVE exibir o texto completo sem qualquer truncamento ou limitação de linhas na página individual do desabafo (`/unburden/[id]`).
- **FR-004**: O sistema DEVE restringir o contêiner de proteção e desfoque de desabafos sensíveis no feed para não exceder a altura compacta da área de prévia.
- **FR-005**: O sistema DEVE renderizar cards de skeleton com contraste adequado e animação pulsante ativa durante o estado de carregamento inicial das listagens de desabafos.
- **FR-006**: O esqueleto de carregamento DEVE mimetizar visualmente a anatomia do card compacto (título, múltiplas linhas de prévia com larguras variadas e elementos do rodapé).
- **FR-007**: O sistema DEVE garantir que o esqueleto de carregamento mantenha visibilidade e contraste estético harmonioso tanto no tema claro quanto no tema escuro.
- **FR-008**: O sistema DEVE manter o comportamento independente dos botões de apoio (`SupportButton`) e denúncia nos cards do feed sem conflito de propagação de eventos com o link de navegação.

### Key Entities

- **Unburden (Desabafo)**: Registro público de desabafo anônimo contendo identificador único (`id`), título (`title`), texto completo (`content`), flag de conteúdo sensível (`sensitive_content`), data de publicação (`created_at`), quantidade de apoios (`supports_amount`) e quantidade de comentários (`comments_amount`).
- **Feed Card (Visualização Resumida)**: Representação em componente de interface do desabafo projetada para navegação em listas, provendo prévia textual, proteção sensível compacta, contadores e atalho para a visão completa.
- **Feed Skeleton Loader**: Componente de placeholder animado que preserva a geometria e as proporções do Feed Card enquanto a listagem assíncrona é carregada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A altura vertical de cards com desabafos longos no feed é reduzida em pelo menos 50%, proporcionando uma visualização homogênea e facilitando a rolagem da página.
- **SC-002**: 100% dos desabafos listados no feed permitem acesso à sua versão integral em no máximo 1 clique.
- **SC-003**: 100% dos cards com conteúdo sensível no feed mantêm a altura de proteção nivelada com o padrão da prévia, sem blocos desproporcionais de desfoque.
- **SC-004**: Durante a fase de carregamento inicial, 100% dos placeholders de desabafos apresentam animação e contraste perceptíveis em modo claro e escuro.
- **SC-005**: Todas as interações de apoio rápido e denúncia dentro do card de listagem permanecem 100% operacionais sem navegação indesejada.

## Assumptions

- O backend e as APIs existentes (`GET /api/v1/unburden`, `GET /api/v1/unburden/[id]`) já fornecem os dados completos necessários e não exigem alterações estruturais de contrato de dados.
- O truncamento textual no feed é gerenciado na camada de apresentação (CSS / Tailwind e componentes React), garantindo renderização rápida e flexível.
- A implementação será realizada diretamente na branch `master` do repositório, conforme solicitado pelo usuário.
- O padrão de design e tokens de cor definidos em `globals.css` e na biblioteca de componentes do projeto são mantidos.
