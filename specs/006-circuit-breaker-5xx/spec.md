# Feature Specification: Circuit Breaker 5xx Error Tripping and Downstream Resilience

**Feature Branch**: `006-circuit-breaker-5xx`

**Created**: 2026-10-06

**Status**: Draft

**Input**: User description: "Circuit breaker 5xx error trip and downstream resilience: garantir que retornos com status >= 500 dos route handlers internos sejam computados como falhas no Circuit Breaker do API Gateway, abrindo o circuito para proteger o monólito em falhas de banco de dados e I/O, mantendo erros 4xx isolados."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Proteção Automática contra Falhas de Servidor / Banco de Dados (Priority: P1)

Como consumidor da API ou cliente da plataforma, quando um serviço downstream ou banco de dados começar a falhar continuamente com erros internos de servidor (HTTP 5xx), o API Gateway deve proteger os recursos do sistema interrompendo chamadas subsequentes e retornando resposta imediata de indisponibilidade temporária (Fail-Fast), dando tempo para o sistema se estabilizar.

**Why this priority**: É a essência do padrão Circuit Breaker no monólito. Sem contabilizar respostas HTTP 5xx capturadas internamente pelos route handlers, o disjuntor nunca abre em falhas imediatas de banco de dados ou I/O, deixando de proteger o pool de conexões do sistema.

**Independent Test**: Simular falhas repetidas que geram HTTP 500 no domínio downstream e verificar se, após atingir o limiar de falhas configurado, o disjuntor transiciona para `OPEN` e passa a rejeitar requisições imediatamente com status 503 (`CIRCUIT_BREAKER_OPEN`) em menos de 20ms sem chamar o handler.

**Acceptance Scenarios**:

1. **Given** um domínio do API Gateway com disjuntor em estado `CLOSED`, **When** requisições downstream resultam em respostas com HTTP status code >= 500 atingindo o limiar de tolerância a falhas, **Then** o Circuit Breaker deve abrir e novas requisições devem retornar HTTP 503 com código `CIRCUIT_BREAKER_OPEN` e cabeçalho `Retry-After: 10`.
2. **Given** um domínio do API Gateway com disjuntor em estado `CLOSED`, **When** uma requisição downstream retorna status 500 pontual sem ultrapassar o limiar de abertura, **Then** o cliente deve receber a resposta HTTP 500 original com cabeçalhos sanitizados, e a falha deve ser computada nas métricas do disjuntor.

---

### User Story 2 - Isolamento de Erros de Cliente 4xx (Priority: P2)

Como consumidor da API, quando eu submeter requisições inválidas ou acessar rotas inexistentes (HTTP 4xx como 400 Bad Request, 404 Not Found ou 401 Unauthorized), o sistema deve retornar o erro de validação sem penalizar a saúde da rota ou do domínio no Circuit Breaker.

**Why this priority**: Erros de cliente são esperados e não representam falha de infraestrutura, indisponibilidade do banco ou exaustão do servidor. Se erros 4xx fossem contados como falhas do disjuntor, clientes maliciosos ou requisições inválidas poderiam derrubar rotas saudáveis para todos os usuários.

**Independent Test**: Executar uma sequência contínua de requisições inválidas gerando HTTP 400 ou 404 e verificar que o disjuntor permanece em estado `CLOSED`, permitindo requisições subsequentes válidas com sucesso.

**Acceptance Scenarios**:

1. **Given** um domínio do API Gateway em operação normal, **When** múltiplas requisições downstream retornam status 400 ou 404 por dados inválidos do cliente, **Then** o Circuit Breaker deve permanecer em estado `CLOSED` e não abrir.

---

### User Story 3 - Recuperação Gradual e Canary Request (Priority: P3)

Como operador do sistema e usuário da API, quando o serviço downstream recuperar sua capacidade operacional após um período de falhas, o Circuit Breaker deve testar o serviço e restabelecer o fluxo normal automaticamente.

**Why this priority**: Permite que o monólito se auto-recupere sem intervenção manual assim que o banco de dados ou o serviço de I/O normalizar.

**Independent Test**: Abrir o circuito com falhas 5xx, aguardar o tempo de reset (`resetTimeout`), enviar uma requisição que retorna status 200/201 (canary) e verificar que o circuito transiciona para `CLOSED`.

**Acceptance Scenarios**:

1. **Given** um disjuntor em estado `OPEN`, **When** o tempo de `resetTimeout` expira e uma nova requisição retorna resposta com status de sucesso (< 500), **Then** o disjuntor deve fechar (`CLOSED`) e o fluxo regular deve ser restabelecido.

---

### Edge Cases

- O que acontece se a requisição downstream estourar o tempo limite de 5.000 ms? O disjuntor deve abortar a execução, registrar falha de timeout (`ETIMEDOUT`) e responder com status 504 `GATEWAY_TIMEOUT`.
- O que acontece se o domínio falhar repetidamente enquanto outro domínio saudável continuar recebendo tráfego? O disjuntor do domínio em falha abre individualmente, enquanto os demais domínios continuam operando normalmente sem degradação.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O API Gateway Circuit Breaker wrapper DEVE inspecionar o código de status HTTP retornado pela execução downstream do `GatewayDispatcher`.
- **FR-002**: Toda resposta downstream com código HTTP >= 500 DEVE ser registrada como falha na contagem estatística do Circuit Breaker para aquele domínio.
- **FR-003**: Se o disjuntor estiver `CLOSED` e ocorrer uma resposta individual >= 500, o cliente DEVE receber o payload e o status HTTP 5xx correspondente da rota downstream, acompanhado dos cabeçalhos sanitizados e metadados de rate limit.
- **FR-004**: Quando a taxa de falhas por respostas 5xx atingir ou superar o percentual configurado (`errorThresholdPercentage`) com o volume mínimo (`volumeThreshold`), o disjuntor DEVE transicionar para `OPEN`.
- **FR-005**: Com o disjuntor em estado `OPEN`, chamadas subsequentes para o domínio afetado DEVEM retornar imediatamente status 503 `SERVICE_UNAVAILABLE` com o código `CIRCUIT_BREAKER_OPEN` e cabeçalho `Retry-After: 10`, sem invocar a função downstream.
- **FR-006**: Códigos de status HTTP do cliente (família 4xx, como 400, 401, 404) NÃO DEVEM ser contabilizados como falhas de infraestrutura pelo Circuit Breaker.
- **FR-007**: Decorrido o intervalo de resfriamento (`resetTimeout`), o disjuntor DEVE permitir requisições de teste em modo `HALF-OPEN` e fechar mediante resposta saudável (< 500).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das respostas HTTP com status >= 500 em rotas intermediadas pelo Gateway são registradas como falhas de execução no disjuntor do domínio.
- **SC-002**: Uma vez que o disjuntor abre por excesso de respostas 5xx, as requisições subsequentes são rejeitadas em menos de 20ms sem execução de queries no PostgreSQL.
- **SC-003**: 0% de requisições com respostas HTTP 4xx causam transição de estado no Circuit Breaker.
- **SC-004**: 100% dos testes de integração existentes e novos passam com sucesso, respeitando o ciclo de TDD e a constituição do projeto.

## Assumptions

- O comportamento padrão de rotas da aplicação em caso de erros não tratados continua retornando HTTP 500 via `handleRequestError`.
- Os domínios são particionados de acordo com `GatewayDomain` (`unburden`, `comment`, `support`, `status`).
- A biblioteca `opossum` continua sendo o motor subjacente de Circuit Breaker.
