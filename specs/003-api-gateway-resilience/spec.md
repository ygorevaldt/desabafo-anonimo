# Feature Specification: Padrão API Gateway com Proxy Reverso, Circuit Breaker e Rate Limiting

**Feature Branch**: `003-api-gateway-resilience`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "Implementar pattern api gateway como porta de entrada, com proxy, circuit breaker e rate limit (Opossum). O objetivo é tornar o backend seguro, a requisição do client frontend não irá conhecer a implementação do backend nem será capaz de derrubar o serviço."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Roteamento Seguro e Encapsulamento via API Gateway (Proxy Reverso) (Priority: P1) 🎯 MVP

Como visitante ou membro da comunidade navegando ou interagindo na plataforma,
Eu quero que todas as requisições da interface sejam enviadas através de um ponto de entrada centralizado e seguro (API Gateway),
Para que eu receba dados e envie publicações com agilidade, sem que a estrutura interna, topologia ou erros crus do backend fiquem expostos ao ambiente público.

**Why this priority**: É o alicerce fundamental do padrão API Gateway. Estabelece a porta de entrada única da aplicação, blindando o backend contra exposição direta e permitindo aplicar políticas de segurança e resiliência de forma centralizada.

**Independent Test**:
- Enviar requisições válidas de leitura e escrita (desabafos, comentários, apoios) para o Gateway e validar que o retorno e o status HTTP correspondem aos dados esperados do backend.
- Enviar requisições que acionem falhas internas no backend e validar que o Gateway retorna respostas padronizadas, sem vazar stack traces, detalhes de conexão ou tecnologias subjacentes.
- Inspecionar cabeçalhos de resposta do Gateway e verificar a supressão de cabeçalhos de identificação de servidor (ex.: `X-Powered-By`).

**Acceptance Scenarios**:

1. **Given** uma requisição de leitura ou criação válida originada do cliente frontend, **When** enviada ao ponto de entrada do API Gateway, **Then** o Gateway despacha a chamada ao serviço correspondente e entrega a resposta com os dados corretos e código de status HTTP apropriado (ex.: 200 OK, 201 Created).
2. **Given** uma requisição que resulte em erro de validação ou erro de domínio, **When** processada pelo Gateway, **Then** a resposta é entregue no contrato padronizado de erro da aplicação, preservando os códigos semânticos (ex.: 400 Bad Request, 401 Unauthorized, 404 Not Found).
3. **Given** uma falha crítica ou exceção não tratada em serviços internos, **When** interceptada pelo Gateway, **Then** o cliente recebe uma resposta sanitizada com status 500 Internal Server Error, garantindo que nenhum rastreio de pilha (stack trace) ou detalhe de infraestrutura seja exposto.
4. **Given** qualquer resposta trafegada pelo Gateway, **When** entregue ao cliente final, **Then** os cabeçalhos de resposta eliminam assinaturas de infraestrutura interna ou frameworks.

---

### User Story 2 - Proteção contra Sobrecarga e Abuso com Rate Limiting (Priority: P1)

Como mantenedor da plataforma e membro da comunidade,
Eu quero que o API Gateway monitore e limite a cadência de requisições por cliente/IP,
Para impedir que ataques de negação de serviço (DoS), bots, scripts maliciosos ou cliques abusivos consigam degradar ou derrubar os serviços da aplicação.

**Why this priority**: A proteção da disponibilidade do serviço é crucial para manter o espaço de acolhimento sempre acessível para pessoas que precisam desabafar ou buscar apoio emocional, evitando esgotamento de conexões ou CPU.

**Independent Test**:
- Disparar sequência de requisições dentro do teto permitido e verificar aprovação com status 200/201.
- Disparar requisições em volume superior ao limite configurado dentro de uma janela temporal e validar rejeição imediata com status 429 Too Many Requests.
- Verificar a inclusão de cabeçalhos informativos de controle de fluxo (`Retry-After`, limites de requisição).
- Aguardar o encerramento da janela temporal e validar que o cliente volta a ter requisições aceitas normalmente.

**Acceptance Scenarios**:

1. **Given** um cliente realizando requisições dentro do limite de taxa estabelecido para uma janela de tempo, **When** as requisições chegam ao Gateway, **Then** todas são aceitas e encaminhadas aos serviços de destino.
2. **Given** um cliente excedendo o teto de requisições permitidas na janela ativa, **When** uma nova requisição é disparada, **Then** o Gateway bloqueia imediatamente a requisição sem acionar o backend, retornando código `429 Too Many Requests` e cabeçalho indicando o tempo de espera (`Retry-After`).
3. **Given** operações mutatórias e sensíveis (como publicação de desabafos e comentários), **When** avaliadas pelo limitador de taxa, **Then** recebem uma política de taxa mais restrita em comparação com requisições de leitura pública.
4. **Given** o término do período de bloqueio ou expiração da janela de rate limit, **When** o cliente realiza uma nova requisição legítima, **Then** o Gateway reabre o acesso e zera a contagem da nova janela.

---

