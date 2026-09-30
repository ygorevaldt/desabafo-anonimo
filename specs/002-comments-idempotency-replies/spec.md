# Feature Specification: Correção de Duplicação, Idempotência em Operações Críticas, Acolhimento Assíncrono por IA e Respostas a Comentários

**Feature Branch**: `002-comments-idempotency-replies`

**Created**: 2026-09-30

**Status**: Validated

**Input**: User description: "Ao comentar um desabafo, o comentário é publicado duas vezes, preciso que isso seja resolvido e que todas as operações criticas seram cagantidas com Idepotencia. (adicionar na constituição tbm). Ao publicar um desabafo com a opção de acolhimento imediato por IA, o desabafo deve ser publicado sem esperar a API da LLM, esse acolhimento gerado por IA deve ser assíncrono, sem causar lentidao pro usuário. Implementar a feature de poder comentar nos comentários dos desabafos tbm. E ajustar a UI pra comportar essa feature."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Correção da Duplicação de Comentários e Garantia de Idempotência no Frontend e Backend (Priority: P1) 🎯 MVP

Como apoiador(a) da comunidade ao enviar uma palavra de carinho para um desabafo,
Eu quero que o meu comentário seja adicionado exatamente uma vez na lista de apoios e no banco de dados,
Para que o espaço de acolhimento permaneça organizado, sem poluição visual ou mensagens duplicadas.

**Why this priority**: É uma correção crítica de integridade de dados e experiência do usuário. O usuário atualmente vê o mesmo comentário duplicado imediatamente após a submissão.

**Independent Test**:
- Disparar a submissão de um comentário através do `CommentForm` e verificar que o Redux armazena apenas uma ocorrência do comentário.
- Validar que cliques múltiplos repetidos no botão de envio são bloqueados enquanto a requisição estiver ativa.
- Disparar o reducer `addComment` múltiplas vezes com o mesmo ID de comentário e validar que o comentário não é inserido em duplicidade e a contagem `comments_amount` não é incrementada incorretamente.

**Acceptance Scenarios**:

1. **Given** um desabafo com comentários existentes, **When** o usuário submete um novo comentário válido pelo `CommentForm`, **Then** o comentário é enviado à API uma única vez, adicionado ao estado global uma única vez e exibido exatamente uma vez na lista "Apoios da Comunidade".
2. **Given** o formulário de envio de comentário durante o envio (estado `isLoading`), **When** o usuário clica novamente no botão de envio ou pressiona Enter repetidamente, **Then** o formulário impede submissões simultâneas desabilitando os botões e ignorando novas chamadas.
3. **Given** o reducer `addComment` do slice `activeUnburden`, **When** uma ação é disparada contendo um comentário cujo `id` já existe em `state.comments`, **Then** o reducer ignora a inserção duplicada e mantém o contador de comentários intacto (idempotência no estado).
4. **Given** o Route Handler `POST /api/v1/comment`, **When** receber requisições repetidas de criação de comentário com o mesmo conteúdo para o mesmo desabafo em janela imediata ou identificador de idempotência, **Then** o backend assegura integridade evitando duplicações fantasmas.

---

### User Story 2 - Acolhimento Imediato por IA de Forma Assíncrona e Não-Bloqueante (Priority: P1)

Como autor(a) que publica um desabafo com a opção de acolhimento por IA ativada,
Eu quero que o meu desabafo seja publicado e confirmado instantaneamente na interface,
Para que eu não sofra com lentidão ou tempo de espera prolongado pela resposta da LLM.

**Why this priority**: A latência de chamadas à API do Gemini (frequentemente de 2 a 5 segundos) bloqueava a resposta HTTP da criação do desabafo (`POST /api/v1/unburden`), degradando sensivelmente a percepção de performance do produto.

**Independent Test**:
- Executar requisição de criação de desabafo com `wantsAiComfort: true` e validar que o Route Handler responde `201 Created` imediatamente.
- Verificar que o acolhimento por IA é despachado em background e inserido como comentário de apoio ao desabafo assincronamente.
- Testar cenário de falha da IA (timeout ou erro) e verificar que o desabafo do usuário permanece intacto e acessível.

**Acceptance Scenarios**:

