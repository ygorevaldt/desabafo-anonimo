# Feature Specification: Curadoria e Moderação de Conteúdo com Inteligência Artificial, Saídas Estruturadas e Fluxo Assíncrono de Denúncias

**Feature Branch**: `004-llm-curation-moderation`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "O mecanismo de curadoria de posts que impedem que posts toxicos com apologia a morte, estupro e etc sejam postados é feito com LLM, tbm precisamos implementar a LLM pra determinar se o conteúdo pode ser publicado mas é sensível. Como a presença da LLM é crítica neste ponto do app, precisamos implementar structured outputs com schemas zod para tornar as respostas dela deterministicas e previsíveis, buscando a taxa de sucesso máxima nessas validações. Além disso, se um post receber quantidade x de denuncias, estartar um fluxo assíncrono onde a LLM le o post e se realmente não atende aos critérios de conteúdo que pode ser publicado, chama o service de exclusão lógica do post. Também precisamos garantir que a LLM não valide o mesmo post várias vezes. Para isso, utilizar idepotencia e cache da propria API da LLM do google com chave rash."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Curadoria de Conteúdo com Structured Outputs e Classificação Determinística (Priority: P1) 🎯 MVP

Como visitante ou membro da comunidade que escreve um desabafo na plataforma,
Eu quero que o meu texto seja avaliado de forma rápida, justa e previsível por uma IA de moderação com respostas estritamente estruturadas,
Para que conteúdos de apoio mútuo e desabafos de sofrimento pessoal sejam acolhidos com os devidos avisos de sensibilidade, enquanto conteúdos nocivos de ódio, violência ou crimes sejam bloqueados sumariamente.

**Why this priority**: É o núcleo de segurança e qualidade do produto. Garantir que a IA utilize saídas estruturadas estritas elimina alucinações de formato e garante que 100% das decisões de moderação (`APPROVED`, `SENSITIVE`, `BLOCKED`) sejam previsíveis e respeitem as regras da comunidade.

**Independent Test**:
- Enviar desabafos com conteúdo seguro e verificar aprovação com status HTTP 201 e flag `sensitiveContent: false`.
- Enviar desabafos expressando sofrimento pessoal e dor emocional e verificar aprovação com flag `sensitiveContent: true`.
- Enviar publicações com apologia a crimes, estupro ou violência explícita e verificar bloqueio com status HTTP 401 Unauthorized.
- Validar que as respostas da IA seguem rigorosamente o contrato de schema estruturado em todas as chamadas.

**Acceptance Scenarios**:

1. **Given** um desabafo expressando vivências cotidianas, desabafos de trabalho ou tristeza comum, **When** submetido para publicação, **Then** o serviço de moderação por IA classifica o conteúdo como `APPROVED` e o desabafo é persistido com sensibilidade desmarcada.
2. **Given** um desabafo contendo relatos de traumas, sofrimento profundo ou dor emocional em primeira pessoa, **When** submetido para publicação, **Then** a IA classifica o conteúdo como `SENSITIVE`, persistindo o desabafo com a flag de conteúdo sensível ativada para exibição de avisos e indicação do canal de apoio CVV 188.
3. **Given** uma tentativa de publicação contendo apologia a estupro, crimes hediondos, ameaças a terceiros ou incitação a suicídio/violência, **When** submetido para publicação, **Then** a IA classifica o conteúdo como `BLOCKED` e o sistema rejeita a criação retornando erro semântico de conteúdo não autorizado com código HTTP 401.
4. **Given** uma requisição de moderação por IA, **When** o modelo de linguagem processa a solicitação, **Then** o resultado é entregue em formato estruturado tipado sem falhas de sintaxe ou propriedades faltantes.

---

### User Story 2 - Deduplicação, Idempotência e Caching de Moderação por Chave Hash (Priority: P1)

Como mantenedor da plataforma e usuário publicando desabafos,
Eu quero que o sistema identifique se um texto já foi previamente avaliado pela IA através de uma chave hash determinística,
Para evitar chamadas redundantes à API de IA, reduzir a latência de publicação, otimizar custos operacionais e garantir idempotência no processamento.

**Why this priority**: Evita que submissões repetidas ou textos idênticos consumam cota e tempo de processamento desnecessários da API de IA, garantindo tempos de resposta ultrarrápidos para requisições repetidas.

