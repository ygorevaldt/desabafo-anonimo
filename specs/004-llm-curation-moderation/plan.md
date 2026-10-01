# Implementation Plan: Curadoria com IA, Structured Outputs, Cache Hash e Auditoria Assíncrona de Denúncias

**Branch**: `004-llm-curation-moderation` | **Date**: 2026-10-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-llm-curation-moderation/spec.md`

## Summary

Implementar a evolução do mecanismo de curadoria e moderação de conteúdo do **Desabafo Anônimo** através de:
1. **Structured Outputs com Schemas Zod**: Garantir respostas determinísticas e previsíveis da IA (`@google/genai`), validando rigorosamente as classificações `APPROVED`, `SENSITIVE` e `BLOCKED` (com rejeição 401 para conteúdos nocivos).
2. **Deduplicação e Caching por Chave Hash Determinística**: Normalização de texto e geração de hash SHA-256 com cache de vereditos em memória, evitando chamadas repetidas e garantindo idempotência e respostas instantâneas (< 5ms).
3. **Registro Idempotente de Denúncias**: Tabela `denuncia` no PostgreSQL com constraint única por sessão e endpoint `POST /api/gateway/v1/unburden/[id]/report`.
4. **Auditoria Assíncrona e Soft Delete**: Disparo não-bloqueante de worker de IA quando o post atinge o limiar de denúncias (padrão: 3), executando exclusão lógica (`deletedAt`) e ocultação pública se a violação for confirmada.

---

## Technical Context

**Language/Version**: Node.js 20+ com TypeScript 5 (modo estrito habilitado).

**Primary Dependencies**: Next.js 15 (App Router), `@google/genai` 2.24.0, Zod 3.23.8, `@prisma/client` 5.22.0, SweetAlert2 11.14.5, Opossum 10.0.0.

**Storage**: PostgreSQL 16+ gerenciado via Docker Compose e Prisma ORM (tabela `desabafo` com `deleted_at`, nova tabela `denuncia` com constraint `unique(session_id, id_desabafo)`).

**Testing**: Vitest + Supertest executando testes de integração ponta a ponta estritos contra Route Handlers e banco de dados real.

**Target Platform**: Servidor Node.js / Docker.

**Project Type**: Aplicação Web Full-Stack (Next.js App Router com API Gateway).

**Performance Goals**: Resolução de vereditos em cache em menos de 5ms; resposta de registro de denúncia em menos de 50ms sem reter o usuário durante a auditoria da IA.

**Constraints**: Não-bloqueio de rotas HTTP por chamadas de IA assíncronas; fallback heurístico determinístico em caso de falha de conexão com a API de IA; isolamento de estado nos testes com `cleanDatabase()`.

**Scale/Scope**: Módulo de moderação, deduplicação por hash, repositório de denúncias, serviço de auditoria em background, rota no gateway e integração na interface de usuário.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **TDD via Integration Tests**: Todos os cenários de aceite documentados na especificação têm testes de integração correspondentes planejados em `tests/integration/app/api/v1/unburden/` para execução prévia no ciclo TDD (Red-Green-Refactor).
- [x] **Integration-Only Scope**: Escopo restrito a testes de integração ponta a ponta com `testClient` (Supertest) e PostgreSQL real via Docker, sem mocks frágeis de banco de dados.
- [x] **Layered Architecture**: Respeito estrito ao fluxo unidirecional: Route Handler -> Zod Schema -> Factory -> Service (`IService<Input, Output>`) -> Repository Interface -> Prisma Repository -> DTO / Domain Exception.
- [x] **Simplicity & Maintainability (KISS & YAGNI)**: Implementação enxuta de cache em memória indexado por SHA-256 e worker desacoplado, sem necessidade de filas pesadas de mensageria externa para a escala atual.
- [x] **AI Safety & Async Processing**: A auditoria assíncrona por IA ao atingir o limiar de denúncias é totalmente desacoplada e não-bloqueante; o fallback determinístico protege contra falhas na API do Google.
- [x] **Idempotency in Critical Operations**: Garantia de idempotência no registro de denúncias via constraint única no banco `(sessionId, unburdenId)` e validação no serviço; deduplicação de análises de moderação via chave hash.
- [x] **DRY & Modular Reuse**: Reutilização de schemas de validação Zod, utilitário centralizado de geração de hash e DTOs imutáveis.
- [x] **Clean Code & Self-Explanatory Implementation**: Código autoexplicativo por design, nomes expressivos e proibição absoluta de comentários de documentação no corpo da implementação.
- [x] **Parity & Automation**: Utilização de scripts automatizados (`wait-for-postgres.js`, `run-tests.js`, `npm test`) e paridade total de banco de dados via Docker.

---

## Project Structure

### Documentation (this feature)

```text
specs/004-llm-curation-moderation/
├── plan.md              # Este plano de implementação
├── research.md          # Decisões técnicas e pesquisa de Structured Outputs e Caching
├── data-model.md        # Modelo de dados com tabela de denúncias e soft delete
├── quickstart.md        # Guia de testes e validação TDD ponta a ponta
├── contracts/
│   └── report-api.md    # Contratos da rota de denúncia e schema estruturado de IA
└── checklists/
    └── requirements.md  # Checklist de qualidade da especificação
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── api/
│   │   ├── constants/
│   │   │   └── report-constants.ts                     # Limiares e constantes de denúncia/moderação
│   │   ├── gateway/
│   │   │   └── dispatcher/
│   │   │       └── gateway-dispatcher.ts               # Roteamento da rota de denúncia no API Gateway
│   │   ├── repositories/
│   │   │   ├── report/
│   │   │   │   ├── report-repository.interface.ts      # Interface do repositório de denúncias
│   │   │   │   └── prisma-report.repository.ts         # Implementação Prisma com contagem e verificação
│   │   │   └── unburden/
│   │   │       ├── unburden-repository.interface.ts    # Inclusão do método softDelete
│   │   │       └── prisma-unburden.repository.ts       # Filtro deletedAt: null e softDelete
│   │   ├── services/
│   │   │   ├── ai-moderation.service.ts                # Moderação com Structured Outputs e cache hash
│   │   │   ├── audit-unburden.service.ts               # Serviço de auditoria assíncrona pós-denúncias
│   │   │   ├── register-report.service.ts              # Registro idempotente de denúncias e gatilho de auditoria
│   │   │   ├── cache/
│   │   │   │   └── moderation-cache.service.ts         # Cache em memória indexado por hash SHA-256
│   │   │   ├── schemas/
│   │   │   │   └── moderation-verdict.schema.ts        # Schema Zod para Structured Outputs da LLM
│   │   │   └── factories/
│   │   │       ├── make-register-report-service.ts     # Fábrica do serviço de denúncia
│   │   │       └── make-audit-unburden-service.ts      # Fábrica do serviço de auditoria
│   │   ├── utils/
│   │   │   └── generate-content-hash.util.ts           # Geração determinística de hash SHA-256 normalizado
│   │   └── v1/
│   │       ├── dtos/
│   │       │   └── report-response.dto.ts              # DTO de resposta de denúncia
│   │       ├── schemas/
│   │       │   └── register-report-body.schema.ts      # Validação Zod do body de denúncia
│   │       └── unburden/
│   │           └── [id]/
│   │               └── report/
│   │                   └── route.ts                    # Route Handler da denúncia
│   └── components/
│       └── Unburden.tsx                                # Integração do botão de denúncia com feedback
├── http/
│   └── register-report.ts                              # Cliente HTTP frontend para denúncias
└── types/
    └── report.type.ts                                  # Tipagem de denúncias para frontend

prisma/
└── schema.prisma                                       # Modelo Report, deletedAt em Unburden e migration

tests/
└── integration/
    └── app/
        └── api/
            └── v1/
                └── unburden/
                    ├── moderation-cache.test.ts        # Testes de Structured Outputs e Caching por hash
                    └── report.test.ts                  # Testes de registro de denúncias, idempotência e soft delete
```

---

## Complexity Tracking

*Nenhuma violação aos princípios da Constituição.* A arquitetura segue rigorosamente KISS, YAGNI e os padrões estabelecidos do projeto.
