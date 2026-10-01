# Interface Contracts: API de Denúncias, Moderação e Structured Outputs

**Feature**: `004-llm-curation-moderation`  
**Date**: 2026-10-01  
**Status**: Concluído  

---

## 1. Endpoint: Registrar Denúncia de Desabafo

- **Caminho**: `POST /api/gateway/v1/unburden/[id]/report` (ou `POST /api/v1/unburden/[id]/report`)
- **Método**: `POST`
- **Cabeçalhos Obrigatórios**:
  - `Content-Type: application/json`
  - `x-session-id: string` (UUID / VarChar 36 identificando o visitante)

### Payload de Entrada (Request Body)

```json
{
  "reason": "Discurso de ódio e apologia a violência"
}
```

*Nota: O campo `reason` é opcional (máximo de 255 caracteres).*

### Schema Zod de Entrada (`src/app/api/v1/schemas/register-report-body.schema.ts`)

```typescript
import { z } from "zod";

export const registerReportBodySchema = z.object({
  reason: z
    .string()
    .max(255, { message: "O motivo deve ter no máximo 255 caracteres." })
    .optional(),
});

export type RegisterReportBody = z.infer<typeof registerReportBodySchema>;
```

### Respostas da API

#### 1. Denúncia Registrada com Sucesso (`201 Created` / `200 OK`)

```json
{
  "success": true,
  "message": "Denúncia registrada com sucesso para análise da moderação.",
  "alreadyReported": false,
  "reportCount": 1
}
```

#### 2. Denúncia Já Registrada Anteriormente (Idempotência) (`200 OK`)

```json
{
  "success": true,
  "message": "Você já sinalizou este desabafo para moderação.",
  "alreadyReported": true,
  "reportCount": 1
}
```

#### 3. Desabafo Inexistente ou Já Excluído (`404 Not Found`)

```json
{
  "message": "O desabafo especificado não foi encontrado.",
  "code": "REGISTER_NOT_FOUND"
}
```

#### 4. Sessão Inválida ou Ausente (`400 Bad Request`)

```json
{
  "message": "Identificador de sessão inválido ou ausente.",
  "code": "INVALID_SESSION_ID"
}
```

---

## 2. Contrato de Structured Output da Inteligência Artificial

### Schema de Validação do Veredito da LLM (`src/app/api/services/schemas/moderation-verdict.schema.ts`)

```typescript
import { z } from "zod";

export const moderationVerdictSchema = z.object({
  status: z.enum(["APPROVED", "SENSITIVE", "BLOCKED"]),
  category: z.enum([
    "safe",
    "self_harm_distress",
    "apology_violence",
    "sexual_violence",
    "hate_speech",
    "illegal",
  ]),
  isSensitive: z.boolean(),
  reason: z.string().optional(),
});

export type ModerationVerdictOutput = z.infer<typeof moderationVerdictSchema>;
```

### Contrato JSON Schema enviado na configuração da chamada ao Google GenAI

```json
{
  "type": "OBJECT",
  "properties": {
    "status": {
      "type": "STRING",
      "enum": ["APPROVED", "SENSITIVE", "BLOCKED"]
    },
    "category": {
      "type": "STRING",
      "enum": [
        "safe",
        "self_harm_distress",
        "apology_violence",
        "sexual_violence",
        "hate_speech",
        "illegal"
      ]
    },
    "isSensitive": {
      "type": "BOOLEAN"
    },
    "reason": {
      "type": "STRING"
    }
  },
  "required": ["status", "category", "isSensitive"]
}
```

---

## 3. Contrato de DTO de Resposta da Denúncia (`ReportResponseDto`)

```typescript
export interface ReportResponseDto {
  success: boolean;
  message: string;
  alreadyReported: boolean;
  reportCount: number;
}
```