**Independent Test**:
- Enviar um texto inédito para moderação e validar que uma consulta à IA é realizada e o resultado é armazenado no cache indexado pelo hash.
- Reenviar o mesmo texto (ou texto com espaços em branco redundantes normalizados) e verificar que o veredito é recuperado diretamente do cache em tempo sub-milissegundo, sem invocar a API externa.
- Validar a integridade e precisão do hash gerado para diferentes tamanhos de texto.

**Acceptance Scenarios**:

1. **Given** um conteúdo textual inédito submetido à moderação, **When** o sistema calcula o hash do conteúdo e não encontra correspondência em cache, **Then** a moderação via IA é executada normalmente e o veredito estruturado é armazenado no cache sob a respectiva chave hash.
2. **Given** um conteúdo textual cujo hash já possui veredito registrado em cache, **When** uma nova solicitação de moderação com o mesmo conteúdo é requisitada, **Then** o sistema retorna imediatamente o veredito em cache sem acionar a API externa de IA.
3. **Given** um texto com variações cosméticas de espaços no início/fim ou quebras de linha redundantes, **When** normalizado e convertido em hash, **Then** o sistema correlaciona corretamente ao cache do conteúdo correspondente.

---

### User Story 3 - Registro Idempotente de Denúncias por Usuário (Priority: P2)

Como membro da comunidade lendo publicações na plataforma,
Eu quero ter a possibilidade de denunciar um desabafo que eu considere abusivo ou em violação às diretrizes,
Para que a comunidade colabore ativamente na manutenção de um ambiente respeitoso e seguro.

**Why this priority**: Empodera os usuários a sinalizar conteúdos que possam ter escapado aos filtros iniciais ou que gerem desconforto coletivo, alimentando o ciclo de auditoria comunitária.

**Independent Test**:
- Enviar uma denúncia válida para um post ativo e verificar retorno com sucesso e incremento no registro de denúncias.
- Enviar uma segunda tentativa de denúncia para o mesmo post a partir da mesma sessão/usuário e validar resposta informando que a denúncia já foi registrada, sem duplicar a contagem.
- Tentar denunciar um post inexistente ou já excluído e verificar retorno com código HTTP 404 Not Found.

**Acceptance Scenarios**:

1. **Given** um post ativo publicado na plataforma e um visitante com sessão válida, **When** o usuário submete uma denúncia contra o post, **Then** a denúncia é registrada no sistema vinculada à sessão do denunciante.
2. **Given** um usuário que já denunciou um determinado post anteriormente, **When** tenta submeter uma nova denúncia para o mesmo post com a mesma sessão, **Then** o sistema reconhece a idempotência e responde com sucesso/aviso de que a denúncia já foi computada, sem criar registros duplicados.
3. **Given** uma requisição de denúncia direcionada a um post inexistente ou previamente excluído, **When** processada pelo sistema, **Then** o sistema rejeita a operação com status HTTP 404 Not Found.

---

### User Story 4 - Auditoria Assíncrona por IA e Exclusão Lógica de Conteúdo Denunciado (Priority: P2)

Como mantenedor da plataforma e comunidade de usuários,
Eu quero que o sistema inicie automaticamente um fluxo assíncrono de reavaliação por IA quando um post acumular um volume estipulado de denúncias,
Para que posts que violem as regras sejam excluídos logicamente de forma autônoma e célere, sem depender de intervenção manual demorada e sem travar a requisição do usuário que denunciou.

**Why this priority**: Fecha o ciclo de proteção automatizada da plataforma, garantindo que denúncias legítimas resultem na remoção imediata de conteúdos tóxicos através de decisão auditável por IA.

**Independent Test**:
- Registrar denúncias consecutivas até atingir o limiar estipulado e verificar que o fluxo assíncrono é disparado em background sem atrasar a resposta da rota HTTP.
- Simular a reavaliação de um post com conteúdo classificado como `BLOCKED` e verificar que o serviço de exclusão lógica é invocado, alterando o estado do post.
- Consultar a listagem pública e verificar que o post excluído logicamente não aparece mais para os usuários.
- Consultar a rota de detalhe do post excluído e validar retorno com status HTTP 404 Not Found.
- Simular a reavaliação de um post com conteúdo classificado como `APPROVED` ou `SENSITIVE` e verificar que o post permanece ativo na plataforma.

