# Quickstart & Validation Guide: Feature 002

**Feature**: `002-comments-idempotency-replies`
**Date**: 2026-09-30

## Validation Scenarios

### Scenario 1: Submissão de Comentário e Validação de Não-Duplicação
1. Abra a página de um desabafo (`/unburden/[id]`).
2. Digite um comentário acolhedor com mais de 5 caracteres.
3. Clique em "Apoiar com mensagem".
4. Verifique que o botão exibe o estado de carregamento e não permite novos cliques.
5. Verifique que a lista "Apoios da Comunidade" exibe exatamente 1 ocorrência do comentário recém-adicionado.
6. Recarregue a página (F5) e confirme que a contagem e os itens permanecem consistentes.

### Scenario 2: Publicação Rápida de Desabafo com Acolhimento Assíncrono
1. Acesse `/unburden`.
2. Observe que a opção de acolhimento por IA inicia desmarcada (`false`).
3. Preencha título e conteúdo e ative a opção de acolhimento por IA.
4. Clique em publicar.
5. Verifique que o redirecionamento ocorre imediatamente (sem esperar 3-5 segundos da chamada LLM).
6. Aguarde alguns instantes e abra o desabafo: o comentário de acolhimento inicial da IA estará presente.

### Scenario 3: Respostas a Comentários (Threaded Comments)
1. Na lista de comentários de um desabafo, localize um comentário existente.
2. Clique no botão "Responder".
3. Digite uma mensagem de agradecimento ou réplica (ex: "Muito obrigado pelas palavras!").
4. Clique em "Responder".
5. Verifique que a resposta é renderizada aninhada com recuo abaixo do comentário pai.

### Scenario 4: Tema Padrão e Ícone de Alternância
1. Abra a aplicação em uma aba anônima (sem dados em localStorage).
2. Verifique que o tema inicial carregado é o Light Mode.
3. Alterne para o Dark Mode e observe o ícone do sol: deve ser exibido com cor sólida e sóbria (sem saturação amarela), harmonizado com o ícone da lua.
