# API Contract: Comments & Replies API

## 1. POST /api/v1/comment

Cria um novo comentário de apoio para um desabafo ou uma resposta direta a um comentário existente.

### Headers
- `Content-Type: application/json`

### Request Body (Comentário Raiz)
```json
{
  "unburden_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "content": "Força, você não está sozinho nessa jornada!"
}
```

### Request Body (Resposta a Comentário)
```json
{
  "comment_id": "b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "content": "Muito obrigado pelas palavras de carinho, confortaram meu coração."
}
```

### Response 201 Created
```json
{
  "id": "e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b",
  "content": "Força, você não está sozinho nessa jornada!",
  "created_at": "2026-09-30T14:30:00.000Z",
  "subcomment_id": null,
  "subcomments": []
}
```

### Response 400 Bad Request
Payload inválido (ex: `content` com menos de 5 caracteres ou ambos `unburden_id` e `comment_id` ausentes).

### Response 401 Unauthorized
Conteúdo rejeitado pela moderação de IA por conter discurso de ódio, violência ou violações graves.

### Response 404 Not Found
Quando `comment_id` não existe no banco.

---

## 2. GET /api/v1/comment?unburden_id=UUID

Lista todos os comentários principais de um desabafo, acompanhados de suas respectivas respostas em ordem cronológica.

### Query Parameters
- `unburden_id` (string, UUID, obrigatório)

### Response 200 OK
```json
{
  "comments": [
    {
      "id": "c1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "content": "Mensagem acolhedora...",
      "created_at": "2026-09-30T14:00:00.000Z",
      "subcomment_id": null,
      "subcomments": [
        {
          "id": "r1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
          "content": "Obrigado pelo carinho!",
          "created_at": "2026-09-30T14:05:00.000Z",
          "subcomment_id": "c1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
          "subcomments": []
        }
      ]
    }
  ]
}
```

---

## 3. POST /api/v1/unburden

Cria um novo desabafo com suporte a acolhimento por IA assíncrono.

### Request Body
```json
{
  "title": "Desabafo sincero",
  "content": "Estou passando por um momento delicado...",
  "wantsAiComfort": false
}
```

### Response 201 Created
Retorno imediato (< 200ms), sem aguardar a conclusão da API do Gemini.
```json
{
  "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "title": "Desabafo sincero",
  "content": "Estou passando por um momento delicado...",
  "sensitive_content": false,
  "created_at": "2026-09-30T14:30:00.000Z"
}
```