**Acceptance Scenarios**:

1. **Given** um post que acumula o número limite de denúncias únicas estabelecido (ex.: X denúncias), **When** a denúncia que atinge o limiar é processada, **Then** o sistema agenda imediatamente a execução do fluxo assíncrono de auditoria por IA em segundo plano e responde imediatamente ao usuário.
2. **Given** a execução do fluxo assíncrono de auditoria sobre um post denunciado, **When** a IA reavalia o conteúdo e emite veredito `BLOCKED`, **Then** o sistema aciona o serviço de exclusão lógica (soft delete), desativando a exibição pública do post.
3. **Given** um post desativado por exclusão lógica, **When** qualquer usuário solicita a listagem pública de desabafos ou tenta acessar seu endpoint individual, **Then** o post não é retornado nas listagens e o acesso direto responde com código HTTP 404.
4. **Given** um post denunciado cuja reavaliação pela IA resulte em veredito `APPROVED` ou `SENSITIVE`, **When** a auditoria assíncrona é concluída, **Then** o post é mantido publicado na plataforma sem sofrer exclusão lógica, ajustando a classificação de sensibilidade se necessário.

---

### Edge Cases

- O que acontece se a API de IA do Google estiver temporariamente indisponível durante a criação de um post? O sistema aciona o mecanismo de fallback heurístico determinístico com regras de palavras-chave e temperatura de conteúdo para manter o serviço operante sem riscos de segurança.
- O que acontece se múltiplos usuários denunciarem o mesmo post quase simultaneamente no momento em que atinge o limiar? O sistema garante atomicidade no controle de denúncias e assegura que apenas um único fluxo assíncrono de auditoria seja engatilhado para o post.
- O que acontece se a reavaliação assíncrona sofrer falha de rede transitória? O fluxo captura a falha graciosamente, registra em log de monitoramento e mantém o post seguro até a próxima tentativa de sincronização, sem travar outras operações do servidor.
- O que acontece se um post denunciado for excluído logicamente enquanto usuários comentavam nele? Comentários em andamento vinculados ao post deixam de ser exibidos publicamente e novas tentativas de comentar respondem com status 404 Registro Não Encontrado.
- O que acontece se um texto contiver apenas caracteres especiais ou emojis? A normalização de hash e o validador de schema identificam o conteúdo e a IA categoriza adequadamente de acordo com as diretrizes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE submeter todo novo desabafo à curadoria automatizada por Inteligência Artificial antes da sua persistência no banco de dados.
- **FR-002**: O serviço de moderação por IA DEVE utilizar Saídas Estruturadas (Structured Outputs com schema estrito) para garantir respostas determinísticas, tipadas e sem inconsistências de formatação.
- **FR-003**: O schema estruturado de moderação DEVE conter obrigatoriamente os campos: `status` (`APPROVED`, `SENSITIVE`, `BLOCKED`), `category` (categoria da classificação), `isSensitive` (booleano) e `reason` (justificativa textual concisa).
- **FR-004**: O sistema DEVE rejeitar imediatamente a criação de desabafos classificados como `BLOCKED`, retornando exceção de domínio mapeada para código HTTP `401 Unauthorized`.
- **FR-005**: O sistema DEVE permitir a publicação de desabafos classificados como `SENSITIVE`, persistindo a entidade com a sinalização de conteúdo sensível para exibição protegida na interface com aviso e canal de apoio (CVV 188).
- **FR-006**: O sistema DEVE implementar mecanismo de deduplicação e cache de moderação baseado no hash determinístico do conteúdo textual normalizado do post.
- **FR-007**: O sistema DEVE consultar o cache de hash antes de emitir qualquer nova chamada à API de IA externa, reutilizando o veredito prévio caso o conteúdo já tenha sido avaliado.
- **FR-008**: O sistema DEVE disponibilizar endpoint e serviço para registro de denúncias de posts por membros da comunidade.
- **FR-009**: O registro de denúncias DEVE ser idempotente por sessão de usuário, impedindo que uma mesma sessão registre denúncias repetidas contra o mesmo post.
- **FR-010**: O sistema DEVE contabilizar o número de denúncias distintas recebidas por cada post e comparar contra o limiar configurado de auditoria.
- **FR-011**: Ao atingir o limiar estipulado de denúncias, o sistema DEVE acionar um fluxo assíncrono de auditoria em segundo plano sem bloquear ou atrasar a resposta HTTP da denúncia.
- **FR-012**: O fluxo assíncrono de auditoria DEVE submeter o conteúdo do post denunciado à reavaliação pela IA utilizando as diretrizes de moderação estruturada.
- **FR-013**: Caso a auditoria da IA conclua que o post denunciado é `BLOCKED`, o sistema DEVE executar a exclusão lógica (soft delete) do post no repositório.
- **FR-014**: O sistema DEVE filtrar e ocultar automaticamente posts excluídos logicamente de todas as listagens públicas e retornar status HTTP 404 em consultas individuais por identificador.
- **FR-015**: O sistema DEVE manter suporte a fallback heurístico em caso de falha de conexão ou ausência de chave de IA, assegurando a continuidade ininterrupta do serviço.
- **FR-016**: A interface web DEVE disponibilizar botão de denúncia com diálogo de confirmação claro e feedback amigável via alerta notificando a conclusão da sinalização.