1. **Given** um usuário submetendo um desabafo com `wantsAiComfort: true`, **When** a requisição atinge `POST /api/v1/unburden`, **Then** o desabafo é salvo e a resposta HTTP `201 Created` é retornada de imediato ao cliente, sem bloquear a resposta pela geração de texto da IA.
2. **Given** a finalização da requisição de criação do desabafo com acolhimento solicitado, **When** a rotina em segundo plano invoca o serviço de acolhimento e obtém a mensagem, **Then** o comentário inicial da IA (`🤖 [Acolhimento Inicial - IA]`) é persistido vinculado ao desabafo recém-criado.
3. **Given** uma falha ou timeout da API de IA durante a execução assíncrona, **When** o erro ocorre, **Then** a falha é capturada e registrada em log de advertência sem afetar o desabafo já entregue ao autor.

---

### User Story 3 - Respostas a Comentários (Subcomentários / Threaded Comments) (Priority: P2)

Como usuário(a) lendo as mensagens de apoio da comunidade em um desabafo,
Eu quero poder responder diretamente a um comentário específico,
Para dialogar, agradecer ou aprofundar o conforto em formato de conversa aninhada.

**Why this priority**: Permite conversas de apoio bidirecionais entre os membros da comunidade, aumentando o engajamento e a empatia da plataforma.

**Independent Test**:
- Disparar requisição `POST /api/v1/comment` (ou subcomentário) associando o `comment_id` pai e validar retorno `201 Created` com o novo comentário vinculado.
- Realizar requisição `GET /api/v1/comment` para o desabafo e validar que os comentários trazem a lista de respostas (`subcomments`) aninhada.
- Na interface, validar que cada card de comentário exibe o botão "Responder", abre a caixa de texto e renderiza as respostas indentadas abaixo do comentário principal.

**Acceptance Scenarios**:

1. **Given** um comentário existente em um desabafo, **When** um usuário envia uma resposta com texto entre 5 e 1500 caracteres, **Then** o sistema persiste a resposta vinculada ao comentário pai e retorna status `201 Created`.
2. **Given** a consulta de comentários de um desabafo via `GET /api/v1/comment?unburden_id=UUID`, **When** os dados são retornados, **Then** cada comentário inclui suas respectivas respostas válidas (ordenadas cronologicamente) no DTO de resposta.
3. **Given** a visualização de comentários na tela do desabafo, **When** o usuário clica em "Responder" em um comentário, **Then** uma área de resposta específica para aquele comentário se abre na interface.
4. **Given** a confirmação do envio da resposta pelo formulário de subcomentário, **When** a requisição tem sucesso, **Then** a resposta aparece aninhada sob o comentário pai de forma imediata e o formulário de resposta é fechado/limpo.
5. **Given** uma resposta contendo termos bloqueados pelas regras de moderação, **When** enviada, **Then** a requisição é rejeitada com código `401 Unauthorized` e um alerta amigável é exibido ao usuário.
---

### User Story 4 - Ajustes de Usabilidade: Acolhimento por IA Desabilitado por Default e Tema Claro Padronizado (Priority: P3)

Como usuário(a) acessando a plataforma e criando um desabafo,
Eu quero que o tema padrão inicial seja o Light Mode e que a opção de acolhimento por IA venha desmarcada por padrão,
Para ter uma experiência visual consistente e clara, escolhendo conscientemente quando desejo ativar o suporte de IA.

**Why this priority**: Melhora a previsibilidade da experiência de usuário e evita envio indesejado de prompts para IA por descuido.

**Independent Test**:
- Ao abrir o formulário de desabafo (`/unburden`), o switch de acolhimento por IA deve iniciar desligado (`false`).
- Ao carregar a aplicação pela primeira vez sem preferência salva em localStorage, a interface deve renderizar no modo claro (`light`).
- O ícone do sol no botão de alternância de tema deve ser exibido com cor sólida e sóbria, compatível com a estilização da lua do modo escuro.

**Acceptance Scenarios**:

1. **Given** um usuário abrindo o formulário de novo desabafo, **When** a página é carregada, **Then** o campo/switch "Quero acolhimento imediato por IA" está desmarcado por padrão (`wantsAiComfort: false`).
2. **Given** um novo visitante na plataforma, **When** acessa qualquer página do sistema, **Then** a aplicação é exibida por padrão em modo claro (`light mode`), sem depender da preferência do sistema operacional.
3. **Given** a interface renderizada em modo escuro, **When** o usuário observa o botão de alternância de tema, **Then** o ícone do sol é exibido em cor sólida (monocromática / text-foreground ou text-zinc-300), idêntico ao tratamento visual da lua.

