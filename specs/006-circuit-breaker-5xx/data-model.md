# Data Model: Circuit Breaker 5xx Error Tripping

## Classes e Tipos do Gateway

### `DownstreamError`

Representa uma exceção de execução gerada intencionalmente pelo gateway quando uma rota downstream retorna código de status HTTP da família 5xx (Server Error).

```typescript
export class DownstreamError extends Error {
  public readonly response: NextResponse;

  constructor(response: NextResponse) {
    super(`Downstream service returned status ${response.status}`);
    this.name = "DownstreamError";
    this.response = response;
  }
}
```

- **Campos**:
  - `name`: Identificador fixo `"DownstreamError"`.
  - `response`: Objeto `NextResponse` original retornado pelo route handler downstream contendo status e payload do erro 5xx.

### Configuração do Circuit Breaker (`CircuitBreakerConfig`)

Já existente em `src/app/api/gateway/circuit-breaker/circuit-breaker.types.ts`:

- `timeout`: Tempo limite para execução da chamada (padrão: 5.000 ms).
- `errorThresholdPercentage`: Porcentagem de erros para disparar abertura do disjuntor (padrão: 50%).
- `resetTimeout`: Intervalo em ms antes de tentar transição para Half-Open (padrão: 10.000 ms).
- `volumeThreshold`: Número mínimo de requisições na janela para considerar abertura (padrão: 5).
- `rollingCountTimeout`: Janela de análise estatística em ms (padrão: 10.000 ms).
