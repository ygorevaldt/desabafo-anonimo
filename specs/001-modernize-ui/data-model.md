# Data Model & State Schemas: Modernização da UI

**Feature**: `001-modernize-ui` | **Date**: 2026-09-29

## 1. Modelos de Domínio do Frontend

### Unburden (Desabafo)
Representa um desabafo exposto no feed e nas páginas detalhadas.

```typescript
export interface Unburden {
  id: string;
  title: string;
  content: string;
  created_at: string;
  supports_amount: number;
  comments_amount: number;
  sensitive_content: boolean;
  supported?: boolean;
}
```

### Comment (Comentário)
Representa uma mensagem de apoio ou comentário em um desabafo.

```typescript
export interface Comment {
  id: string;
  unburden_id: string;
  content: string;
  created_at: string;
  sensitive_content: boolean;
  supports_amount?: number;
  parent_id?: string | null;
}
```

---

## 2. Redux State Models

### FeedSlice State
Estado global responsável pelo feed de desabafos, paginação e status de requisições.

```typescript
export interface FeedState {
  items: Unburden[];
  page: number;
  take: number;
  total: number;
  hasMore: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Ações principais:
// - setFeedItems(payload: { unburdens: Unburden[], total: number, page: number, take: number })
// - appendFeedItems(payload: { unburdens: Unburden[], total: number, page: number })
// - optimisticSupport(unburdenId: string)
// - addUnburden(unburden: Unburden)
// - setStatus(status: FeedState['status'])
// - setError(error: string | null)
```

### ActiveUnburdenSlice State
Estado global para a página de detalhes de um desabafo e seus comentários associados.

```typescript
export interface ActiveUnburdenState {
  current: Unburden | null;
  comments: Comment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  commentSubmitStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Ações principais:
// - setActiveUnburden(unburden: Unburden)
// - setComments(comments: Comment[])
// - addComment(comment: Comment)
// - optimisticSupportActive()
// - resetActiveUnburden()
```

---

## 3. UI Theme Model

```typescript
export type Theme = 'light' | 'dark' | 'system';
```
Controlado via `next-themes` com atributos de classe sincronizados no elemento `<html>`.