### Key Entities

- **ModerationVerdict**: Estrutura imutável representando a decisão determinística da IA, contendo status (`APPROVED`, `SENSITIVE`, `BLOCKED`), categoria temática, indicador de sensibilidade, justificativa e carimbo de data/hora.
- **ContentHash**: Identificador determinístico calculado a partir do conteúdo textual normalizado (título e corpo) para indexação de vereditos e reaproveitamento em cache.
- **Report (Denúncia)**: Registro representando a sinalização de um post, contendo o identificador do desabafo denunciado, o identificador da sessão do denunciante e a data/hora do registro.
- **Unburden (com Soft Delete e Denúncias)**: Entidade de desabafo estendida com campo de exclusão lógica (ex.: `deletedAt`), indicador de conteúdo sensível e contagem/relação de denúncias acumuladas.
- **AuditTask**: Tarefa de processamento assíncrono em segundo plano encarregada de reavaliar o post denunciado e decidir a manutenção ou exclusão lógica do conteúdo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das respostas emitidas pelo serviço de moderação da IA são validadas com sucesso pelo schema estruturado, com taxa de erro de parsing de 0%.
- **SC-002**: 100% das requisições com conteúdo textual idêntico já avaliado são resolvidas via cache de hash com tempo de resposta inferior a 10ms, sem realizar requisições externas adicionais à API de IA.
- **SC-003**: 100% das submissões contendo apologia explícita a crimes, estupro, ódio ou violência são barradas na criação com status HTTP 401.
- **SC-004**: O disparo do fluxo assíncrono de auditoria ao atingir o limiar de denúncias ocorre em background sem adicionar mais de 20ms ao tempo de resposta da requisição de denúncia do usuário.
- **SC-005**: 100% dos posts denunciados que tenham violação confirmada pela auditoria de IA são removidos da visibilidade pública via exclusão lógica, respondendo com 404 em acessos subsequentes.
- **SC-006**: 100% das tentativas de denúncias duplicadas a partir da mesma sessão para o mesmo post são tratadas de forma idempotente, sem inflar a contagem de denúncias.
- **SC-007**: 100% dos cenários de aceite documentados possuem cobertura de testes de integração ponta a ponta com banco de dados real aprovados na suíte Vitest.

## Assumptions

- O limiar padrão para disparo da auditoria assíncrona por IA é de 3 denúncias únicas provenientes de diferentes sessões, podendo ser parametrizado por variável de ambiente.
- A exclusão lógica (soft delete) é implementada no banco de dados através da marcação temporal de exclusão (`deletedAt`), preservando o registro para auditoria e histórico interno enquanto é estritamente filtrado nas consultas públicas (`findMany` e `findUnique`).
- A geração da chave hash utiliza algoritmo determinístico padrão (SHA-256) sobre a representação textual normalizada (espaços condensados e minúsculas).
- O cache de vereditos de moderação atua em camada de alta velocidade em memória/repositório com estratégia de expiração controlada e suporte às capacidades de cache da API do Google GenAI.
- A execução do worker de auditoria assíncrona opera de forma não-bloqueante (fire-and-forget / background task gerenciada), em perfeita harmonia com o Princípio IV da Constituição do projeto.
