# Research & Technical Decisions: API Gateway, Circuit Breaker e Rate Limiting

**Feature**: `003-api-gateway-resilience`  
**Date**: 2026-10-01  
**Status**: Concluído  

---

## 1. Topologia de Entrada e Padrão API Gateway no Next.js App Router

### Decisão
Implementar o API Gateway como uma camada de Route Handler dinâmico (*catch-all*) em `src/app/api/gateway/[...path]/route.ts` no runtime Node.js, com utilitários dedicados de gateway sob `src/app/api/gateway/`. O Gateway atua como proxy reverso inteligente, interceptando métodos HTTP (`GET`, `POST`, `PUT`, `DELETE`), aplicando rate limiting, circuit breaking, sanitização de cabeçalhos e delegação transparente aos Route Handlers / serviços internos.

### Racional
1. **Compatibilidade com Node.js e Opossum**: O `opossum` depende de módulos Node.js (`events`, `timers`, etc.) e requer o runtime Node.js padrão. O Next.js `middleware.ts` roda sobre o Edge Runtime por padrão, trazendo restrições severas de compatibilidade com bibliotecas de circuit breaker e manipulação de streams de body.
2. **Encapsulamento e Ocultação Real**: O frontend passa a disparar requisições unicamente para `/api/gateway/*`. As rotas internas de serviço permanecem isoladas e blindadas, sem que o cliente conheça a topologia interna.
3. **Alinhamento com a Constituição**: Permite manter a arquitetura em camadas e o paradigma de testes de integração estritos com `testClient` (Supertest) disparado diretamente contra o Route Handler do Gateway.

### Alternativas Consideradas
- **Next.js `middleware.ts`**: Rejeitado devido às limitações do Edge runtime (incompatibilidade com `opossum` e dificuldades de parsing/reescrita de bodies em requisições mutatórias `POST`/`PUT`).
- **Proxy Externo (ex.: Nginx / Envoy / Kong em container separado)**: Rejeitado por violar KISS/YAGNI para a escala atual do projeto, adicionando complexidade operacional excessiva à infraestrutura Docker local e dificultando a esteira de testes TDD com Supertest e Vitest.

---

## 2. Mecanismo de Circuit Breaker com Opossum

### Decisão
Utilizar a biblioteca `opossum` (com suas respectivas tipagens `@types/opossum`), estruturada sob uma fábrica / registro de circuitos (`CircuitBreakerRegistry` em `src/app/api/gateway/circuit-breaker/`). Os circuitos são isolados por domínio/recurso (ex.: `unburden`, `comment`, `support`), garantindo isolamento de falhas.

### Parâmetros Configurados
- `timeout`: **5000ms** (chamadas downstream que demorarem mais de 5s são abortadas e computadas como falha).
- `errorThresholdPercentage`: **50%** (se 50% ou mais das requisições na janela falharem, o circuito comuta para `OPEN`).
- `resetTimeout`: **10000ms** (após 10s em estado `OPEN`, o circuito transita para `HALF-OPEN` liberando uma chamada canary de sondagem).
- `volumeThreshold`: **5 requisições** (mínimo de requisições na janela antes de permitir abertura do circuito, evitando falsos positivos por falha pontual).

### Comportamento em Estado Aberto
Quando o circuito estiver `OPEN`, o Opossum dispara erro de circuito aberto (`EOPENBREAKER`). O Gateway intercepta essa condição e retorna imediatamente status HTTP `503 Service Unavailable` com payload amigável:
```json
{
  "message": "O serviço está temporariamente indisponível para estabilização. Por favor, tente novamente em alguns instantes.",
  "code": "CIRCUIT_BREAKER_OPEN"
}
```

### Alternativas Consideradas
- **Implementação Manual de Circuit Breaker**: Rejeitada porque a biblioteca `opossum` foi expressamente requerida pelo usuário, é amplamente testada pela comunidade Node.js (Red Hat / OpenJS) e oferece métricas precisas de estado (`CLOSED`, `OPEN`, `HALF-OPEN`).

---

## 3. Estratégia de Rate Limiting e Controle de Abuso

