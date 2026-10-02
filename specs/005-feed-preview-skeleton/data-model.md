# Data Model: Feed Post Preview and Lively Skeleton Loading

## Entity Definitions

### 1. Unburden (Desabafo)
Entidade de domínio existente persistida no banco de dados e exposta via API.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `String (UUID/CUID)` | Identificador unívoco do desabafo |
| `title` | `String` | Título do desabafo |
| `content` | `String` | Conteúdo textual completo |
| `sensitive_content` | `Boolean` | Indicador de conteúdo com temas delicados |
| `supports_amount` | `Number` | Total de apoios recebidos |
| `comments_amount` | `Number` | Total de comentários e respostas |
| `created_at` | `DateTime / String ISO` | Data de publicação |

---

### 2. Feed Card View State (Estado de Apresentação)
Modelo de apresentação nos componentes de frontend (`Unburden`, `UnburdenListItem`, `UnburdenList`).

| Propriedade / Estado | Tipo | Descrição |
|---|---|---|
| `previewMode` | `Boolean` | Quando `true`, ativa clamping de texto e contêiner compacto de sensibilidade no feed |
| `titleHref` | `String?` | Rota para navegação detalhada (ex: `/unburden/[id]`) |
| `showSupportButton` | `Boolean` | Controle de exibição do botão de apoio rápido no card |
| `isInitialLoading` | `Boolean` | Estado que ativa a renderização dos componentes de skeleton |
