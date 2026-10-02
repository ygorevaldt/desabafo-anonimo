# Research Findings: Feed Post Preview and Lively Skeleton Loading

## Research Topics & Decisions

### 1. Clamping e Truncamento de Texto no Feed

- **Contexto**: O feed de desabafos (`UnburdenList`) exibia o texto do desabafo na íntegra. Em desabafos de múltiplos parágrafos, o card ficava excessivamente alto, prejudicando o ritmo de leitura da página e diminuindo a taxa de cliques para a página dedicada do desabafo onde residem as mensagens de apoio e comentários.
- **Decisão**: Adotar limitação visual na camada de apresentação utilizando Tailwind CSS `line-clamp-3` ou `line-clamp-4` com controle condicional via prop `previewMode` no componente `Unburden`.
- **Justificativa**: O `line-clamp` é amplamente suportado por todos os navegadores modernos, tem performance nativa em CSS sem recortes truncados que quebrem palavras pela metade e mantém o conteúdo acessível para leitores de tela caso necessário, enquanto mantém o card compacto e visualmente harmonioso.
- **Alternativas Consideradas**:
  - *Truncamento de string no JS (ex.: `content.slice(0, 200)`)*: Descartado porque pode cortar palavras ao meio ou criar problemas com quebras de linha e caracteres especiais.
  - *Altura fixa em pixels com `overflow: hidden`*: Descartado por ser menos responsivo e poder cortar a última linha de texto no meio da fonte.

---

### 2. Tratamento de Desabafos com Conteúdo Sensível no Feed

- **Contexto**: Desabafos marcados com `sensitive_content: true` exibiam um bloco inteiro de texto borrado (`blur-md`). Para desabafos longos, isso gerava um enorme bloco cinza borrado no feed, causando poluição visual (conforme print enviado pelo usuário).
- **Decisão**: No modo de prévia (`previewMode = true`), o componente `Unburden` exibirá o banner de aviso sensível e um contêiner compacto de proteção (altura contida e padronizada), com indicação direta de que o desabafo contém tema delicado e incentivo para abrir o post para ler na íntegra. O botão de alternância completa do desfoque (`Visualizar conteúdo sensível`) continua atuando nativamente na página de detalhes (`/unburden/[id]`).
- **Justificativa**: Mantém a proteção ética e de acolhimento do usuário sem permitir que o blur desestruture a altura dos cards na listagem principal.
- **Alternativas Consideradas**:
  - *Permitir abrir o blur gigante diretamente no feed*: Descartado porque a intenção do usuário e do design é convidar a pessoa a entrar na página do desabafo para interagir.

---

### 3. Aprimoramento do Skeleton Loader para Feedback Visual "Vivo"

- **Contexto**: O componente `Skeleton` utilizava `bg-muted/70` (`#f4f2ee` com 70% de opacidade). Sobre o fundo do card branco (`#ffffff`), o contraste era quase nulo, fazendo com que o carregamento se parecesse com caixas brancas estáticas.
- **Decisão**: Atualizar as classes do `Skeleton` para utilizar cores com contraste perceptível em temas claro e escuro (`bg-zinc-200/80 dark:bg-zinc-800/80` ou `bg-muted-foreground/15 dark:bg-muted-foreground/20` com `animate-pulse`) e estruturar o esqueleto no `UnburdenList` para refletir fielmente a nova anatomia do card compacto:
  - Header: Título (`h-5 w-2/5 rounded-xl`) e Timestamp (`h-4 w-16 rounded-lg`).
  - Body: 3 linhas de prévia com larguras decrescentes (`w-full`, `w-11/12`, `w-4/5`) e altura proporcional.
  - Footer: Indicadores de denúncia e apoios (`h-4 w-20` e `h-8 w-24 rounded-full`).
- **Justificativa**: Oferece feedback visual imediato e agradável, comunicando atividade de rede de forma clara e moderna.
- **Alternativas Consideradas**:
  - *Spinner centralizado*: Descartado porque esqueleto estrutural reduz a percepção de tempo de espera e evita layout shift quando os dados chegam.

---

### 4. Navegação e Interação nos Cards

- **Contexto**: Ao clicar em qualquer área do card ou no título, o usuário deve navegar para a página de detalhes (`/unburden/[id]`), sem que os botões de ação (Apoiar, Denunciar) causem navegação indesejada.
- **Decisão**: Utilizar o link no título com pseudo-elemento de estiramento acessível (`<span className="absolute inset-0" aria-hidden="true" />`) e garantir que os botões de ação e links externos tenham `relative z-10` e tratamentos com `e.stopPropagation()`.
- **Justificativa**: Padrão acessível e consolidado no design moderno de feeds web.
