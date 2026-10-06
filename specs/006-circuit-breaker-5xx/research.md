# Research: Circuit Breaker 5xx Error Tripping and Downstream Resilience

## Context & Problem Statement

No monólito modular, o API Gateway atua como proxy in-process despachando chamadas para os route handlers (`unburden`, `comment`, etc.) via `GatewayDispatcher`.
Quando ocorre uma falha interna (como falha no PostgreSQL ou exceção não tratada), o handler captura o erro e retorna uma resposta HTTP 500 (`NextResponse`) através de `handleRequestError`.
Como a Promise retornada pelo handler é resolvida com um objeto `NextResponse` em vez de ser rejeitada, a biblioteca `opossum` considera a execução um sucesso. Dessa forma, o Circuit Breaker nunca abre por volume de erros 5xx, abrindo apenas em caso de timeout (> 5.000 ms).

## Technical Decisions

### Decision 1: Interceptar Respostas Downstream com HTTP Status >= 500

- **Decisão**: Criar a classe de erro `DownstreamError` (estendendo `Error`) em `src/app/api/gateway/circuit-breaker/downstream-error.ts` (ou utilitário de gateway correspondente), contendo a referência da resposta original `NextResponse`.
- **Mecanismo**: Dentro da ação despachada para o `circuitBreakerRegistry.execute`, inspecionar `response.status`. Se `response.status >= HttpStatusCode.INTERNAL_SERVER_ERROR`, lançar `throw new DownstreamError(response)`.
- **Efeito no Opossum**: Opossum intercepta a rejeição da Promise e registra a execução como falha em sua janela deslizante estatística.

### Decision 2: Tratamento de `DownstreamError` no API Gateway

- **Decisão**: No bloco `catch` de `handleGatewayRequest`, verificar se o erro capturado é instância de `DownstreamError`.
- **Comportamento**:
  - Se for `DownstreamError`, extrair `error.response`, aplicar sanitização de cabeçalhos (`sanitizeResponseHeaders`) e cabeçalhos de rate limit, e retornar a resposta HTTP 5xx original ao cliente.
  - Se o disjuntor tiver acumulado falhas suficientes para abrir, chamadas futuras recebem `EOPENBREAKER` do Opossum, sendo capturadas por `handleGatewayError` e retornando HTTP 503 `CIRCUIT_BREAKER_OPEN`.

### Decision 3: Isolamento de Erros de Cliente 4xx

- **Decisão**: Respostas com status 4xx (400, 401, 404, etc.) NÃO lançam `DownstreamError`. A Promise resolve normalmente.
- **Efeito**: Clientes enviando dados inválidos não afetam a taxa de saúde do disjuntor nem abrem o circuito.

### Decision 4: Estratégia de Testes TDD

- **Decisão**: Atualizar e expandir a suíte de testes de integração em `tests/integration/app/api/gateway/circuit-breaker.test.ts`.
- **Cenários**:
  1. Testar que falhas repetidas (respostas 500) acionam automaticamente o disjuntor para `OPEN` sem intervenção manual de `breaker.open()`.
  2. Testar que respostas 4xx repetidas mantêm o circuito `CLOSED`.
  3. Testar a recuperação automática no estado `HALF-OPEN` após o tempo de reset.
