# Quickstart: Validação do Circuit Breaker 5xx Tripping

## Pré-requisitos

1. Docker rodando com o container PostgreSQL ativo (`desabafo-anonimo-postgres`).
2. Dependências instaladas (`npm install`).

## Executando os Testes do Circuit Breaker

Para rodar os testes específicos do Circuit Breaker:

```bash
npm test -- tests/integration/app/api/gateway/circuit-breaker.test.ts
```

Ou executar toda a suíte de testes do projeto via script orquestrador:

```bash
npm test
```

## Verificação do Build

Para validar tipagem TypeScript e geração de build do Next.js:

```bash
npm run build
```
