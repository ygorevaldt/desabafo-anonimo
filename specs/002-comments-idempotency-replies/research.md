# Research: Correção de Duplicação, Idempotência em Operações Críticas, Acolhimento Assíncrono por IA e Respostas a Comentários

**Feature**: `002-comments-idempotency-replies`
**Date**: 2026-09-30

## Decision 1: Idempotência no Frontend e Correção do Comentário Duplicado

### Context
Ao submeter um comentário através de `CommentForm.tsx`, o comentário aparecia duas vezes na lista de comentários ("Apoios da Comunidade"). Ao atualizar a página (F5), apenas um comentário existia no banco de dados.

### Análise de Causa Raiz
1. Em `CommentForm.tsx` (linha 39): `dispatch(addComment(newComment))` era executado imediatamente após o sucesso da API.
2. Em `CommentForm.tsx` (linha 40): `onCommentRegistered?.(newComment)` era chamado logo em seguida.
3. Em `src/app/unburden/[id]/page.tsx` (linha 70): `handleNewComment` executava novamente `dispatch(addComment(newComment))`.
4. Em `src/store/slices/activeUnburdenSlice.ts`: o reducer `addComment` realizava `state.comments = [action.payload, ...state.comments]` incondicionalmente, sem checagem de unicidade por `id`.

### Decisão
1. **Remover a Duplicação de Disparo**: Padronizar para que o `CommentForm` ou o callback pai seja o responsável único pelo dispatch, garantindo que `dispatch(addComment(newComment))` ocorra estritamente uma única vez por evento.
2. **Idempotência no Reducer Redux**: Blindar o reducer `addComment` no `activeUnburdenSlice.ts`:
   ```typescript
   addComment: (state, action: PayloadAction<CommentType>) => {
     const exists = state.comments.some((c) => c.id === action.payload.id);
     if (exists) return;
     state.comments = [action.payload, ...state.comments];
     if (state.current) {
       state.current.comments_amount += 1;
     }
   }
   ```
3. **Proteção de Clique Múltiplo**: O botão de envio já possui desabilitação por `isLoading`, mas reforçaremos prevenindo submissões se a requisição estiver ativa.

---

## Decision 2: Acolhimento por IA Assíncrono e Não-Bloqueante

### Context
A rota `POST /api/v1/unburden` recebia `wantsAiComfort: boolean`. Se `true`, aguardava de 2 a 5 segundos a resposta da API do Google Gemini antes de retornar `201 Created` para o cliente.

### Decisão
Desacoplar a geração de acolhimento empático do ciclo síncrono da requisição HTTP:
1. `RegisterUnburdenService` cria e persiste o desabafo no PostgreSQL.
2. A resposta com `unburden` é retornada imediatamente (< 200ms).
3. Se `wantsAiComfort === true`, a execução de `AiComfortService` e posterior inserção do comentário inicial da IA são disparadas em segundo plano (background async promise sem `await` no caminho crítico da rota, com tratamento e captura de erros isolados via `.catch()` e logs de advertência).
4. Essa abordagem respeita integralmente a Constituição v1.1.0 (Princípio IV) e mantém o código simples (KISS/YAGNI), sem necessidade de serviços externos pesados de mensageria.

---

## Decision 3: Respostas a Comentários (Subcomentários / Threaded Comments)

### Context
O modelo `Comment` no Prisma já possui:
- `subcommentId String? @map("id_subcomentario") @db.Uuid`
- Relação consigo mesmo: `subcomments Comment[]` e `subcomment Comment?`
- Services existentes: `RegisterSubcommentService`, `makeRegisterSubcommentService`, `registerSubcommentBodySchema`.

### Decisão
1. **Backend Endpoint**:
   - `POST /api/v1/comment` passa a suportar criação de comentário raiz (`unburden_id` obrigatório) ou de resposta a comentário existente (`comment_id` ou `parent_id` fornecido, onde o `RegisterSubcommentService` é acionado para vincular `subcommentId`).
   - `GET /api/v1/comment?unburden_id=UUID`: `PrismaCommentRepository.findMany(unburdenId, true)` carrega os `subcomments` de cada comentário ordenados por `createdAt desc` (mais recentes primeiro).
   - `CommentResponseDto` passa a serializar o campo `subcomments?: CommentResponseDto[]`.
2. **Frontend UI**:
   - Em `CommentList.tsx` / `CommentItem`: Adicionar botão "Responder" em cada comentário.
   - Abrir formulário compacto de resposta sob o comentário selecionado.
   - Respostas renderizadas com recuo visual elegante (`pl-6 sm:pl-10 border-l-2 border-border/70`).

---

## Decision 4: Ajustes Visuais e de Inicialização

### Decisão
1. **Acolhimento por IA Desmarcado por Padrão**:
   - Em `UnburdenForm.tsx`: `const [wantsAiComfort, setWantsAiComfort] = useState(false);`.
2. **Light Mode Padrão**:
   - Em `src/app/layout.tsx`: Configurar `<ThemeProvider defaultTheme="light" enableSystem={false}>`.
3. **Ícone do Sol Monocromático**:
   - Em `src/components/ThemeToggle.tsx`: Substituir `text-amber-400` por `text-foreground` / `text-zinc-600 dark:text-zinc-300`, garantindo solidez visual sem saturação colorida, combinando perfeitamente com a lua.

---

## Decision 5: Mensagens Customizadas do Zod, Prevenção do Erro P2000 e Ordenação Mais Recente Primeiro

### Context
1. **Mensagem do Zod ocultada na UI**: O usuário digitou um comentário de apoio com menos de 25 caracteres e a UI exibiu o erro genérico "Serviço temporariamente indisponível. Tente novamente em alguns minutos.", pois a UI só tratava 401 e o backend utilizava a constante de desabafo (25 caracteres) para comentários em vez da constante de 5 caracteres.
2. **Erro P2000 no Acolhimento por IA**: O Gemini gerou uma mensagem longa que, somada ao prefixo `🤖 [Acolhimento Inicial - IA]\n`, excedeu o limite de 1500 caracteres da coluna `conteudo` no PostgreSQL (`VARCHAR(1500)`), disparando `PrismaClientKnownRequestError` com código `P2000`.
3. **Ordenação dos Comentários e Respostas**: Como no YouTube, comentários e respostas devem exibir os mais recentes no topo.

### Decisão
1. **Constantes Específicas de Comentário**:
   - `COMMENT_CONTENT_MIN_LENGTH = 5`
   - `COMMENT_CONTENT_MAX_LENGTH = 1500`
   - Atualizados `register-comment-body.schema.ts` e `register-subcomment-body.schema.ts`.
2. **Tratamento de Erros 400 no Frontend**:
   - `handleRequestError` preenche o campo `message` com o texto da primeira issue do Zod.
   - `CommentForm`, `CommentList` e `UnburdenForm` capturam `error.response?.status === 400` e exibem diretamente `issues[0].message` ou `message` via `errorAlert`.
3. **Prevenção do Erro P2000**:
   - `AiComfortService` orienta no prompt: "O texto da sua resposta NÃO DEVE ultrapassar 1200 caracteres" com `maxOutputTokens: 500`.
   - `RegisterUnburdenService` corta com segurança o texto em `1500 - prefix.length` antes de chamar `commentRepository.create`.
4. **Ordenação Cronológica Inversa**:
   - `PrismaCommentRepository.findMany`: tanto `Comment` quanto `subcomments` ordenados por `createdAt: "desc"`.
   - `activeUnburdenSlice.ts`: tanto `addComment` quanto `addSubcomment` inserem no início do array (`[item, ...items]`).
