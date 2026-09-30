# Implementation Plan: Correção de Duplicação, Idempotência em Operações Críticas, Acolhimento Assíncrono por IA e Respostas a Comentários

**Branch**: `002-comments-idempotency-replies` | **Date**: 2026-09-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-comments-idempotency-replies/spec.md`

## Summary

Esta funcionalidade resolve a duplicação no envio de comentários através de correções no fluxo de callbacks e blindagem com idempotência no Redux slice e componentes do frontend; desacopla a geração de acolhimento inicial por IA para execução não-bloqueante/assíncrona no backend liberando o tempo de resposta da rota `POST /api/v1/unburden`; implementa suporte completo a respostas para comentários (subcomentários aninhados) no backend e na UI; e aplica refinamentos visuais de usabilidade (tema claro padrão, ícone monocromático do sol e opção de IA desabilitada por default).

## Technical Context

**Language/Version**: Node.js 20+ com TypeScript 5 (modo estrito)
**Primary Dependencies**: Next.js 15.2 (App Router), React 19, Redux Toolkit 2.6, TailwindCSS, Zod 3.23, @google/genai 2.24
**Storage**: PostgreSQL 16+ via Prisma ORM 5.22
**Testing**: Vitest 2.1.4 + Supertest 7.3 (Testes de integração de API contra banco real)
**Target Platform**: Web (Next.js SSR + Client Components)
**Project Type**: Monolito modular full-stack web
**Performance Goals**: `POST /api/v1/unburden` com acolhimento IA retornando em < 300ms (redução de 90%+ na latência perceptível); submissão e renderização de comentários instantânea sem duplicação
**Constraints**: Zero chamadas diretas ao Prisma a partir de rotas ou serviços; 100% de conformidade com os princípios da Constituição v1.1.0; resiliência garantida se a IA falhar
**Scale/Scope**: Operações de comentários, subcomentários, desabafos e preferências de tema

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **TDD via Integration Tests**: Every acceptance scenario has a planned integration test in `tests/integration/app/api/v1/` to be written and failing BEFORE implementation begins.
- [x] **Integration-Only Scope**: Only integration tests are used with `testClient` and real PostgreSQL database (NO isolated unit tests with excessive mocks).
- [x] **Layered Architecture**: Respects the unidirectional flow: Route Handler -> Zod Schema -> Factory -> Service (`IService<Input, Output>`) -> Repository Interface -> Prisma Repository -> DTO / Domain Exception.
- [x] **Simplicity & Maintainability**: Adheres to KISS and YAGNI; avoids premature abstractions or unnecessary complexity.
- [x] **AI Safety & Async Processing**: Immediate AI comfort generation is non-blocking/asynchronous; fallback mechanisms are active and sensitive content safeguards are enforced.
- [x] **Idempotency in Critical Operations**: All critical state-mutating operations (vents, comments, subcomments, supports) guarantee idempotency in frontend and backend.
- [x] **Parity & Automation**: Database operations and test runs leverage the established Docker and scripts pipeline.

## Project Structure

### Documentation (this feature)

```text
specs/002-comments-idempotency-replies/
├── plan.md              # This file
├── research.md          # Technical decisions and root cause analysis
├── data-model.md        # Entities, relationships and schemas
├── quickstart.md        # Step-by-step validation guide
├── contracts/
│   └── comment-api.md   # API contracts for comments, replies, and unburdens
└── tasks.md             # Decomposed tasks for implementation
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── api/
│   │   ├── repositories/
│   │   │   └── comment/
│   │   │       ├── comment-repository.interface.ts
│   │   │       └── prisma-comment.repository.ts
│   │   ├── services/
│   │   │   ├── register-unburden.service.ts
│   │   │   ├── register-comment.service.ts
│   │   │   ├── register-subcomment.service.ts
│   │   │   └── list-comment.service.ts
│   │   └── v1/
│   │       ├── dtos/
│   │       │   └── comment-response.dto.ts
│   │       ├── schemas/
│   │       │   ├── register-comment-body.schema.ts
│   │       │   └── register-subcomment-body.schema.ts
│   │       └── comment/
│   │           └── route.ts
│   ├── layout.tsx
│   └── unburden/
│       ├── page.tsx
│       └── [id]/page.tsx
├── components/
│   ├── CommentForm.tsx
│   ├── CommentList.tsx
│   ├── UnburdenForm.tsx
│   └── ThemeToggle.tsx
├── http/
│   ├── register-comment.ts
│   └── fetch-unburden-comments.ts
├── store/slices/
│   └── activeUnburdenSlice.ts
└── types/
    └── comment.type.ts

tests/
└── integration/
    └── app/
        └── api/
            └── v1/
                ├── comment/
                │   ├── post.test.ts
                │   └── get.test.ts
                └── unburden/
                    └── post.test.ts
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | Total conformidade com a Constituição v1.1.0 e princípios KISS/YAGNI |
