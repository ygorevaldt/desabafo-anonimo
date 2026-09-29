# UI & State Contracts: Modernização da UI

**Feature**: `001-modernize-ui` | **Date**: 2026-09-29

## 1. Contratos de Componentes de UI (Design System Shadcn/UI)

### `ThemeToggle`
- **Props**: `{ className?: string }`
- **Comportamento**: Renderiza um botão suave com ícones (Sol/Lua) permitindo alternar entre 'light', 'dark' e 'system'.
- **Efeito**: Modifica o tema via `useTheme()` do `next-themes`, persistindo a preferência sem FOUC.

### `UnburdenCard`
- **Props**:
  ```typescript
  interface UnburdenCardProps {
    data: Unburden;
    className?: string;
    showSensitiveButton?: boolean;
    compact?: boolean;
  }
  ```
- **Comportamento**: Exibe o título com badge/ícone suave, tempo relativo amigável, prévia do conteúdo (ou desfoque se sensível), contador de comentários, contador de apoios e botão interativo de apoio com animação suave de coração/aplauso.

### `UnburdenForm`
- **Props**:
  ```typescript
  interface UnburdenFormProps {
    onSuccess?: (newUnburden: Unburden) => void;
  }
  ```
- **Comportamento**: Inputs estilizados com foco suave, contador de caracteres em tempo real (limite de 2500 caracteres), toggle acessível para receber conforto por IA e botão de submissão com estado de loading desabilitado.

---

## 2. Contrato de Ações Redux

### Feed Slice Actions
- `fetchFeed(page: number)`: Dispara busca paginada e popula a store.
- `appendFeed(page: number)`: Busca mais desabafos e adiciona à lista existente.
- `supportUnburden(unburdenId: string)`: Realiza atualização otimista local imediata (+1 apoio e `supported: true`) e executa a requisição assíncrona ao backend; reverte caso ocorra falha.

### Active Unburden Slice Actions
- `fetchActiveUnburden(id: string)`: Carrega o desabafo selecionado e seus comentários.
- `submitComment({ unburdenId, content })`: Envia comentário, atualiza a lista de comentários e incrementa o contador.