### Decisão
Implementar um limitador de taxa em memória utilizando algoritmo de Janela Deslizante / Token Bucket (`RateLimiter` em `src/app/api/gateway/rate-limit/`) indexado pelo endereço IP do cliente (extraído de `x-forwarded-for`, `x-real-ip` ou fallback para IP da conexão remota), com rotina de limpeza periódica para evitar acúmulo de memória.

### Políticas de Rate Limit
1. **Política de Leitura (General Read)**:
   - Limite: **60 requisições por minuto** por IP.
   - Aplicação: Rotas de leitura (`GET`).
2. **Política de Escrita / Mutação (Mutative Actions)**:
   - Limite: **15 requisições por minuto** por IP.
   - Aplicação: Rotas de publicação (`POST`), como desabafos e comentários, coibindo spam, floods e tentativas de sobrecarga.

### Resposta de Bloqueio e Cabeçalhos
Quando o limite for violado, o Gateway responde em menos de 5ms com:
- Status HTTP: `429 Too Many Requests`.
- Cabeçalhos:
  - `Retry-After`: Segundos restantes para renovação da janela.
  - `X-RateLimit-Limit`: Teto configurado para a rota.
  - `X-RateLimit-Remaining`: `0`.
  - `X-RateLimit-Reset`: Timestamp UTC em segundos do término da janela.
- Payload JSON estruturado:
  ```json
  {
    "message": "Você atingiu o limite de requisições permitidas. Aguarde alguns instantes antes de tentar novamente.",
    "code": "TOO_MANY_REQUESTS",
    "retryAfterSeconds": 42
  }
  ```

### Alternativas Consideradas
- **Redis Rate Limiting**: Embora ideal para clusters multi-instância, adicionar um container Redis e dependências adicionais agora violaria KISS/YAGNI para a arquitetura monointância atual. A interface do limitador (`IRateLimiter`) será modular, permitindo plugar um repositório Redis sem alterar o Gateway quando houver escalabilidade horizontal.

---

## 4. Higienização de Cabeçalhos e Mascaramento de Erros (Segurança)

### Decisão
1. **Ocultação de Assinaturas**:
   - Remoção compulsória de cabeçalhos como `X-Powered-By`, `Server` e headers internos de depuração.
2. **Sanitização de Exceções Não Tratadas**:
   - Quaisquer falhas downstream imprevistas (ex.: exceção de driver Prisma, crash de serviço ou estouro de memória) são capturadas pelo bloco `try/catch` do Gateway e convertidas em um retorno `500 Internal Server Error` padronizado.
   - Nenhuma stack trace, query SQL, credencial ou caminho de arquivo do sistema operacional é exposto no corpo da resposta pública.

---

## 5. Integração com o Cliente Frontend

### Decisão
Atualizar `src/http/client.ts` para direcionar as requisições à rota `/api/gateway/` em vez de `/api/v1/`.
Configurar interceptores globais do Axios no `client.ts`:
- **Tratamento de 429**: Aciona alerta amigável via SweetAlert2 (`showAlert` / toast) com mensagem de controle de cadência, informando o tempo sugerido de espera.
- **Tratamento de 503**: Apresenta aviso empático informando que a plataforma está se estabilizando e convida a uma nova tentativa em alguns segundos.

---

## 6. Estratégia de Testes de Integração (TDD)

### Decisão
Criar suite de testes de integração estrita em `tests/integration/app/api/gateway/route.test.ts` utilizando `testClient` (Supertest) disparado contra o Route Handler do Gateway:
- **Cenário 1**: Roteamento transparente de operações GET e POST para recursos reais (desabafo, comentários) com validação de payload e status.
- **Cenário 2**: Sanitização de cabeçalhos e mascaramento de erros 500 downstream.
- **Cenário 3**: Bloqueio de requisições excedentes por Rate Limiter retornando HTTP 429 e `Retry-After`.
- **Cenário 4**: Recuperação do Rate Limiter após expiração da janela temporal.
- **Cenário 5**: Disparo e abertura do Circuit Breaker sob falhas simuladas retornando HTTP 503 fail-fast imediato.
- **Cenário 6**: Transição para HALF-OPEN e recuperação para CLOSED após resposta bem-sucedida.
