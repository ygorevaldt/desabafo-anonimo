# Implementation Plan: Modernização da UI com Shadcn/UI, Redux e Modo Escuro

**Branch**: `001-modernize-ui` | **Date**: 2026-09-29 | **Spec**: [specs/001-modernize-ui/spec.md](file:///c:/Users/ygore/Documents/1-projetos/personal/desabafo-anonimo/specs/001-modernize-ui/spec.md)

**Input**: Feature specification from `specs/001-modernize-ui/spec.md`

## Summary

Modernizar a interface do Desabafo Anônimo sem descaracterizar a essência acolhedora do produto. O plano contempla:
1. Atualização do Next.js para a versão estável compatível com Vercel;
2. Configuração de componentes e primitivas baseadas em Shadcn/UI com TailwindCSS (estilo Google/Material 3 clean, cantos arredondados, paleta acolhedora com tons de rose suave e neutros);
3. Suporte robusto a Dark/Light Mode com `next-themes` sem FOUC;
4. Gerenciamento de estado global com Redux Toolkit para o feed, desabafo ativo, interações de apoio otimista e comentários;
5. Preservação estrita dos testes de integração existentes e da constituição do projeto.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20+

**Primary Dependencies**: Next.js (versão estável mais recente), React 19, TailwindCSS, Shadcn/UI primitives (`clsx`, `tailwind-merge`, `class-variance-authority`), `@reduxjs/toolkit`, `react-redux`, `next-themes`, `react-icons`.

**Storage**: PostgreSQL 16+ via Prisma ORM 5.22.

**Testing**: Vitest + Supertest executando contra Route Handlers reais e banco PostgreSQL real conteinerizado via Docker Compose.

**Target Platform**: Web full-stack (Vercel & Node server).

**Project Type**: Monolito modular full-stack (Next.js 15 App Router).

**Performance Goals**: Tempo de renderização inicial < 1s, alternância de tema instantânea (< 100ms), feedback de apoio interativo < 50ms (otimista).

**Constraints**: Respeitar a Constituição v1.0.0; manter 100% de retrocompatibilidade com a API REST; testes exclusivamente de integração.

**Scale/Scope**: Todas as páginas do site (`/`, `/about`, `/unburdens`, `/unburden`, `/unburden/[id]`), seus componentes e o estado compartilhado.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **TDD via Integration Tests**: A suíte de testes de integração existente em `tests/integration/app/api/v1/` cobre todas as rotas e contratos da API. Todos os testes são mantidos e executados antes e depois das mudanças.
- [x] **Integration-Only Scope**: Nenhum teste unitário desnecessário é introduzido. Mantida a exclusividade de testes de integração com banco real.
- [x] **Layered Architecture**: A camada de API (`v1`), serviços (`IService`), repositórios (`IUnburdenRepository`) e factories permanecem intactas e desacopladas. O frontend é estruturado com separação limpa entre componentes UI, páginas e store Redux.
- [x] **Simplicity & Maintainability**: Adotado Shadcn/UI de forma modular em `src/components/ui/` e Redux com slices objetivos, sem boilerplate excessivo.
- [x] **AI Safety & Fallback**: Fluxo de IA com salvaguarda e fallback heurístico permanece ativo e transparente para a UI.
- [x] **Parity & Automation**: O ambiente Docker e os scripts de teste continuam sendo o padrão de validação.

## Project Structure

### Documentation (this feature)

```text
specs/001-modernize-ui/
├── plan.md              # Este plano de implementação
├── research.md          # Pesquisa técnica e decisões arquiteturais
├── data-model.md        # Modelos de dados e schemas do Redux State
├── quickstart.md        # Guia de validação da feature
├── contracts/           # Contratos de componentes e ações do Redux
│   └── ui-contracts.md
└── tasks.md             # Decomposição detalhada de tarefas executáveis
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── api/                      # Camadas de backend intactas (Rotas, Services, Repositories)
│   ├── about/page.tsx            # Página Sobre com visual acolhedor e clean
│   ├── unburden/page.tsx         # Página de novo desabafo com Shadcn/UI e Redux
│   ├── unburden/[id]/page.tsx    # Página de visualização individual e comentários
│   ├── unburdens/page.tsx        # Feed completo de desabafos
│   ├── globals.css               # Estilos globais e variáveis de tema (Light/Dark)
│   ├── layout.tsx                # Root layout com ThemeProvider e Redux Provider
│   └── page.tsx                  # Home page modernizada
├── components/
│   ├── ui/                       # Componentes Shadcn/UI (Button, Card, Input, Textarea, Badge, Skeleton)
│   ├── ThemeToggle.tsx           # Alternador de modo claro/escuro
│   ├── NavBar.tsx                # Cabeçalho com CVV 188 e ThemeToggle
│   ├── Footer.tsx                # Rodapé minimalista
│   ├── UnburdenCard.tsx          # Cartão de desabafo moderno
│   ├── UnburdenList.tsx          # Lista conectada à store Redux
│   ├── UnburdenForm.tsx          # Formulário de desabafo com IA
│   ├── CommentList.tsx           # Lista de comentários moderna
│   └── CommentForm.tsx           # Formulário de envio de comentários
├── store/                        # Redux Toolkit
│   ├── store.ts                  # Store centralizada
│   ├── hooks.ts                  # useAppDispatch e useAppSelector tipados
│   ├── StoreProvider.tsx         # Provider cliente para o Next.js
│   └── slices/
│       ├── feedSlice.ts          # Slice para desabafos e paginação
│       └── activeUnburdenSlice.ts# Slice para desabafo ativo e comentários
├── http/                         # Clientes HTTP existentes
└── types/                        # Tipagens compartilhadas
```

**Structure Decision**: Monolito modular full-stack Next.js com App Router, testes de integração estritos contra banco real e camadas de serviço e repositório desacopladas.

## Complexity Tracking

Nenhuma violação aos princípios constitucionais identificada. A arquitetura permanece simples, modular e desacoplada.
