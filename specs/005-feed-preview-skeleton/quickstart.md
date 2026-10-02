# Quickstart & Validation Guide: Feed Post Preview and Lively Skeleton Loading

## Objetivos de Validação
Validar que a listagem de desabafos apresenta cards visualmente compactos com prévia de texto, tratamento contido para desabafos sensíveis e experiência viva de carregamento com skeletons contrastantes.

## Pré-requisitos
- Node.js 20+
- Docker (Postgres em execução via `npm run services:up` se for rodar API)

## Passo a Passo para Teste Local

### 1. Iniciar Serviços e Aplicação
```bash
npm run services:up
npm run dev
```

### 2. Validação da Experiência de Carregamento (Skeletons)
1. Abra o navegador em `http://localhost:3000`.
2. Observe o carregamento inicial:
   - Em vez de caixas brancas estáticas invisíveis, são exibidos esqueletos com linhas cinzas pulsantes bem visíveis com contraste adequado.
   - Alterne entre o tema claro e tema escuro e verifique a visibilidade e nitidez do efeito em ambos os temas.

### 3. Validação da Prévia e Clamping no Feed
1. Cadastre ou visualize um desabafo longo (com mais de 5 parágrafos ou 300 palavras).
2. Na página inicial (`/`) e na página de desabafos (`/unburdens`):
   - O card deve exibir apenas uma prévia compacta (3 a 4 linhas de texto) sem esticar a página verticalmente.
3. Clique no título ou no card do desabafo:
   - O navegador deve abrir a página de detalhes (`/unburden/[id]`), onde o texto completo é exibido na íntegra.

### 4. Validação do Desabafo com Conteúdo Sensível no Feed
1. Visualize um desabafo marcado como conteúdo sensível.
2. Na listagem de desabafos:
   - O bloco de proteção sensível deve ficar contido na altura compacta da prévia, sem gerar um bloco gigante de desfoque.
3. Clique no desabafo para abrir os detalhes:
   - Na página `/unburden/[id]`, o botão "Visualizar conteúdo sensível" permite revelar o texto completo normalmente.

### 5. Execução dos Testes Automatizados
```bash
npm test
npm run lint
```