### User Story 3 - Resiliência e Prevenção de Falhas em Cascata com Circuit Breaker (Priority: P2)

Como usuário(a) da plataforma em momentos de instabilidade temporária de serviços internos ou dependências externas,
Eu quero que o sistema detecte falhas repetidas e isole rapidamente o componente instável via Circuit Breaker,
Para que o serviço continue respondendo prontamente (fail-fast) com mensagens de degradação graciosa, sem travar o navegador ou exaurir recursos de banco e servidor.

**Why this priority**: Evita que falhas pontuais (ex.: instabilidades transitórias em serviços downstream) causem efeito dominó, acumulando filas de espera e derrubando toda a aplicação.

**Independent Test**:
- Simular operação downstream com falhas recorrentes e validar transição de estado de CLOSED para OPEN após atingir o limiar de tolerância.
- Validar que quando o circuito estiver em estado OPEN, novas requisições falham de forma imediata (sem aguardar timeout) com código 503 Service Unavailable ou resposta de contingência.
- Validar transição para estado HALF-OPEN após o período de repouso (cooldown), permitindo passagem de requisição de teste.
- Validar retorno ao estado CLOSED caso a requisição de teste no modo HALF-OPEN tenha sucesso.

**Acceptance Scenarios**:

1. **Given** serviços e banco operando com taxas de sucesso normais, **When** requisições transitam pelo Gateway, **Then** o Circuit Breaker permanece no estado `CLOSED`, operando com mínima latência adicional.
2. **Given** um serviço downstream sofrendo timeouts ou falhas recorrentes acima do percentual limite configurado, **When** o limite é violado, **Then** o Circuit Breaker comuta para o estado `OPEN` e passa a rejeitar imediatamente novas chamadas com status `503 Service Unavailable`, informando que o serviço está temporariamente indisponível.
3. **Given** o Circuit Breaker em estado `OPEN`, **When** o tempo de repouso (cooldown) se encerra, **Then** o circuito transita para `HALF-OPEN`, liberando uma requisição de sondagem (canary) para verificar a saúde do serviço.
4. **Given** a requisição de sondagem no estado `HALF-OPEN` concluída com êxito, **When** confirmada a recuperação, **Then** o Circuit Breaker comuta para o estado `CLOSED`, restabelecendo o fluxo normal de tráfego.

---

### User Story 4 - Adaptação do Cliente Frontend e Tratamento Amigável de Erros de Resiliência (Priority: P2)

Como usuário(a) navegando na aplicação web,
Eu quero que a interface interaja exclusivamente com a porta de entrada segura do Gateway e exiba avisos compreensíveis quando houver limites ou instabilidade temporária,
Para que eu saiba exatamente o que fazer sem encontrar mensagens crípticas ou travamentos de tela.

**Why this priority**: Fecha o elo de segurança ponta a ponta, direcionando o cliente HTTP para a rota do Gateway e fornecendo feedback humanizado ao usuário caso o rate limit ou circuit breaker seja acionado.

**Independent Test**:
- Inspecionar as chamadas de rede no cliente HTTP do frontend (`src/http/`) e verificar que os endpoints apontam para a rota do Gateway.
- Simular resposta 429 e verificar a exibição de alerta informativo sobre excesso de tentativas.
- Simular resposta 503 e verificar a exibição de alerta amigável de manutenção temporária/estabilização.

**Acceptance Scenarios**:

1. **Given** qualquer interação na interface que realize chamadas à API, **When** disparada, **Then** o cliente HTTP do frontend direciona a requisição para o endpoint do Gateway.
2. **Given** o recebimento de uma resposta `429 Too Many Requests` vinda do Gateway, **When** tratada pelo cliente frontend, **Then** uma notificação amigável é exibida alertando que muitas ações foram realizadas recentemente e solicitando alguns segundos de espera.
3. **Given** o recebimento de uma resposta `503 Service Unavailable` por ativação de Circuit Breaker, **When** tratada pelo cliente frontend, **Then** a interface apresenta um aviso empático informando que o serviço está momentaneamente instável e convida o usuário a tentar novamente em breve.

---

### Edge Cases