---

### Edge Cases

- O que acontece se o usuário clicar freneticamente no botão de envio de comentário? O formulário bloqueia o botão durante a submissão (`disabled={isLoading}`) e impede despachos duplicados.
- O que acontece se uma resposta for enviada para um comentário que acabou de ser excluído ou não existe? O backend retorna erro `404 Not Found` (`RegisterNotFoundException`).
- O que acontece se um comentário pai não possuir respostas? O array `subcomments` é retornado como lista vazia `[]`, mantendo a consistência do contrato.
- O que acontece se a resposta contiver menos de 5 caracteres ou mais de 1500 caracteres? O Zod schema no backend e as validações de formulário no frontend rejeitam com `400 Bad Request`.
- O que acontece se a geração assíncrona de IA demorar mais do que o esperado? A interface do usuário já recebeu o desabafo com sucesso e o autor é redirecionado normalmente; o comentário de acolhimento aparecerá quando a página for recarregada ou na próxima leitura.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O frontend NÃO DEVE disparar mais de um dispatch da mesma entidade recém-criada para a store Redux.
- **FR-002**: O reducer `addComment` DEVE verificar se o comentário já existe pelo campo `id` antes de adicioná-lo ao array de comentários.
- **FR-003**: Os botões de submissão de comentários e respostas DEVEM ser desabilitados durante o envio para evitar múltiplos envios.
- **FR-004**: O endpoint `POST /api/v1/unburden` DEVE responder com status `201 Created` sem aguardar a conclusão da API do Google Gemini quando `wantsAiComfort: true`.
- **FR-005**: O serviço de criação de desabafo DEVE delegar a geração de acolhimento por IA para execução não-bloqueante/assíncrona em background.
- **FR-006**: O sistema DEVE permitir a criação de respostas a comentários (subcomentários) vinculados a um comentário pai (`subcommentId` no modelo `Comment`).
- **FR-007**: As respostas a comentários DEVEM passar pela moderação de conteúdo da IA (`AiModerationService`).
- **FR-008**: O endpoint `GET /api/v1/comment` DEVE retornar a lista de subcomentários associados a cada comentário pai.
- **FR-009**: O componente `CommentList` e itens de comentário DEVEM suportar visualização aninhada/indentada de respostas e botão para abrir o formulário de resposta rápida.
- **FR-010**: O formulário de criação de desabafo DEVE inicializar a opção de acolhimento por IA desligada (`wantsAiComfort: false`).
- **FR-011**: O provedor de temas DEVE configurar `defaultTheme="light"` e `enableSystem={false}` por padrão.
- **FR-012**: O ícone do tema claro (sol) no alternador de tema DEVE utilizar estilização de cor sólida compatível com a lua do tema escuro.

### Key Entities

- **Unburden (Desabafo)**: Registro do desabafo com `id`, `title`, `content`, `sensitiveContent`, `createdAt`.
- **Comment (Comentário / Mensagem de Apoio)**: Registro de mensagem de apoio com `id`, `content`, `unburdenId`, `subcommentId` (opcional, apontando para o comentário pai caso seja uma resposta), `sensitiveContent`, `createdAt`.
- **Subcomment (Resposta)**: Instância de `Comment` onde `subcommentId` aponta para outro `Comment.id`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O número de comentários visíveis na tela após a submissão de um comentário é rigorosamente 1 (zero duplicações na UI).
- **SC-002**: O tempo de resposta HTTP do endpoint `POST /api/v1/unburden` com `wantsAiComfort: true` reduz de ~3000ms+ para menos de 300ms em condições normais de banco local.
- **SC-003**: 100% dos comentários pais podem receber respostas aninhadas visíveis na interface.
- **SC-004**: Todos os cenários de aceite possuem cobertura via testes de integração aprovados com 100% de sucesso.

## Assumptions

- O banco de dados PostgreSQL já possui suporte à auto-relação de `Comment` (`subcommentId` mapeado para `id_subcomentario` no schema Prisma).
- Não há necessidade de aninhamento recursivo infinito; 1 nível de profundidade (comentário pai -> respostas) atende completamente o caso de uso e mantém a UI limpa e acessível.
- A biblioteca `@reduxjs/toolkit` existente gerencia o estado do desabafo ativo e pode incorporar a lógica de subcomentários ou atualização de árvore.
