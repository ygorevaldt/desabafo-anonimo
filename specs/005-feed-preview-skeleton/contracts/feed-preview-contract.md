# Interface Contract: Feed Post Preview and Skeleton UI

## Component Contracts

### 1. `Unburden` Component Interface (`src/components/Unburden.tsx`)

```typescript
export type UnburdenProps = {
  data: UnburdenType;
  className?: string;
  showSensitiveButton?: boolean;
  showSupportButton?: boolean;
  titleHref?: string;
  previewMode?: boolean; // Novo controle: habilita prévia com line-clamp e proteção compacta
};
```

#### Comportamento Esperado por Modo:

- **Quando `previewMode === true` (Listagem / Feed)**:
  - Título renderizado com link para `titleHref` (ex: `/unburden/[id]`).
  - Conteúdo comum renderizado com classe `line-clamp-3 sm:line-clamp-4 break-words`.
  - Conteúdo sensível (`sensitive_content === true`): renderiza aviso compacto e caixa com altura limitada a ~80-100px com desfoque e mensagem "Conteúdo sensível protegido - clique para ler na íntegra", eliminando o botão expansor e evitando o bloco gigante de blur.
  - Ações inferiores (Denunciar, Contagem de Comentários, Apoios, Botão de Apoio) operam com isolamento de clique (`stopPropagation`).

- **Quando `previewMode === false` (Página de Detalhes `/unburden/[id]`)**:
  - Título estático sem link recursivo.
  - Conteúdo completo renderizado sem line-clamp.
  - Conteúdo sensível renderiza aviso e botão de revelação/ocultação completa (`showSensitiveButton = true`).

---

### 2. `Skeleton` Component Interface (`src/components/ui/skeleton.tsx`)

```typescript
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element
```

#### Comportamento Visual:
- Aplica animação `animate-pulse` com classe base `bg-zinc-200/80 dark:bg-zinc-800/80` (ou contraste aprimorado no tema claro e escuro), garantindo visibilidade imediata sobre cartões brancos e escuros.
