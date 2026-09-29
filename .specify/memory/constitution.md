<!--
Sync Impact Report:
- Version change: Initial template (unratified) → v1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] → I. Test-Driven Development (TDD) via Testes de Integração Estritos (NÃO-NEGOCIÁVEL)
  - [PRINCIPLE_2_NAME] → II. Arquitetura em Camadas e Modularidade Desacoplada
  - [PRINCIPLE_3_NAME] → III. Simplicidade, Clareza e Manutenibilidade (KISS & YAGNI)
  - [PRINCIPLE_4_NAME] → IV. Resiliência de IA com Fallback Gracioso e Segurança
  - [PRINCIPLE_5_NAME] → V. Infraestrutura Automatizada e Paridade de Ambientes
- Added sections:
  - Padrões Arquiteturais e Tecnologias
  - Fluxo de Desenvolvimento e Quality Gates
- Removed sections: N/A (conversão do template base para constituição formal)
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/tasks-template.md
  - ✅ .specify/templates/spec-template.md
- Follow-up TODOs: Nenhuma pendência.
-->

# Desabafo Anônimo Constitution

## Core Principles

### I. Test-Driven Development (TDD) via Testes de Integração Estritos (NÃO-NEGOCIÁVEL)
Todo desenvolvimento de novas funcionalidades, regras de negócio ou correções de defeitos DEVE seguir o ciclo rigoroso de TDD: **Red (escrever teste que falha) → Green (código mínimo para aprovação) → Refactor (otimização e limpeza da estrutura)**.
- **Exclusividade de Testes de Integração**: O projeto adota exclusivamente testes de integração ponta a ponta (localizados em `tests/integration/app/api/v1/`). É PROIBIDO criar testes unitários isolados com mocks excessivos de banco ou de serviços que criam falsa sensação de cobertura.
- **Rastreabilidade aos Critérios de Aceite**: Cada cenário de aceite documentado na especificação (`spec.md`) no formato *Given-When-Then* DEVE possuir correspondência unívoca em um caso de teste de integração antes do início da implementação.
- **Execução Real In-Memory**: Os testes utilizam `testClient` (Supertest) disparado diretamente contra as funções dos Route Handlers do Next.js App Router, interagindo com o banco de dados PostgreSQL real provisionado via Docker. Cada teste DEVE assegurar isolamento de estado limpando as tabelas afetadas via `cleanDatabase()` ou rotinas no `beforeEach`.

### II. Arquitetura em Camadas e Modularidade Desacoplada
Para garantir manutenibilidade contínua e facilidade de evolução, o backend DEVE seguir estritamente o fluxo unidirecional em camadas:
1. **Route Handler (`src/app/api/v1/.../route.ts`)**: Ponto de entrada HTTP. Responsável por capturar a requisição, validar o payload com Zod, delegar a execução ao Service via Factory, formatar o retorno via DTO e encaminhar erros a `handleRequestError`.
2. **Esquema de Validação (`src/app/api/v1/schemas/...`)**: Schemas Zod declarativos para validação estrita de payload (body, query params e route params).
3. **Factory (`src/app/api/services/factories/...`)**: Padrão fábrica para instanciar repositórios e compor as dependências dos serviços.
4. **Service (`src/app/api/services/...`)**: Regras de negócio puras implementando a interface `IService<Input, Output>`. Os serviços NUNCA chamam o Prisma Client diretamente; operam exclusivamente contra interfaces de repositório (`I*Repository`).
5. **Repositório (`src/app/api/repositories/...`)**: Interface de abstração (`*-repository.interface.ts`) desacoplada da implementação concreta com Prisma (`prisma-*.repository.ts`).
6. **Data Transfer Object (`src/app/api/v1/dtos/...`)**: DTOs imutáveis que garantem contratos de resposta públicos blindados contra vazamentos estruturais do banco.
7. **Exceções de Domínio (`src/app/api/services/exceptions/...`)**: Falhas de domínio lançam exceções tipadas específicas, mapeadas de forma centralizada para códigos HTTP em `src/app/api/utils/handle-request-error.util.ts`.
O frontend deve manter modularidade equivalente: páginas sob `src/app/`, componentes desacoplados em `src/components/`, clientes HTTP encapsulados em `src/http/` e definições tipadas em `src/types/`.

### III. Simplicidade, Clareza e Manutenibilidade (KISS & YAGNI)
O projeto deve manter sua essência limpa, organizada e compreensível, evitando sobre-engenharia:
- Nenhuma abstração, padrão de projeto ou dependência externa deve ser introduzida sem uma necessidade concreta e imediata.
- O código DEVE ser legível e autoexplicativo, priorizando funções curtas com propósito único, nomenclatura clara e utilitários focados (`src/app/api/utils/`, `src/utils/`).
- Novas funcionalidades devem harmonizar-se com a convenção de pastas e estilos existentes, garantindo que qualquer desenvolvedor ou agente consiga navegar e estender o sistema de forma previsível e rápida.