- O que acontece se centenas de requisições simultâneas vierem do mesmo IP no mesmo milissegundo? O mecanismo de rate limiting processa a contagem de forma atômica e bloqueia requisições excedentes sem permitir furos na janela.
- O que acontece se uma falha ocorrer apenas em um domínio específico (ex.: moderação externa de IA)? O Circuit Breaker pode isolar o circuito do domínio afetado sem interromper a navegação e leitura dos desabafos já existentes.
- O que acontece se o cliente enviar um payload corrompido ou malformado para o Gateway? O Gateway valida o formato e responde imediatamente com status `400 Bad Request`, sem repassar payloads inválidos aos serviços profundos.
- O que acontece se a chamada downstream sofrer travamento indefinido? O Gateway impõe um timeout estrito (ex.: 5000ms), cancela a requisição pendente, contabiliza o erro no Circuit Breaker e responde com timeout de serviço (`504 Gateway Timeout` ou `503`).
- O que acontece se um bot omitir ou falsificar identificadores de rede? O Gateway analisa o endereço de IP do cliente a partir de headers canônicos de proxy reverso (`x-forwarded-for`, `remoteAddress`) e aplica a política padrão de forma segura.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE disponibilizar um ponto de entrada centralizado de API Gateway para interceptar, validar e rotear requisições do frontend para os serviços internos.
- **FR-002**: O API Gateway DEVE ocultar qualquer detalhe interno de implementação, topologia de rotas privadas e assinaturas tecnológicas do backend (ex.: supressão de cabeçalhos como `X-Powered-By`).
- **FR-003**: O API Gateway DEVE interceptar exceções não tratadas de serviços internos e retornar respostas de erro padronizadas e sanitizadas em JSON sem vazamento de stack trace.
- **FR-004**: O API Gateway DEVE implementar controle de taxa de requisições (Rate Limiting) baseado no identificador/IP do cliente.
- **FR-005**: O Rate Limiter DEVE responder com código HTTP `429 Too Many Requests` e cabeçalho `Retry-After` quando o limite de requisições de um cliente for ultrapassado.
- **FR-006**: O sistema DEVE definir limites de taxa diferenciados: uma política geral para consultas de leitura e uma política mais restrita para submissões mutatórias (criação de desabafos e comentários).
- **FR-007**: O API Gateway DEVE implementar o padrão Circuit Breaker para monitorar a saúde das operações downstream e evitar falhas em cascata.
- **FR-008**: O Circuit Breaker DEVE operar com três estados bem definidos: `CLOSED` (operação normal), `OPEN` (bloqueio imediato com fail-fast) e `HALF-OPEN` (tentativa controlada de recuperação).
- **FR-009**: Quando em estado `OPEN`, o Circuit Breaker DEVE rejeitar chamadas imediatamente com código HTTP `503 Service Unavailable`, sem consumir tempo de processamento ou conexões do backend.
- **FR-010**: O API Gateway DEVE aplicar timeout determinístico em chamadas downstream para impedir retenção indeterminada de conexões e recursos.
- **FR-011**: O cliente HTTP do frontend (`src/http/`) DEVE ser configurado para canalizar as requisições através do API Gateway.
- **FR-012**: O frontend DEVE fornecer feedback visual amigável e empático ao usuário em caso de respostas de rate limit (`429`) ou circuito aberto (`503`).

### Key Entities

- **GatewayRequest**: Representa a requisição pública contendo caminho solicitado, método HTTP, cabeçalhos higienizados, identificador de cliente/IP e payload.
- **RateLimitBucket**: Registro de controle de frequência contendo identificador do cliente, contagem de requisições realizadas na janela ativa e timestamp de expiração da janela.
- **CircuitBreakerInstance**: Gerenciador do circuito contendo estado atual (`CLOSED`, `OPEN`, `HALF-OPEN`), contador de falhas/sucessos, limiar de abertura de circuito, tempo de timeout e cronômetro de repouso (cooldown).
- **GatewayResponse**: Resposta padronizada emitida pelo Gateway ao cliente externo contendo status HTTP, headers seguros e corpo sanitizado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das requisições de rede originadas pelo frontend passam pelo ponto de entrada do API Gateway, sem conhecimento direto da implementação ou de rotas internas.
- **SC-002**: Sobrecargas com requisições que excedam o limite estabelecido por cliente são bloqueadas pelo Gateway em menos de 10ms, retornando status 429 sem acionar banco de dados ou serviços internos.
- **SC-003**: Sob simulação de falhas consecutivas ou lentidão excessiva (taxa de erro > 50%), o Circuit Breaker abre e responde 100% das requisições subsequentes em menos de 5ms com status 503 até a janela de recuperação.
- **SC-004**: Zero vazamentos de rastreio de pilha (stack trace) ou identificadores de frameworks internos em cabeçalhos de resposta de erros.
- **SC-005**: 100% dos cenários de aceite documentados possuem cobertura de testes de integração ponta a ponta aprovados na suíte Vitest.

## Assumptions

- O rate limiting opera com armazenamento em memória (estratégia de bucket ou sliding window) com limpeza periódica, sendo suficiente e de alta performance para a instância do servidor, com arquitetura preparada para posterior desacoplamento em cache distribuído caso haja escalabilidade horizontal.
- O Circuit Breaker gerencia a resiliência das chamadas protegidas através de biblioteca especializada consagrada no ecossistema Node.js (`opossum`) ou estrutura equivalente em TypeScript que ofereça estados `CLOSED`, `OPEN` e `HALF-OPEN` e suporte a timeouts.
- O API Gateway se integra perfeitamente ao ecossistema Next.js existente no projeto, utilizando a camada de entrada do App Router (`src/app/api/`) para atuar como proxy inteligente e seguro para os serviços de negócio.
- O cliente HTTP do frontend (`src/http/`) centraliza as chamadas em um cliente base que aponta para as rotas seguras do Gateway.
