# Quickstart & Guia de Validação: API Gateway, Circuit Breaker e Rate Limiting

**Feature**: `003-api-gateway-resilience`  
**Date**: 2026-10-01  
**Status**: Concluído  

---

## 1. Pré-Requisitos

1. **Node.js**: v20+ e npm instalados.
2. **Docker**: Docker Desktop ativo para subir o banco de dados PostgreSQL.
3. **Dependência**: Biblioteca `opossum` e `@types/opossum` instaladas no projeto.
4. **Banco de Dados**: Container `desabafo-anonimo-postgres` provisionado e com migrações aplicadas.

---

## 2. Preparação do Ambiente

Execute a orquestração oficial para assegurar o banco e migrações:

```bash
npm run test:prepare
```

---

## 3. Validação Automatizada de Integração (TDD)

A validação primária é realizada através da suite de testes de integração via Vitest e Supertest contra o Route Handler do Gateway:

```bash
npm run test:run -- tests/integration/app/api/gateway
```

### Cenários Validados pela Suite:
1. **Roteamento Transparente**: Requisições GET e POST através de `/api/gateway/unburden` retornam `200` e `201` com os dados corretos.
2. **Ocultação de Topologia e Headers**: Valida ausência do cabeçalho `X-Powered-By` em todas as respostas do Gateway.
3. **Sanitização de Erros**: Falhas downstream forçadas retornam status `500` estruturado sem expor stack traces.
4. **Rate Limiting**:
   - Envio de 16 requisições de mutação em sequência rápida a partir do mesmo IP.
   - Da 1ª à 15ª requisição: status `200`/`201` com `X-RateLimit-Remaining` decrescente.
   - A 16ª requisição: status `429 Too Many Requests` com cabeçalho `Retry-After`.
5. **Circuit Breaker**:
   - Simulação de erros contínuos (ex.: banco fora ou falhas consecutivas) atingindo o `volumeThreshold` e `errorThresholdPercentage`.
   - Transição do circuito para `OPEN`.
   - Requisições subsequentes retornam `503 Service Unavailable` com código `CIRCUIT_BREAKER_OPEN` de forma imediata (fail-fast em < 5ms).
   - Validação de recuperação após o `resetTimeout` no estado `HALF-OPEN` retornando para `CLOSED`.

---

## 4. Validação Ponta a Ponta com a Aplicação Completa

Execute a validação geral de regressão e conformidade:

```bash
npm test
```

### Validação Visual no Frontend:
1. Suba a aplicação com `npm run dev`.
2. Acesse `http://localhost:3000`.
3. Abra as Ferramentas de Desenvolvedor (F12 -> Aba Network).
4. Crie um novo desabafo ou apoie uma publicação.
5. Verifique que a requisição é disparada para `/api/gateway/unburden` ou `/api/gateway/comment` (em vez de endpoints diretos de serviço).
6. Verifique que a interface não apresenta duplicidades e exibe notificações amigáveis caso receba respostas 429 ou 503.
