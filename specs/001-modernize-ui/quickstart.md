# Quickstart & Verification Guide: Modernização da UI

**Feature**: `001-modernize-ui` | **Date**: 2026-09-29

## Pré-requisitos
- Node.js 20+
- Docker & Docker Compose (para banco PostgreSQL)
- Repositório na branch `001-modernize-ui`

## Passos de Verificação

### 1. Instalação e Execução de Testes Automatizados
```bash
npm run test
```
*Resultado Esperado*: Todos os testes de integração da API passam com 100% de sucesso.

### 2. Validação de Build e Tipagem
```bash
npm run build
```
*Resultado Esperado*: Compilação Next.js estática e dinâmica sem erros de tipo TypeScript ou avisos impeditivos de ESLint.

### 3. Validação Visual e Interativa no Navegador
```bash
npm run dev
```
1. Acesse `http://localhost:3000`.
2. Verifique o cabeçalho moderno com atalho ao CVV 188 e botão de alternância Dark/Light Mode.
3. Alterne para o modo escuro: as cores devem adotar paleta escura suave sem contraste agressivo.
4. Clique em "Desabafar": preencha o formulário e ative a opção de conforto de IA. Envie e comprove a transição imediata para o feed via Redux.
5. Clique em "Apoiar" em um desabafo: o contador deve incrementar instantaneamente com feedback visual.
6. Abra um desabafo detalhado: confira a área de comentários acolhedora e responsiva.