### IV. Resiliência de IA com Fallback Gracioso e Segurança
A inteligência artificial (`@google/genai`) atua na moderação de conteúdo (`AiModerationService`) e no acolhimento empático aos usuários (`AiComfortService`):
- **Fallback Gracioso Obrigatório**: Falhas de rede, ausência da chave `GEMINI_API_KEY`, latência excessiva ou instabilidade na API do Google Gemini NUNCA devem interromper os fluxos centrais da aplicação. O sistema DEVE acionar imediatamente estratégias determinísticas de contingência (como `fallbackModeration()`).
- **Segurança e Proteção ao Usuário**: Por tratar de desabafos e sentimentos vulneráveis, conteúdos que violem as políticas de segurança devem ser categorizados (`APPROVED`, `SENSITIVE`, `BLOCKED`) e conteúdos bloqueados devem ser rejeitados com status `401 Unauthorized`. O serviço de acolhimento deve priorizar mensagens humanizadas, acolhedoras e direcionamento preventivo ao Centro de Valorização da Vida (CVV - 188).

### V. Infraestrutura Automatizada e Paridade de Ambientes
O ambiente de desenvolvimento e testes DEVE ser idêntico e totalmente automatizado:
- O banco de dados PostgreSQL roda isolado via Docker Compose (`infra/compose.yaml`).
- Toda execução de testes ou inicialização local é orquestrada por scripts em `infra/scripts/` (`wait-for-postgres.js`, `run-tests.js`), garantindo que o PostgreSQL esteja disponível e as migrações Prisma (`prisma migrate deploy`) estejam aplicadas antes de qualquer teste.
- Scripts padronizados no `package.json` (`npm run dev`, `npm test`, `npm run test:run`) são a fonte primária de execução para desenvolvedores humanos e agentes autônomos.

## Padrões Arquiteturais e Tecnologias

### Stack Oficial
- **Runtime & Linguagem**: Node.js 20+ com TypeScript (modo estrito habilitado).
- **Framework Full-Stack**: Next.js 15 (App Router, Server Components e Route Handlers).
- **Interface & Estilização**: React 19, TailwindCSS, React Icons.
- **Validação de Dados**: Zod para validação em runtime de schemas e payloads.
- **ORM & Banco de Dados**: Prisma ORM conectado a PostgreSQL 16+.
- **Testes Automatizados**: Vitest + Supertest para testes de integração de API.
- **Inteligência Artificial**: SDK oficial `@google/genai` (Google GenAI).
- **Conteinerização**: Docker e Docker Compose.

### Diretrizes Estruturais do Código
- Todas as rotas de API residem sob `src/app/api/v1/[dominio]/route.ts`.
- Métodos HTTP suportados por rota devem ser exportados explicitamente (`GET`, `POST`, `PUT`, `DELETE`).
- Nenhum acesso direto a banco de dados ou chamadas ao `prisma` é permitido dentro de Route Handlers ou Services; utilize os repositórios injetados.
- Códigos HTTP devem utilizar constantes semânticas via `HttpStatusCode` (`src/app/api/constants/http-status-code.ts`).

## Fluxo de Desenvolvimento e Quality Gates

Para garantir que o projeto continue evoluindo de forma organizada e sustentável, todo ciclo de implementação DEVE seguir os seguintes portões de qualidade (Quality Gates):

1. **Gate 1 - Especificação e Cenários de Aceite (`/speckit-specify`)**:
   - Criação da especificação funcional com histórias de usuário priorizadas e cenários de aceite completos no padrão *Given-When-Then*.
2. **Gate 2 - Planejamento Arquitetural (`/speckit-plan`)**:
   - Definição do design técnico e validação contra os princípios constitucionais (Constitution Check). Nenhuma violação estrutural é aceita sem justificativa explícita.
3. **Gate 3 - Decomposição em Tarefas TDD (`/speckit-tasks`)**:
   - Tarefas ordenadas iniciando obrigatoriamente pela escrita dos testes de integração para cada cenário de aceite, seguidas pela implementação dos artefatos em camadas.
4. **Gate 4 - Execução TDD (Red-Green-Refactor)**:
   - Os testes de integração devem ser criados e executados antes da implementação, comprovando falha (Red).
   - Implementação mínima da rota, serviço e repositório até aprovação do teste (Green).
   - Refatoração do código garantindo código limpo, modular e sem duplicações (Refactor).
5. **Gate 5 - Verificação Final de Integração**:
   - Execução bem-sucedida de `npm run lint` sem erros de linting.
   - Execução de `npm test` aprovando 100% dos testes de integração com banco de dados real.

## Governance

A presente Constituição é a autoridade máxima reguladora dos padrões de engenharia, arquitetura e qualidade do projeto **Desabafo Anônimo**. Suas determinações prevalecem sobre quaisquer opiniões ad-hoc ou pressões imediatas por velocidade em detrimento da qualidade.

- **Conformidade Obrigatória**: Todo plano de implementação, Pull Request ou revisão de código deve atestar conformidade com os princípios aqui descritos.
- **Procedimento de Emenda**: Qualquer alteração, inclusão ou exclusão de princípio exige discussão fundamentada, atualização do Sync Impact Report e sincronização imediata dos templates correspondentes do Spec-Kit (`.specify/templates/`).
- **Política de Versionamento da Constituição**:
  - **MAJOR (ex.: 2.0.0)**: Alterações substanciais em princípios fundamentais (ex.: revisão do paradigma exclusivo de testes de integração ou refatoração profunda da arquitetura em camadas).
  - **MINOR (ex.: 1.1.0)**: Adição de novos princípios, novas diretrizes técnicas ou inclusão de novos domínios arquiteturais sem invalidar as regras anteriores.
  - **PATCH (ex.: 1.0.1)**: Correções de texto, clarificações semânticas e refinamentos de diretrizes existentes.

**Version**: 1.0.0 | **Ratified**: 2026-09-29 | **Last Amended**: 2026-09-29
