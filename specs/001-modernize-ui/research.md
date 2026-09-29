# Technical Research & Architecture Decisions: Modernização da UI

**Feature**: `001-modernize-ui` | **Date**: 2026-09-29

## 1. Design System e Shadcn/UI com TailwindCSS

### Decisão
Adotar componentes acessíveis no estilo **Shadcn/UI** construídos sobre utilitários TailwindCSS e primitivas leves, utilizando `clsx` e `tailwind-merge` na função utilitária padrão `cn(...)`.
Os componentes residirão em `src/components/ui/` (ex: `button.tsx`, `card.tsx`, `dialog.tsx`, `textarea.tsx`, `input.tsx`, `badge.tsx`, `skeleton.tsx`, `dropdown-menu.tsx`).

### Racional
- Mantém o código 100% sob controle do projeto (sem dependências pesadas e opacas de pacotes de UI de terceiros).
- Altamente customizável para refletir a estética inspirada no **Google / Material 3**: bordas suavemente arredondadas (`rounded-2xl` e `rounded-3xl`), sombras sutis, microinterações acolhedoras, tipografia limpa e espaçamento generoso.
- Perfeita compatibilidade com TailwindCSS e Next.js App Router (React Server Components e Client Components).

### Alternativas Consideradas
- **Material-UI (MUI)**: Rejeitado por carregar um runtime CSS-in-JS pesado e conflituoso com Server Components do Next.js 15.
- **Chakra UI**: Rejeitado por problemas similares de overhead e compatibilidade com React 19.

---

## 2. Gerenciamento de Estado com Redux Toolkit

### Decisão
Configurar o Redux Toolkit (`@reduxjs/toolkit` e `react-redux`) com um store modular em `src/store/`:
- `store.ts`: Configuração da store com TypeScript estrito.
- `hooks.ts`: `useAppDispatch` e `useAppSelector` tipados.
- `slices/feedSlice.ts`: Gerencia lista de desabafos, paginação, loading, erro e filtros.
- `slices/activeUnburdenSlice.ts`: Gerencia o desabafo ativo, envio e lista de comentários, além de atualizações otimistas de suporte/apoio.
- `StoreProvider.tsx`: Client Component wrapper injetado no layout principal do Next.js.

### Racional
- Elimina prop drilling e sincroniza o estado entre a home (`/`), lista (`/unburdens`) e visualização individual (`/unburden/[id]`).
- Permite feedback instantâneo (otimista) no botão de apoio sem esperar a resposta HTTP da API, aumentando o sentimento de resposta imediata do usuário.

### Alternativas Consideradas
- **Zustand**: Embora leve, o usuário solicitou expressamente Redux para robustez e padronização corporativa.
- **React Context puro**: Causa re-renderizações desnecessárias em listas grandes e não oferece devtools estruturados nem middlewares para efeitos assíncronos.

---

## 3. Dark Mode / Light Mode com Transição Suave

### Decisão
Utilizar `next-themes` integrado a variáveis CSS no TailwindCSS com a estratégia de classe (`attribute="class"`).
- Cores no Modo Claro: Fundo suave e quente (`#faf9f6` ou `#fdfcfb`), cartões brancos com bordas sutis (`border-zinc-200/60`), destaque em tons acolhedores de Rose e Coral (`#f43f5e`, `#fb7185`).
- Cores no Modo Escuro: Fundo cinza escuro suave e acolhedor (`#121214` ou `#18181b`), cartões em `#1f1f23` com bordas sutis (`border-zinc-800`), preservando contraste suave sem agredir os olhos (evitando o preto puro `#000000` em contraste direto com branco puro).
- O toggle de tema ficará situado no `NavBar`, com opções Claro / Escuro / Sistema e ícones de Sol/Lua.

### Racional
- Previne qualquer Flash of Unstyled Content (FOUC) na renderização inicial do Next.js.
- Persistência automática em `localStorage` e suporte nativo às preferências do sistema operacional (`prefers-color-scheme`).

---

## 4. Atualização do Next.js para Sucesso no Deploy da Vercel

### Decisão
Atualizar `next` no `package.json` para a versão estável mais recente (Next.js 15.2+ ou compatível com React 19) e alinhar `@types/react` e `@types/react-dom`.

### Racional
- O usuário informou que o deploy na Vercel está falhando devido à versão anterior do Next.js (`15.0.2` combinada com o Release Candidate do React 19).
- A atualização do Next.js e de suas dependências assegura compatibilidade total na compilação estática e Server Actions da Vercel.
