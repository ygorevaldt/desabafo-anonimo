# Implementation Plan: Feed Post Preview and Lively Skeleton Loading

**Branch**: `master` | **Date**: 2026-10-02 | **Spec**: [spec.md](file:///c:/Users/ygore/Documents/1-projetos/personal/desabafo-anonimo/specs/005-feed-preview-skeleton/spec.md)

**Input**: Feature specification from `/specs/005-feed-preview-skeleton/spec.md`

## Summary

Otimizar a visualização das listagens de desabafos (Home `/` e Todos os Desabafos `/unburdens`) através de:
1. Truncamento/clamping de texto nos cards do feed (`previewMode`), mantendo o layout verticalmente compacto e estimulando o usuário a abrir o post completo para ler e interagir.
2. Contenção visual dos alertas e desfoque de desabafos sensíveis no feed à altura padronizada da prévia, eliminando caixas de blur gigantes.
3. Aprimoramento visual e de contraste dos componentes de skeleton loading (`Skeleton` e `UnburdenList`), fornecendo animação ativa e perceptível nos temas claro e escuro.

## Technical Context

**Language/Version**: TypeScript 5+ com Node.js 20+

**Primary Dependencies**: Next.js 15 (App Router), React 19, Tailwind CSS, React Icons

**Storage**: PostgreSQL 16+ via Prisma ORM (sem alteração estrutural no banco)

**Testing**: Vitest + Supertest para testes de integração

**Target Platform**: Navegadores modernos (Desktop e Mobile)

**Project Type**: Aplicação Web Full-Stack

**Performance Goals**: Renderização ágil e responsiva das listagens com sub-100ms de TTFB para componentes clientes e zero layout shift desordenado durante o carregamento de dados.

**Constraints**: Preservação estrita dos princípios constitucionais (KISS, DRY, Clean Code sem comentários em código, segregação de commits).

**Scale/Scope**: Componentes de UI de feed e skeleton (`Unburden`, `UnburdenListItem`, `UnburdenList`, `Skeleton`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **TDD via Integration Tests**: As rotas de API existentes possuem cobertura completa e o frontend respeita contratos consistentes.
- [x] **Integration-Only Scope**: Mantido o paradigma de testes de integração ponta a ponta sem unit tests isolados com mocks falsos.
- [x] **Layered Architecture**: Separação clara entre páginas, componentes visuais e contratos de dados.
- [x] **Simplicity & Maintainability**: Solução baseada em recursos nativos do Tailwind CSS (`line-clamp`) e refatoração direta de componentes sem dependências adicionais.
- [x] **AI Safety & Async Processing**: A moderação e acolhimento continuam atuando de forma assíncrona e segura.
- [x] **Idempotency in Critical Operations**: Preservada em todas as mutações e interações de feed (apoios e denúncias).
- [x] **DRY & Modular Reuse**: Reutilização direta de componentes (`Unburden`, `Skeleton`) configuráveis via props sem duplicar marcação JSX.
- [x] **Clean Code & Self-Explanatory Implementation**: Código limpo, sem comentários explicativos no corpo dos arquivos.
- [x] **Parity & Automation**: Scripts de automação e Docker permanecem inalterados.

## Project Structure

### Documentation (this feature)

```text
specs/005-feed-preview-skeleton/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── feed-preview-contract.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (affected files)

```text
src/
├── components/
│   ├── ui/
│   │   └── skeleton.tsx          # Aprimoramento de contraste e pulso do skeleton
│   ├── Unburden.tsx              # Suporte a previewMode, line-clamp e proteção compacta de conteúdo sensível
│   ├── UnburdenListItem.tsx      # Passagem de previewMode para itens do feed
│   └── UnburdenList.tsx          # Esqueleto estruturado com múltiplas linhas de prévia
```

**Structure Decision**: Refatoração direta e modular nos componentes visuais de listagem e skeleton, preservando os contratos de dados e integração.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Nenhuma violação constitucional | N/A | N/A |
