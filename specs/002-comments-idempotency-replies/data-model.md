# Data Model: Correção de Duplicação, Idempotência em Operações Críticas, Acolhimento Assíncrono por IA e Respostas a Comentários

**Feature**: `002-comments-idempotency-replies`
**Date**: 2026-09-30

## Entities & Relationships

### 1. Comment (`comentario`)

| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | UUID | `@id, @default(uuid())` | Identificador único do comentário |
| `content` | VarChar(1500) | `conteudo` | Texto da mensagem de apoio ou resposta (min 5, max 1500) |
| `sensitiveContent` | Boolean? | `conteudo_sensivel, @default(false)` | Flag definida pela moderação de IA |
| `createdAt` | DateTime | `created_at, @default(now())` | Data e hora de publicação |
| `unburdenId` | UUID? | `id_desabafo, FK Unburden.id` | Vínculo ao desabafo raiz (obrigatório para comentários principais) |
| `subcommentId` | UUID? | `id_subcomentario, FK Comment.id` | Vínculo ao comentário pai (quando for uma resposta direta) |

#### Relações
- `unburden`: `Unburden? @relation(fields: [unburdenId], references: [id])`
- `subcomment`: `Comment? @relation("Subcomment", fields: [subcommentId], references: [id])`
- `subcomments`: `Comment[] @relation("Subcomment")` (respostas diretas ao comentário)
- `supports`: `Support[]`

---

### 2. Unburden (`desabafo`)

| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | UUID | `@id, @default(uuid())` | Identificador único do desabafo |
| `title` | VarChar(50) | `titulo` | Título do desabafo (min 5, max 50) |
| `content` | VarChar(2500) | `conteudo` | Conteúdo do desabafo (min 10, max 2500) |
| `sensitiveContent` | Boolean? | `conteudo_sensivel, @default(false)` | Flag de sensibilidade definida pela IA |
| `createdAt` | DateTime | `created_at, @default(now())` | Data de publicação |

---

## State Model & DTOs

### Frontend Comment DTO / Type (`src/types/comment.type.ts`)
```typescript
export type CommentType = {
  id: string;
  content: string;
  created_at: string;
  subcomment_id?: string | null;
  subcomments?: CommentType[];
};
```

### Backend Comment Response DTO (`src/app/api/v1/dtos/comment-response.dto.ts`)
```typescript
export class CommentResponseDto {
  readonly id: string;
  readonly content: string;
  readonly created_at: Date;
  readonly subcomment_id?: string | null;
  readonly subcomments?: CommentResponseDto[];
}
```
