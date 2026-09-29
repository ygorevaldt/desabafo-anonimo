# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]

**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]

**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]

**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]

**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]

**Project Type**: [e.g., library/cli/web-service/mobile-app/compiler/desktop-app or NEEDS CLARIFICATION]

**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]

**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]

**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [ ] **TDD via Integration Tests**: Every acceptance scenario has a planned integration test in `tests/integration/app/api/v1/` to be written and failing BEFORE implementation begins.
- [ ] **Integration-Only Scope**: Only integration tests are used with `testClient` and real PostgreSQL database (NO isolated unit tests with excessive mocks).
- [ ] **Layered Architecture**: Respects the unidirectional flow: Route Handler -> Zod Schema -> Factory -> Service (`IService<Input, Output>`) -> Repository Interface -> Prisma Repository -> DTO / Domain Exception.
- [ ] **Simplicity & Maintainability**: Adheres to KISS and YAGNI; avoids premature abstractions or unnecessary complexity.
- [ ] **AI Safety & Fallback**: Any AI feature integrates deterministic fallback (`fallbackModeration`, etc.) and respects user vulnerability safeguards.
- [ ] **Parity & Automation**: Database operations and test runs leverage the established Docker and scripts pipeline.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── api/
│   │   ├── constants/            # HTTP status codes e constantes
│   │   ├── infra/                # Prisma client e configurações de infraestrutura
│   │   ├── repositories/         # Interfaces e implementações Prisma
│   │   ├── services/             # Regras de negócio, factories e exceções
│   │   │   ├── exceptions/       # Exceções tipadas de domínio
│   │   │   └── factories/        # Fábricas de injeção de dependência dos serviços
│   │   ├── utils/                # Utilitários de backend (ex: handleRequestError)
│   │   └── v1/                   # Endpoints HTTP da versão 1 da API
│   │       ├── dtos/             # Data Transfer Objects para respostas da API
│   │       ├── schemas/          # Validações Zod de payloads de entrada
│   │       └── [domain]/route.ts # Route Handlers (Next.js App Router)
│   └── [domain]/page.tsx         # Páginas do frontend (Next.js App Router)
├── components/                   # Componentes React modulares e reutilizáveis
├── http/                         # Funções de requisição HTTP do frontend
└── types/                        # Tipagens compartilhadas do frontend

tests/
└── integration/
    └── app/
        └── api/
            └── v1/               # Testes de integração ponta a ponta (Supertest + DB real)
```

**Structure Decision**: Monolito modular full-stack Next.js com App Router, testes de integração estritos contra banco real e camadas de serviço e repositório desacopladas.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
