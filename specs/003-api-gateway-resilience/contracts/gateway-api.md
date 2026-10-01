# Interface Contract: API Gateway

**Feature**: `003-api-gateway-resilience`  
**Date**: 2026-10-01  
**Status**: Concluído  

---

## 1. Ponto de Entrada Unificado do Gateway

- **URL Base**: `/api/gateway/[...path]`
- **Métodos Suportados**: `GET`, `POST`, `PUT`, `DELETE`
- **Comportamento**: Roteamento reverso transparente com rate limit, circuit breaker e sanitização de headers.

---

## 2. Mapeamento de Recursos Downstream

| Rota Pública (Gateway) | Rota Interna de Destino | Métodos | Política de Rate Limit |
|---|---|---|---|
| `/api/gateway/unburden` | `/api/v1/unburden` | `GET` | **Leitura** (60 req/min) |
| `/api/gateway/unburden` | `/api/v1/unburden` | `POST` | **Mutação** (15 req/min) |
| `/api/gateway/unburden/[id]` | `/api/v1/unburden/[id]` | `GET` | **Leitura** (60 req/min) |
| `/api/gateway/comment` | `/api/v1/comment` | `GET` | **Leitura** (60 req/min) |
| `/api/gateway/comment` | `/api/v1/comment` | `POST` | **Mutação** (15 req/min) |
| `/api/gateway/support` | `/api/v1/support` | `POST` | **Mutação** (15 req/min) |
| `/api/gateway/status` | `/api/v1/status` | `GET` | **Leitura** (60 req/min) |

---

## 3. Cabeçalhos de Resposta Injetados e Sanitizados

### Cabeçalhos de Controle de Fluxo (Rate Limiting)
Em toda resposta permitida pelo Gateway:
- `X-RateLimit-Limit`: Número máximo de requisições permitidas na janela (ex.: `60` ou `15`).
- `X-RateLimit-Remaining`: Número de requisições restantes para o cliente na janela corrente.
- `X-RateLimit-Reset`: Timestamp Unix em segundos do término da janela de rate limit.

### Cabeçalhos Removidos (Blindagem de Segurança)
- `X-Powered-By` (sempre removido se presente).
- Cabeçalhos internos de depuração ou assinatura de framework.

---

## 4. Respostas de Erro de Resiliência do Gateway

### 4.1. Excesso de Requisições (`429 Too Many Requests`)

Quando o cliente IP ultrapassa a cota da política na janela ativa:

- **Status Code**: `429 Too Many Requests`
- **Headers**:
  - `Content-Type: application/json`
  - `Retry-After: <segundos_restantes>`
  - `X-RateLimit-Limit: <limite>`
  - `X-RateLimit-Remaining: 0`
  - `X-RateLimit-Reset: <timestamp>`
- **Body**:
```json
{
  "message": "Você atingiu o limite de requisições permitidas. Aguarde alguns instantes antes de tentar novamente.",
  "code": "TOO_MANY_REQUESTS",
  "retryAfterSeconds": 45
}
```

---

### 4.2. Circuito Aberto / Falha Rápida (`503 Service Unavailable`)

Quando o Circuit Breaker do domínio downstream comutar para `OPEN`:

- **Status Code**: `503 Service Unavailable`
- **Headers**:
  - `Content-Type: application/json`
  - `Retry-After: 10`
- **Body**:
```json
{
  "message": "O serviço está temporariamente indisponível para estabilização. Por favor, tente novamente em alguns instantes.",
  "code": "CIRCUIT_BREAKER_OPEN"
}
```

---

### 4.3. Timeout em Serviço Downstream (`504 Gateway Timeout`)

Quando uma chamada downstream exceder 5000ms:

- **Status Code**: `504 Gateway Timeout`
- **Headers**:
  - `Content-Type: application/json`
- **Body**:
```json
{
  "message": "O serviço interno demorou além do tempo limite para responder.",
  "code": "GATEWAY_TIMEOUT"
}
```

---

### 4.4. Erro Interno Sanitizado (`500 Internal Server Error`)

Quando uma exceção inesperada ou crash ocorrer no downstream:

- **Status Code**: `500 Internal Server Error`
- **Headers**:
  - `Content-Type: application/json`
- **Body**:
```json
{
  "message": "Ocorreu um erro interno inesperado no servidor.",
  "code": "INTERNAL_SERVER_ERROR"
}
```
*(Garante que nenhuma stack trace ou detalhe de banco seja exposto)*

---

### 4.5. Recurso Não Encontrado no Gateway (`404 Not Found`)

Quando a rota solicitada não corresponder a nenhum recurso mapeado:

- **Status Code**: `404 Not Found`
- **Body**:
```json
{
  "message": "Recurso não encontrado no gateway.",
  "code": "ROUTE_NOT_FOUND"
}
```
