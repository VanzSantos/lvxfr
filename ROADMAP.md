# Roadmap

Status do projeto — o que foi construído, o que vem a seguir e dívidas técnicas conhecidas.
Separado do `SKILL.md` (que só tem regra de geração, estável) porque isto muda a cada
componente que termina; ver `SKILL.md` pras regras de como gerar/auditar cada um.

Ordem de prioridade combinada com o usuário, pensada em cima do que é mais comum em
design systems reais e do que já estava bloqueando alguma coisa concreta no projeto
(não é uma lista arbitrária — cada item tem uma razão registrada quando foi decidido).

## Feito

Icon, HelperText, Tooltip, FieldLabel, Spinner, Card, Radio, Checkbox, Button, TextField,
Textarea, Alert, Select, ComboBox, Link, Switch, Divider, Badge, Avatar, Toast/Snackbar
(sistema completo: Toast + ToastProvider + useToast()), Chip/Tag, Tabs (+ TabPanel),
Breadcrumb, Progress Bar, Skeleton, Empty State, RadioGroup. Typeahead do Select
corrigido (normalização de acento via findMatch customizado, normalizeForSearch
extraído pra shared/ e reaproveitado por Select + ComboBox). Card com elevação
(prop `elevation`: none/low/medium/high) — tokens de sombra (sombra-pp/p/m) criados
em tokens.css seguindo a convenção xp/pp/p/m/g/gg já usada em raio-*/espaco-*, ainda
não existem como coleção formal no Figma (dívida a reconciliar, ver
card.contract.json). Modal/Dialog (organismo) — <dialog> nativo (showModal), focus
trap e Esc nativos, dismissible controla as 3 vias de fechamento implícito juntas.
Drawer (organismo) — reaproveita a base do Modal; modal=true bloqueia (showModal),
modal=false fica persistente ao lado do conteúdo (show(), sem backdrop/focus trap,
Esc reimplementado via listener próprio); desliza só da borda direita; animação
nativa via @starting-style + allow-discrete.
Checkbox ganhou a prop `hideLabel` (rótulo continua no DOM como nome acessível, só fica
visualmente oculto via técnica sr-only) — resolve a necessidade de checkboxes sem texto
visível (ex.: colunas de seleção de tabela) sem quebrar a regra "todo controle interativo
é um componente do harness". StackedText (átomo novo) — duas linhas de texto na mesma
célula/área (principal em cima, secundário embaixo, ex.: nome + e-mail).
Datatable (organismo) — um componente só, recursos opt-in por prop/coluna: ordenação
(ciclo de 3 estados, só pelo ícone de seta — separado do nome da coluna), filtro por
coluna (substring normalizado por acento via shared/normalizeForSearch, OCULTO por
padrão, abre pelo nome da coluna ou por um ícone de funil dedicado, os dois fecham no
Esc sem perder o valor digitado), seleção de linha (átomo Checkbox com hideLabel),
paginação com seletor de itens por página, edição de linha inline (colunas
`editable`/`editControl` viram input de texto ou átomo Select durante a edição de uma
linha; estado de "linha em edição" é interno ao Datatable — decisão pedida ao usuário —
salvar sempre abre um Modal de confirmação interno, cancelar reverte na hora sem modal),
habilitar/desabilitar registro (`disabledRowKeys` controlado + Modal de confirmação
interno antes de aplicar, linha fica visualmente esmaecida), estados vazio/carregando
(Skeleton). column.render agora recebe um 3º argumento (`DatatableRowHelpers`:
isEditing/isDisabled/startEdit/cancelEdit/requestSave/requestToggleDisabled) — evita
introduzir um conceito de "coluna de ações" especial; qualquer coluna pode disparar
essas ações. Botões de ação sem contorno reaproveitam `Button` `variant="link"`
(nenhuma mudança no contrato do Button). sortMode/filterMode/paginationMode cada um
'client' | 'server'. Seleção de itens por página e input de filtro continuam nativos
(`<select>`/`<input>` simples) por peso visual — só o edit control tipo 'select' usa o
átomo Select (que já suporta uso sem label). Dois bugs reais encontrados testando no
navegador: (1) ícones de `Button` `iconOnly` com `outlined=true` (usados na paginação)
ficavam invisíveis — a cor do ícone vinha de uma fórmula fixa que ignorava o estado
outlined; corrigido pra usar a CSS custom property `--btn-text`, já resolvida certa pros
dois estados, e o helper morto (`VARIANT_SUFFIX`) foi removido; (2) o Select de edição
de uma coluna com `accessor` formatando o valor pra exibição (ex.: "Pago") abria vazio,
porque o draft de edição é seedado a partir de accessor/row[key] e "Pago" não batia com
nenhuma `editControl.options[].value` ("pago") — regra fixada: em colunas editáveis,
accessor sempre retorna o valor bruto, formatação de exibição é responsabilidade de
render. Testado no navegador: sort isolado do nome, toggle de filtro pelo nome e pelo
funil (Esc fecha sem perder valor), seleção com persistência entre páginas/filtros e
indeterminate no "selecionar todos" (via átomo Checkbox), edição de linha completa
(texto + select, salvar com modal, cancelar sem modal reverte), habilitar/desabilitar
com modal e linha esmaecida, loading, vazio, paginação e troca de itens por página.

Datatable v3 — segunda rodada de ajustes pedidos pelo usuário, depois de usar a v2 de
verdade. REVISADO — o ícone de funil dedicado (citado acima, v2) foi REMOVIDO: agora só
o nome da coluna abre/fecha o filtro, com uma lupa decorativa (espaço sempre reservado,
só fica visível no hover/focus) — ver decisions do contrato. Também adicionado: toolbar
principal (título + `toolbarActions` livre + botão de densidade + botão de colunas
visíveis + botão de exportação, só renderizada quando algum desses existe); toggle de
densidade pelo usuário (`allowDensityToggle`, estado interno); ocultar/exibir colunas
(`columnVisibilityEnabled`, popover com Checkbox por coluna via @floating-ui, indicador
Badge "N ocultas" sempre visível quando há alguma); coluna fixa durante scroll horizontal
(`column.sticky='right'`, pensada pra coluna de Ações em tabelas largas); exportação
(`onExport(formato, rows)` — só UI + callback, decisão explícita do usuário de não trazer
lib de PDF/planilha pro harness; CSV também passa pelo callback, sem atalho mágico).
Ícone de ordenação sempre pinado na borda direita da célula de cabeçalho, nunca encosta
no título. Botões de paginação trocados pra `variant="link"` (sem contorno).
`pageSizeOptions` padronizado pra 5/10/25/50/100. Switch ganhou `size="small"` (contexto
denso de coluna de ações, alvo de toque 44px preservado via padding, só o desenho visual
encolhe). Dois átomos novos: Stepper (quantidade com +/-, sem digitação livre) e
ImageThumbnail (miniatura clicável opcional que abre no Modal) — os dois nasceram como
"tipos de célula" pedidos pelo usuário, mas ganharam contrato próprio em vez de um
sistema de `column.type` embutido (decisão perguntada ao usuário). Três bugs reais
encontrados/reportados e corrigidos: (1) célula de cabeçalho de seleção não tinha a
classe de padding das outras células de cabeçalho — Checkbox "selecionar todos" ficava
colado na margem esquerda; (2) abrir o filtro de uma coluna mudava a altura de toda a
linha de cabeçalho porque o `<input>` e o botão-título tinham caixas (padding/borda)
diferentes — corrigido com uma classe compartilhada (`headerControl`) idêntica nos dois;
(3) vertical-align da célula de cabeçalho estava `top`, dando a impressão de rótulo/ícone
"subindo" — trocado pra `middle` (célula do corpo também, todo conteúdo de célula agora
centralizado verticalmente). Testado no navegador: toolbar completa, toggle de densidade
em tempo real, ocultar/exibir colunas com indicador, filtro só pelo título sem funil e
sem pulo de altura, Esc fechando sem perder o valor, checkbox de cabeçalho alinhado,
Stepper incrementando dado real, mover linha pra cima/baixo, popover de exportação
disparando `onExport` com o formato e TODAS as linhas filtradas/ordenadas (não só a
página atual), coluna de Ações fixa durante scroll horizontal com fundo opaco sincronizado
por estado de linha (normal/hover/selecionada).

Datatable v4 — terceira rodada de ajustes. Bug real corrigido: coluna de ações podia
ficar mais estreita que os ícones lado a lado e empilhá-los em duas linhas — causa raiz
era uma classe utilitária do Playground (Demo.module.css `.row`) com `flex-wrap: wrap`
sem override; corrigido no exemplo e reforçado com `.td { white-space: nowrap }` no
próprio Datatable (nenhuma célula quebra conteúdo em várias linhas, a coluna sempre
cresce pra caber). Bug real corrigido: imagem ampliada do ImageThumbnail não ficava
centralizada no Modal — `margin: 0 auto` resolveu. REVISADO — densidade ganhou um 3º
nível a pedido do usuário (perguntado antes, confirmado): `comfortable` (só via prop,
inalterada), `compact` (encolhida de espaco-pp/8px pra espaco-xp/4px, virou o DEFAULT) e
`condensed` (novo, 2px fixo — não é token, mesma exceção já documentada em border-width
de Checkbox/Radio/Switch). O botão de densidade da toolbar alterna só compact ↔
condensed (comfortable fica fora do ciclo). Ícone do botão de densidade muda com o
estado: `equals` (2 retângulos, Phosphor) = lado maior do ciclo, `rows` (3 retângulos) =
lado menor — reflete o estado atual, mesma convenção de ícone de tema claro/escuro.
Popover de exportação encolhido (sem min-width de 200px) e labels trocados pra
"Exportar CSV"/"Exportar PDF"/"Exportar XLSX". Novo prop `bulkActions?: (selectedRowKeys)
=> ReactNode` — slot livre (mesmo espírito de toolbarActions/column.render, sem conceito
embutido de 'excluir em lote') que substitui o título na toolbar quando selectable=true
e 2+ linhas estão selecionadas; Datatable só decide QUANDO mostrar o slot, o consumidor
monta os ícones e a lógica (exemplo no Playground: excluir/desativar em lote, com Modal
de confirmação antes de aplicar, reaproveitando o mesmo padrão de confirmação já usado
na edição/habilitar-desabilitar por linha).

Datatable v5 — dois ajustes finos de densidade, pedidos depois de usar a v4 de verdade.
Bug real: ícones do toggle de densidade (`equals`/`rows`) não formavam um par visual
coerente — trocado `rows` por `list` (hambúrguer clássico, 3 traços), mesma família
visual do `equals` (2 traços), deixando explícito que um mostra menos linhas por vez e o
outro mostra mais. Bug real: diferença de padding vertical entre compact e condensed
(4px vs 2px) era pequena demais pra perceber, principalmente em linhas com controles
altos (Switch/Stepper) que dominam a altura da linha independente do padding — condensed
foi pra 1px (exceção documentada, mesma classe de exceção do border-width de
Checkbox/Radio/Switch). Bug real: padding horizontal também encolhia com a densidade,
colando o conteúdo na borda da tabela em compact/condensed — corrigido pra ficar FIXO
(espaco-pp/8px) nas 3 densidades, maior que o espaco-xp/4px que o compact usava antes;
só o padding vertical muda entre comfortable/compact/condensed agora.

Datatable v6 — dois bugs reais reportados depois da v5. (1) Mapeamento ícone↔estado do
toggle de densidade estava invertido: corrigido pra `equals` (2 traços) aparecer em
condensed (mais registros cabem na tela) e `list` (3 traços) aparecer em compact/padrão
(menos registros por vez). (2) Padding vertical de condensed (1px) ainda parecia grande
demais — trocado pra 0 (sem exceção de token, é ausência de padding mesmo), a versão mais
estreita possível agora tem padding top/bottom praticamente inexistente, priorizando
caber o máximo de registros na tela.

Bug real corrigido em Switch (não específico de Datatable, mas só ficou visível medindo a
altura de linha da tabela): o exemplo 'Completo' não encolhia em densidade condensed
enquanto o exemplo 'Simples' encolhia normalmente. Causa raiz: `.row` do Switch tinha
`min-height: 44px` em content-box (padrão do CSS), e `.bare` somava seu padding vertical
POR CIMA desse valor em vez de contar dentro dele — um Switch sem label (usado na coluna
de ações) renderizava 60px de altura real em vez dos 44px pretendidos pelo próprio
comentário original do código. Corrigido com `box-sizing: border-box` em `.row` —
altura da linha do exemplo 'Completo' caiu de 61px pra 45px em condensed (medido no
navegador), ficando comparável ao 'Simples'. Acontecia com qualquer Switch sem label
(medium ou small), não era específico do size='small' recém-adicionado.

Ajustes na casca do DS Playground (src/interface/ — não é um componente do harness, não
tem contrato próprio). Bug real corrigido: a sidebar rolava junto com a página inteira em
vez de ter rolagem interna própria — `.shell` (App.module.css) usava `min-height: 100vh`,
que deixa o container crescer além do viewport quando o conteúdo é alto, fazendo o body
inteiro rolar; trocado pra `height: 100vh` + `overflow: hidden`, forçando `.sidebar` e
`.main` (que já tinham `overflow-y: auto` cada um) a serem os únicos a rolar de verdade.
Item ativo da navegação (Sidebar.module.css `.itemActive`) mudou de fundo
`fundo-superficie` + texto `acao-primaria` (verde, bold) pra fundo `fundo-invertido`
(cinza quase preto) + texto `texto-invertido` (branco) — pedido explícito do usuário,
tokens já existentes no harness, nenhum valor novo.

Ajustes gerais em 5 componentes, pedidos numa rodada só depois de usar o harness de
verdade. Tabs — `items[].count` (indicador numérico ao lado da label, ex.: 'Abertos 12'),
reaproveita o átomo Badge (variant='neutral'), aria-label combinando label+count quando
presente. Breadcrumb — `firstItemIcon` (nome de ícone livre antes do label do primeiro
item, sem valor fixo tipo 'casinha') e colapso de trilhas longas: com
`items.length > collapseThreshold` (default 3, colapsa a partir de 4 níveis), mostra
primeiro item + reticências clicáveis (abre popover via @floating-ui com os itens do
meio, mesmo padrão de Select/Datatable) + últimos 2 itens (pai imediato + atual).
Ícone novo no registro: 'dots-three' (reticências) e 'house' (usado no demo do
firstItemIcon). Alert — contorno de info/success/warning/error trocado da cor "crua"
pra `color-mix(in srgb, var(--borda-X) 35%, var(--fundo-X))`, bem mais sutil, sem token
novo; novo intent 'neutral' (fundo-secundario + texto-primario + ícone 'info' em
icone-secundario, sem carga de status). Drawer — nova prop `layout`: 'overlay' (default,
comportamento inalterado) | 'push'. PERGUNTADO ao usuário se a correção deveria valer
sempre que modal=false (já que o oneLiner do contrato prometia "ao lado do conteúdo" mas
a implementação sempre usava position:fixed, nunca cumprindo isso) ou virar uma prop nova
opt-in — escolheu a prop nova pra não mudar quem já usa modal=false hoje. layout='push'
só tem efeito com modal=false (com modal=true força overlay); tira o `<dialog>` de
position:fixed pra position:relative, participando do flex da página onde o consumidor
posicionar — Drawer não sabe nada sobre o resto do layout, mesmo racional de TabPanel.
Reflow do conteúdo vizinho é instantâneo (flexbox), só o slide do próprio painel continua
animado via transform. Datatable — removida a borda entre o corpo da tabela e o rodapé de
paginação (redundante com a borda do wrapper externo). Testado no navegador: contador nas
abas, ícone+colapso+popover do Breadcrumb (Esc devolve foco pro botão de reticências),
cores suavizadas e intent neutral do Alert, Drawer push confirmado via
getComputedStyle (position:relative, largura 320px, conteúdo vizinho reflui sem overlap),
borda do rodapé do Datatable removida (border-top-width: 0px medido).

Três bugs reais reportados depois de usar o harness de verdade, todos corrigidos e
revalidados no navegador. (1) Breadcrumb — texto do popover de reticências não herdava a
fonte do harness. Causa: o popover é renderizado via FloatingPortal (escapa da árvore do
<nav>), e Link não tem tipografia própria (herda do contexto, por design — ver
link.contract.json); fora do portal, não havia mais contexto do harness pra herdar.
Corrigido declarando type-style.texto-p explicitamente em .menu. (2) Drawer — o exemplo de
layout="push" no Playground não demonstrava o efeito de forma convincente. Causa: TODO o
DrawerDemo estava dentro de um container com maxWidth:480, deixando pouquíssimo espaço
sobrando pro conteúdo principal quando o painel de 320px abria ao lado. Corrigido soltando
o maxWidth do demo inteiro e ampliando a caixa de exemplo (320px de altura, largura
100%, conteúdo mais realista) — confirmado no navegador que o texto principal reflui
corretamente e continua legível/clicável. (3) Datatable — ação em lote só desabilitava,
nunca habilitava. Não era um bug do componente (bulkActions é um slot livre, funcionou
exatamente como projetado) — era um gap no exemplo do Playground, que só tinha o botão
"Desativar selecionados" sem nenhum "Ativar selecionados". Adicionado o segundo botão +
Modal de confirmação própria; confirmado no navegador via DOM (checked/aria-label do
Switch) que habilitar e desabilitar em lote funcionam nos dois sentidos agora.

RENOMEADO — o átomo "Stepper" (quantidade com +/-, célula de tabela) virou
**QuantitySelector** (contratos/quantity-selector.contract.json), pra liberar o nome
"Stepper" pro componente de verdade 'passo a passo' que entrou na fila (ver Próximo).
Arquivo, componente (QuantitySelectorProps/QuantitySelectorState), contrato, registry.ts
e todo uso (Datatable, Playground) atualizados juntos. Nenhuma mudança de comportamento,
só de nome.

NavBar (organismo, novo). Barra de navegação horizontal — `brand?` (slot livre, ex.: logo),
`items: {label, href, active?}[]` (cada item vira o átomo Link, reaproveitando sua prop
`current` — ver próximo parágrafo), `actions?` (slot livre à direita, ex.: botões de
conta/notificação), `accessibleLabel` (default "Navegação principal"), `sticky?` (fixa no
topo ao rolar, `position: sticky`). Roteamento-agnóstico por design (mesmo racional do
Link/Breadcrumb): NavBar nunca importa um router, `href` é só uma string e `active` é
decidido por fora. Diferente do Breadcrumb (onde o item ativo widget é texto puro, não
clicável), o item ativo do NavBar continua um link real clicável — navegação principal
precisa permitir clicar no item atual pra, por exemplo, resetar filtros/scroll da própria
página. Sem colapso responsivo nesta v1 (menu hambúrguer pra mobile) — gap documentado no
contrato, não construído especulativamente sem um caso de uso real. Testado no navegador:
brand+items+actions completo com simulação de troca de rota (`active` mudando por clique),
versão mínima só com items, e sticky dentro de uma caixa com scroll (confirmado via
getComputedStyle que `position: sticky` e `top: 0` são aplicados e o nav permanece visível
durante o scroll do conteúdo).

Link ganhou a prop `current?: boolean` (default false) pra suportar o NavBar acima —
quando true, aplica `aria-current="page"` e um estilo visual distinto (cor
`acao-link-texto-sobreposto` já existente, reaproveitada, + negrito), mesmo padrão
`aria-current="page"` já usado no último item do Breadcrumb, mas aqui o elemento continua
um `<a>` real clicável (Breadcrumb usa texto puro pro item atual porque ali navegar pra
"onde eu já estou" não faz sentido; no NavBar faz, ver parágrafo acima).

Stepper (átomo novo, indicador de etapas — não confundir com o extinto "Stepper" de
quantidade, ver RENOMEADO acima). `items: {label, description?, icon?}[]`,
`currentStep` (controlado, obrigatório), `accessibleLabel` (obrigatório), `onStepClick?`.
Três estados por etapa (pending/current/completed) derivados só da comparação de índice
com `currentStep`. Ícone por etapa é escolha individual (`items[].icon`) — etapas sem
ícone customizado mostram o número da posição (pending/current) ou uma marca de concluído
automática (completed, evita forçar `icon: "check"` manualmente em toda etapa). Só
etapas completed/current viram `<button>` clicável quando `onStepClick` é fornecido —
pending nunca é clicável, mesmo com a prop presente (não dá pra pular etapa ainda não
alcançada). `aria-current="step"` na etapa atual (diferente do `aria-current="page"` do
Breadcrumb/NavBar/Link — token correto da spec ARIA pra indicadores de progresso
sequencial). Só horizontal nesta v1. Bug real encontrado testando no navegador: quando uma
etapa `current` tinha `icon` customizado, o ícone ficava invisível — a cor sempre usava
`acao-primaria-texto` (pensada pro marcador `completed`, que tem fundo preenchido com
`acao-primaria`), mas o marcador `current` não tem fundo preenchido (só borda), resultando
em ícone claro sobre fundo claro. Corrigido pra cor do ícone acompanhar o estado do
marcador (completed usa `acao-primaria-texto`, current usa `acao-primaria`, pending usa
`icone-secundario`). Testado no navegador: avançar/retroceder etapa via botões externos
atualiza `currentStep` e o `aria-current="step"` migra corretamente pro item certo, etapa
`pending` confirmada não-clicável (renderiza `<div>`, não `<button>`) mesmo com
`onStepClick` fornecido.

Accordion (molécula, novo — cobre também o caso "Collapsible" de item único, mesmo
componente). `items: {key, label, content, disabled?}[]`, `openKeys` (array controlado),
`onChange`, `mode?: 'single'|'multiple'` (default multiple). Um único componente resolve
tanto "item único" (array de 1) quanto "vários agrupados" — não existe um átomo
Collapsible separado, porque o comportamento real (cabeçalho clicável, aria-expanded,
altura que expande/colapsa) é idêntico nos dois casos. mode='single' faz o próprio
Accordion calcular o próximo `openKeys` fechando os demais antes de chamar `onChange` — o
consumidor nunca implementa essa lógica por fora, mesmo padrão de outros componentes
controlados do harness (Tabs value/onChange). Painel de conteúdo sempre montado no DOM
(altura colapsada via CSS `grid-template-rows: 0fr → 1fr`, nunca `display:none`) — mesmo
racional do TabPanel de Tabs, preserva estado interno do conteúdo entre toggles. Ícone
`caret-down` (já existente no registro) gira 180° via CSS, sem precisar de um
`caret-up` separado. Sem navegação por seta entre cabeçalhos (diferente de Tabs) —
Accordion não é uma seleção mutuamente exclusiva tipo tablist, cada cabeçalho é um botão
independente na ordem normal de Tab. Testado no navegador: mode='single' fechando o item
anterior ao abrir outro (confirmado via aria-expanded), item com `disabled=true` não abre
mesmo clicado diretamente (button nativo disabled), item único (array de 1) abre/fecha
normalmente como um Collapsible avulso.

Calendar (molécula, novo). `value` (data ISO 'AAAA-MM-DD' ou null, controlado),
`onChange`, `minDate?`/`maxDate?`, `disabledDate?` (função pra bloquear datas específicas,
ex.: feriados), `accessibleLabel?`. Navegação "simples" (setas mês anterior/próximo,
sempre visíveis) e "complexa" (pular direto pra outro mês/ano) resolvidas como UMA
interação, não duas variantes: clicar no rótulo 'Mês de Ano' do cabeçalho abre um seletor
rápido (grade de 12 meses do ano exibido + setas de ano). Grade de dias sempre 6 linhas ×
7 colunas fixas (42 células), mesmo em meses que cabem em 5 — evita a altura mudar ao
trocar de mês (importante pra quando DatePicker abrir isso num popover). Dias de mês
adjacente aparecem esmaecidos e nunca são clicáveis nesta v1. Mês/ano exibido e o modo do
seletor (dias vs. meses) são estado interno transiente, não espelham automaticamente
mudanças externas de value — mesma classe de decisão já usada em editingRowKey do
Datatable. aria-current="date" no dia de hoje (mesma disciplina de token ARIA específico
por contexto já usada em Stepper/NavBar/Breadcrumb/Link). Testado no navegador: seletor
rápido de mês trocando pra Novembro corretamente, seleção de dia atualizando o value
controlado, dia bloqueado por disabledDate confirmado com disabled=true via DOM (clique
não seleciona), aria-current="date" encontrado no dia 18/08/2026 (hoje).

DatePicker (molécula, novo). Campo de texto (gatilho estilo Select) que abre o Calendar
num popover ancorado via @floating-ui — mesma técnica já usada em Select/Tooltip/
Breadcrumb. `value`/`onChange` mudam de formato conforme `range` (discriminated union,
mesmo padrão de Select `multiple`): `range=false` (padrão) usa uma data ISO ou null;
`range=true` usa `{ start, end }` e renderiza DOIS campos independentes (Início/Fim), cada
um com seu próprio Calendar — não uma única grade com intervalo destacado (Calendar ainda
não suporta isso, ver decisions do próprio calendar.contract.json). A restrição "fim nunca
antes de início" é aplicada de fora: o campo Fim recebe `minDate = value.start` quando
início já está preenchido. Exibição sempre formatada DD/MM/AAAA (interno continua ISO).
Sem digitação livre nesta v1 — o gatilho é um botão, não um input de texto, evitando parse
ambíguo de data digitada. Testado no navegador: campo único abrindo popover, dias fora de
maxDate desabilitados (cor/disabled confirmados via getComputedStyle e DOM), seleção
fechando o popover e formatando a data certa, modo range com o campo Fim aplicando
minDate = data de início selecionada (dia antes do início confirmado disabled=true, dia
igual ao início confirmado clicável), estado de erro com borda vermelha.

TimePicker (molécula, novo). Mesmo padrão estrutural do DatePicker (gatilho estilo
Select + popover @floating-ui, discriminated union `range`/`value`/`onChange`), mas o
popover mostra duas colunas roláveis (Hora 00–23 / Minuto 00–59 por `step`, default 5) em
vez de um Calendar — cobre qualquer combinação sem gerar lista de horários pré-montados.
Diferente do DatePicker, o popover NÃO fecha ao escolher só a hora ou só o minuto (são
duas escolhas separadas); fecha por dismiss (clique fora/Esc). `minTime`/`maxTime`
('HH:MM') desabilitam hora e minuto em conjunto — uma hora só fica desabilitada se
NENHUM minuto dela cair no intervalo (bug evitado: testar só contra o minuto 0
desabilitaria horas válidas inteiras quando minTime cai no meio da hora, ex.: minTime
'08:30' não pode desabilitar a hora 8 inteira). Modo range replica exatamente a decisão
já validada no DatePicker: dois campos independentes (Início/Fim), Fim aplica
minTime = value.start. Testado no navegador: hora fora de minTime/maxTime (08:00–18:00)
corretamente desabilitada via DOM (00–07 e 19–23 disabled=true, 08–18 disabled=false),
seleção de hora+minuto atualizando o gatilho para "08:30", modo range com o campo Fim
aplicando minTime = 10:00 depois de selecionar a hora 10 no campo Início (00–09
desabilitadas no Fim, 10+ habilitadas).

DateTimePicker (molécula, novo). Reaproveita Calendar diretamente (import) + reimplementa
inline o mesmo padrão de colunas Hora/Minuto do TimePicker, mas os dois dentro de UM SÓ
popover ancorado a UM SÓ gatilho — diferente de simplesmente usar DatePicker + TimePicker
lado a lado (que já era possível sem este componente). Existe especificamente pro caso
onde data+horário são conceitualmente um valor só (ex.: "início do evento"), não dois
campos separados. value é ISO 'AAAA-MM-DDTHH:MM' (ou null); exibição formatada
'DD/MM/AAAA HH:MM'. Escolher a data sem hora ainda escolhida assume 00:00; escolher
hora/minuto sem data ainda escolhida assume a data de hoje — evita um terceiro estado
"meio selecionado" que não é nem null nem um valor completo. Colunas de Hora/Minuto
reimplementadas inline (não extraídas como sub-componente compartilhado com TimePicker)
porque não há um segundo consumidor real ainda que justifique a extração — mesma
disciplina de não fazer dedup prematuro já usada no resto do harness. Modo range replica
exatamente a decisão já validada em DatePicker/TimePicker (dois campos/popovers
independentes, Fim aplica minDateTime = value.start). Testado no navegador: popover
combinado abrindo com Calendar e colunas Hora/Minuto lado a lado no mesmo painel,
selecionar dia 20 + hora 14 + minuto 30 resultando no gatilho mostrando
"20/08/2026 14:30" (data e hora combinadas corretamente no mesmo valor).

Otp (átomo, novo). `length` (default 6) caixas de 1 dígito cada, `value`/`onChange`
controlados (string só com dígitos já preenchidos), `onComplete?` disparado uma vez ao
atingir length dígitos. Digitar avança o foco pra próxima caixa sozinho; Backspace numa
caixa vazia apaga a anterior e volta o foco pra ela; colar (paste) uma string preenche
todas as caixas de uma vez, filtrando caracteres não-numéricos — cobre o caso real de
colar uma mensagem de SMS inteira ("Seu código é: 123456"), não só o código isolado.
Testado no navegador: digitação sequencial preenchendo as 6 caixas e disparando
onComplete corretamente; colar "987654" via ClipboardEvent simulado preencheu as 6 caixas
de uma vez e moveu o foco pra última. NOTA DE FERRAMENTA (não é bug do componente) —
o Backspace disparado pela ferramenta de automação do navegador chega com
`event.key === ""` em vez de `"Backspace"` (confirmado com um listener de depuração
direto no elemento), então nem o comportamento nativo do input nem a lógica JS do
componente (que compara `event.key === "Backspace"`) disparam nesse ambiente
especificamente — é uma limitação de como a ferramenta sintetiza esse evento, não um
defeito do Otp; a lógica de Backspace segue o padrão universal desse tipo de campo e não
depende de nenhuma API fora do KeyboardEvent nativo.

Rating (átomo, novo). Ícones novos no registro do Icon: `star`/`star-half` (Phosphor).
`value`/`onChange` controlados, `max` (default 5), `allowHalf?` (meio-ponto por metade
clicada de cada estrela — esquerda=X.5, direita=X inteiro), `state`:
'default'|'readOnly'|'disabled'. Modo interativo usa `role="slider"`
(aria-valuenow/min/max/valuetext, seta esquerda/direita ou cima/baixo
incrementa/decrementa em 1 ou 0.5, Home/End vão pro mínimo/máximo) — mais adequado que
radiogroup porque com allowHalf os valores possíveis formam uma escala quase contínua.
Modo `readOnly` vira `role="img"` com aria-label formatado (ex.: 'Avaliação: 4.5 de 5'),
sem nenhuma interação nem foco — resolve o caso de exibir só uma nota já existente (ex.:
nota média de um produto) sem herdar semântica de controle. `onChange` é proibido junto de
`state='readOnly'` pelo contrato. Testado no navegador: todos os 5 exemplos renderizando
visualmente corretos (inteiro, meio-ponto, readOnly, disabled, escala de 1-10); clique na
metade direita de uma estrela reduzindo 3.5→3 confirmado via evento sintético correto;
navegação por seta (ArrowRight) confirmada incrementando o valor corretamente — os
primeiros checks via ferramenta de automação pareciam não surtir efeito, mas era leitura
do DOM feita rápido demais (antes do React re-renderizar), não um bug real; reconfirmado
com um pequeno atraso entre a interação e a leitura.

FileUpload (molécula, novo). Ícone novo no registro do Icon: `upload-simple` (Phosphor
UploadSimple). Um componente só, 3 variantes visuais (`variant`: 'field'/'button'/
'dropzone') sobre o mesmo comportamento — `<input type="file">` nativo sempre presente e
oculto, é ele quem realmente abre o seletor do sistema. Lista de arquivos selecionados
reaproveita o átomo Chip (`removable`) nas 3 variantes, em vez de reinventar uma lista
removível. `value`/`onChange` controlados (File[]); `onReject` separado entrega arquivos
que falharam em `accept`/`maxSizeMB` (nunca entram em value) com o motivo
('type'/'size'). accept é revalidado manualmente no drop — o atributo HTML accept só
filtra o picker nativo de clique, não arquivos arrastados. Sem upload de verdade nem
preview de imagem nesta v1 — componente só entrega File[] validado, mesmo racional do
onExport do Datatable (entrega pronta, a operação de rede fica de fora). Testado no
navegador: seleção via DataTransfer simulado gerando Chip "comprovante.pdf"; arquivo de
tipo inválido ("virus.exe") corretamente rejeitado (nunca apareceu na lista, mensagem
"Rejeitados: virus.exe (type)" via onReject); drag-and-drop de "planilha.csv" na dropzone
adicionando o Chip; remoção via botão X do Chip voltando o campo pro placeholder "Nenhum
arquivo selecionado".

Pagination (molécula, novo). Extraído por REPLICAÇÃO deliberada do padrão visual que já
existia embutido na Datatable (paginationEnabled) — NÃO é uma refatoração da Datatable
pra consumir este componente (a paginação dela já está construída/testada, reescrevê-la
seria dedup especulativo sem necessidade real puxando essa mudança agora). `page`/
`onPageChange`/`totalItems`/`pageSize` controlados; `totalPages` calculado internamente
(`Math.ceil(totalItems/pageSize)`), evitando o consumidor divergir do resumo textual.
Seletor de itens por página é opt-in via presença de `onPageSizeChange` — sem essa prop,
o controle nem renderiza (mesmo padrão de bulkActions/toolbarActions da Datatable: a
prop decide SE aparece, não um boolean redundante). `aria-live="polite"` no resumo
textual, anuncia a mudança de página pro leitor de tela sem mover o foco. Testado no
navegador: clique em "Próxima página" avançando de "1–10 de 237" pra "11–20 de 237";
troca de itens por página (10→25) resetando pra página 1 e recalculando o total de
páginas (24→10); variante sem seletor e variante vazia (0 registros) renderizando
corretamente.

Slider (molécula, novo). Baseado em `<input type="range">` NATIVO — um no modo único,
dois empilhados (mesma técnica consolidada de mercado pra dual-range slider) no modo
`range`, em vez de reimplementar um thumb arrastável do zero: preserva de graça toda a
acessibilidade de teclado (setas, Home/End, Page Up/Down) e leitor de tela que o navegador
já resolve. Trilha/preenchimento são `<div>`s posicionados por cima via porcentagem
calculada, com os inputs nativos transparentes recebendo só os eventos de clique/arraste
(pointer-events restrito ao thumb via CSS). Modo `range` clampa um cabo no valor do outro
em vez de deixar cruzar (`onChange` nunca entrega uma tupla fora de ordem). Sem
`state='error'` — a interação nunca produz um valor fora de [min,max] por construção.
BUG REAL encontrado e corrigido testando no navegador: o `<input>` inteiro (que cobre toda
a largura da trilha, transparente, por baixo dos `<div>`s visuais) ficava com o anel de
foco padrão do WebKit (laranja) aplicado à SUA PRÓPRIA caixa ao ser focado — como o input
ocupa 100% da largura, isso desenhava uma barra laranja cobrindo a trilha inteira, não só
um contorno ao redor do thumb (que já tinha seu próprio `:focus-visible` customizado,
correto, no pseudo-elemento `::-webkit-slider-thumb`). Corrigido com `outline: none` no
próprio `.rangeInput`, deixando só o anel customizado do thumb visível. Testado no
navegador: alteração de valor via evento nativo (simulando arraste) atualizando o texto
do valor corretamente; clampagem confirmada arrastando o cabo mínimo além do máximo
(900 → clampado em 800, resultando em intervalo "800 – 800"); variante desabilitada
renderizando com thumb acinzentado.

SegmentedControl (molécula, novo). Grupo de botões de seleção única lado a lado,
`role="radiogroup"`/`role="radio"` (não `tablist`/`tab`, apesar da navegação por teclado
ser quase idêntica à de Tabs) — decisão deliberada de semântica: é uma escolha única entre
opções equivalentes sempre visíveis, sem a noção de painel associado que Tabs carrega.
`items: {value, label, icon?, disabled?}[]`, `value`/`onChange` controlados, ativação
automática por seta (mesmo racional já documentado em Tabs), roving tabindex (só o
selecionado é tabbable). `state='disabled'` desabilita o grupo inteiro, além do disabled
por item individual. Testado no navegador: clique selecionando "Grade" corretamente;
ArrowLeft movendo a seleção de volta pra "Lista" com foco seguindo e tabIndex roving
correto (0 no selecionado, -1 nos demais); item "Arquivados" confirmado disabled=true via
DOM (nunca selecionável); grupo inteiro desabilitado renderizando esmaecido.

Popover (molécula, novo). Painel flutuante genérico ancorado a um gatilho — mesmo padrão
de children+cloneElement já usado em Tooltip, floating-ui com offset/flip/shift, estado
aberto/fechado interno (não controlado por fora, mesmo racional de Select/ComboBox).
`content` é livre; `role` (dialog/menu/listbox) alimenta o useRole do floating-ui.
Construído AGORA como componente novo pra consumidores FUTUROS — não substitui a
integração de floating-ui já existente e testada em Select/Tooltip/Datatable/Breadcrumb/
DatePicker/TimePicker/DateTimePicker (mesma disciplina de "sem dedup especulativo" já
aplicada em Pagination). BUG REAL encontrado testando no navegador: usar o componente
Button do harness como `children` falhava silenciosamente — nenhum erro, mas
aria-expanded/aria-haspopup nunca eram aplicados e o clique nunca abria o painel. Causa:
Button tem API fechada (ButtonProps não inclui ref nem onClick, só onPress, e não faz
spread de props desconhecidas no `<button>` interno), então cloneElement não consegue
conectar o gatilho — mesma limitação que Tooltip já tinha implicitamente (o demo dele
também sempre usou `<button>` nativo, nunca Button). Documentado como limitação conhecida
no contrato (forbidden + decisions) e corrigido no demo do Popover (trocado Button por
`<button>` nativo estilizado). Testado no navegador: painel "dialog" abrindo com um
mini-formulário (campo "Apelido"), Esc fechando; painel "menu" abrindo uma lista de ações
(Duplicar/Arquivar/Excluir, item destrutivo em vermelho) ancorado a um gatilho iconOnly.

AvatarGroup (átomo, novo). Reaproveita o átomo Avatar diretamente (mesma forma de dado
src/name/accessibleLabel) — AvatarGroup só orquestra quantos mostrar (`max`, default 5) e
a sobreposição, sem duplicar a lógica de fallback foto→iniciais→ícone que o Avatar já
resolve. Avatares mais à esquerda ficam por cima (z-index decrescente), convenção visual
já estabelecida (Figma, Google Docs). Indicador "+N" (quando avatars.length > max) tem
aria-label descritivo próprio (ex.: "e mais 2 pessoas"), nunca só o texto visual cru.
Contorno entre avatares sobrepostos usa a cor do fundo (semantic.fundo-superficie) como
borda, sem token de borda novo. Testado no navegador: 7 pessoas com max=5 mostrando 5
avatares + "+2" com aria-label "e mais 2 pessoas" confirmado via DOM; 3 pessoas cabendo
todas sem indicador de overflow; variante size="small" com max=3.

Timeline (molécula, novo). Lista vertical de eventos cronológicos — marcador (círculo
colorido por `tone`: neutral/success/warning/error/info, com ícone opcional dentro),
título, descrição opcional, timestamp opcional. Puramente informativo, sem interatividade
nem estados atual/pendente — diferente de Stepper (que modela progresso VIVO de um fluxo);
Timeline modela histórico já acontecido, onde cada evento tem seu próprio tom independente
da posição na lista (ao contrário do Stepper, cujo estado é derivado da posição relativa a
currentStep). Marcadores sempre aria-hidden — cor/ícone reforçam o texto, nunca são a
única pista do tom do evento. Testado no navegador: histórico de pedido com 5 eventos
renderizando corretamente as 5 combinações de tone (neutral sem ícone, success com check
verde, error com X vermelho, info com ícone azul, neutral final), conectores entre os
marcadores visíveis.

StatCard (molécula, novo). Reaproveita o átomo Card como superfície (padding='medium',
elevation repassada) — StatCard é literalmente conteúdo específico dentro de um Card, sem
declarar fundo/borda/raio próprios. `label` + `value` (sempre string, já formatado por
quem consome — StatCard nunca formata número/moeda) + indicador de tendência opcional
(`trendDirection`/`trendValue`). `trendTone` é derivado automaticamente da direção
(up→verde/sucesso, down→vermelho/erro) mas pode ser sobrescrito explicitamente — resolve
métricas onde "subir" é notícia ruim (ex.: "Custos operacionais: +15%" deveria ser
vermelho apesar da seta pra cima). Sem sparkline/mini-gráfico nesta v1 (gráficos ficaram
fora de escopo desta fila, pedido explícito do usuário). Testado no navegador: 5
combinações renderizando corretas — tendência up/verde, down/vermelho (derivados
automaticamente), up/vermelho (tone sobrescrito), neutral/cinza, e sem tendência nenhuma.

FilterBar (molécula, novo). Busca opcional (opt-in via presença de onSearchChange,
reaproveita TextField com leftIcon='magnifying-glass') + `filters` como slot LIVRE
(ReactNode, não array de configuração — cada filtro pode ser qualquer controle do harness
com props totalmente diferentes entre si) + resumo dos filtros ativos via Chip removível.
FilterBar nunca filtra dados sozinha — só apresentação, mesmo racional de onExport da
Datatable delegar a operação real pro consumidor. 'Limpar tudo' só aparece com dupla
condição (onClearAll fornecida E activeFilters não-vazio). Testado no navegador: seleção
de "Status: Ativo" fazendo aparecer o Chip removível + "Limpar tudo"; clique no X do Chip
removendo o filtro e a linha de resumo desaparecendo; variante só-busca sem filtros nem
resumo renderizando corretamente.

PasswordStrengthMeter (átomo, novo). Barra segmentada (4 blocos) + rótulo textual
(role="status" aria-live="polite"), pareado com TextField type='password' — só LÊ o
value, nunca controla o campo. Heurística simples (conta critérios: comprimento≥8,
minúscula, maiúscula, dígito, símbolo → 5 níveis) documentada explicitamente como NÃO
sendo cálculo de entropia criptográfica nem substituto de validação de segurança real —
decisão deliberada de não trazer lib de estimativa (ex.: zxcvbn) sem necessidade
comprovada, mesmo racional já usado no Datatable pra não trazer lib de PDF/planilha.
Testado no navegador: "abc" mostrando "Fraca" (1 segmento vermelho); "Def123!@" (atende
os 5 critérios) mostrando "Muito forte" com os 4 segmentos verdes confirmados via
getComputedStyle (rgb(33,150,83) = borda-sucesso) — um screenshot intermediário parecia
mostrar só 1 segmento colorido, mas era só a transição CSS de cor capturada a meio
caminho, não um bug real.

CopyButton (átomo, novo). Ícone novo no registro do Icon: `copy-simple` (Phosphor
CopySimple). Botão iconOnly que copia `value` via `navigator.clipboard.writeText` —
estado `copied` transiente (~2s via setTimeout, revertido sozinho), ícone vira `check`
verde e aria-label muda pra "Copiado!" durante esse tempo (confirmação acessível sem
depender só da mudança visual). Falha de clipboard.writeText (permissão negada, documento
sem foco, API ausente) é capturada e ignorada silenciosamente — nunca lança exceção nem
quebra a página; sem estado de erro visual nesta v1 (documentado como decisão, não gap
esquecido). Testado no navegador: clique com documento sem foco reproduziu exatamente o
cenário documentado (NotAllowedError "Document is not focused", tratado graciosamente,
sem crash); clique com documento focado confirmou escrita real no clipboard do SO
(sinalizado pela própria ferramenta de automação). NOTA PRA O USUÁRIO: um dos testes
chegou a sobrescrever o clipboard real da máquina com o texto de teste
("sk_live_51H8x9F2aB3f") — sem risco (não é um segredo real), mas vale colar/checar antes
de usar o clipboard se algo importante estava copiado antes.

ConfirmDialog (organismo, novo). Formaliza o padrão de Modal (size='small') + título +
texto + Cancelar/Confirmar que a Datatable já reimplementava ad hoc — reaproveita Modal e
Button diretamente, sem overlay/borda próprios. NÃO fecha sozinho após onConfirm (mesmo
padrão já usado na Datatable: quem consome controla `open` e decide fechar só depois que a
ação de verdade termina, útil pra aguardar uma chamada assíncrona). `confirmVariant`
limitado a 'primary'/'destructive' (as únicas duas que fazem sentido semântico pra uma
confirmação final). `confirmState='loading'` desabilita TAMBÉM o Cancelar (evita
"cancelar" uma ação já em andamento no servidor). Foco inicial nunca vai pro botão de
confirmação — decisão de segurança pra confirmações destrutivas (evita um Enter reflexo
disparar a ação assim que o dialog abre). Testado no navegador: dialog destrutivo abrindo
com título/descrição/botões corretos (Cancelar neutral outlined, Excluir vermelho);
confirmado via DOM que o foco inicial vai pro botão "Fechar" do Modal, nunca pro "Excluir"
(document.activeElement !== botão Excluir); fluxo completo de confirmação com loading
state exercido (Cancelar/Confirmar desabilitados durante confirmState='loading').

Wizard (organismo, novo). Reaproveita Stepper como indicador de progresso (mesmo padrão
já reservado em stepper.contract.json) e Button pro rodapé de navegação — Stepper nunca
sabe o que está sendo validado, só reflete currentStep; Wizard é quem decide a lógica de
navegação/validação. `steps[].content` renderiza só a etapa atual (sempre
montada/desmontada ao trocar, diferente do TabPanel que preserva via hidden — decisão
deliberada: o estado do formulário já vive no componente pai, não precisa ser preservado
no DOM da etapa). `validateStep?` aceita retorno síncrono ou Promise, bloqueia o avanço
sem que o Wizard saiba/mostre o motivo — a etapa (content) é quem exibe seus próprios
erros, mesmo racional do onReject do FileUpload. Botão troca sozinho de "Próxima etapa"
pra "Concluir" na última etapa. Testado no navegador: tentar avançar com nome vazio
bloqueado corretamente (permanece na etapa 1); preenchimento + avanço funcionando;
navegação de volta clicando na etapa "Dados pessoais" já concluída no Stepper preservando
o valor digitado (estado vive no componente pai da demo, não no Wizard); etapa "Revisão"
mostrando os dados corretos; clique em "Concluir" disparando onComplete com os valores
esperados — fluxo completo ponta a ponta confirmado.

7 páginas novas em `src/interface/screens/` (sem contrato, mesmo padrão do LoginScreen —
composição pura de componentes já contratados, registradas em "Páginas" no Playground):
ForgotPasswordScreen (recuperação por e-mail, Alert de sucesso no submit), 
ResetPasswordScreen (nova senha + confirmação, PasswordStrengthMeter pareado, valida
comprimento mínimo e coincidência), SignUpScreen (nome/e-mail/senha + Checkbox de termos
obrigatório, bloqueia submit sem aceite), TwoFactorScreen (Otp com código de teste
"123456", onComplete já dispara a verificação), OnboardingScreen (3 passos reaproveitando
o Wizard, sem validateStep — avanço livre até "Começar a usar"), ErrorScreen (404/500 via
prop `code`, mesmo layout pros dois casos), FullPageLoading (Spinner + mensagem, tela
cheia, diferente do Spinner solto).

BUG REAL encontrado e corrigido no Otp (contratos/otp.contract.json,
src/components/Otp/Otp.tsx) durante o teste do TwoFactorScreen — `onComplete` disparava
sem argumento (`() => void`), então quem consome precisava ler seu PRÓPRIO state (ex.: um
`value` espelhado via useState) dentro do handler. Como `onComplete` é chamado
SINCRONAMENTE logo depois de `onChange` (mesmo tick, antes do componente pai
re-renderizar), esse state ainda estava com o valor ANTERIOR (closure obsoleta) — colar o
código "123456" disparava onComplete, mas o handler via o value antigo (vazio) e reportava
"código inválido" mesmo com o código certo. Corrigido passando o value completo como
argumento (`onComplete?.(digitsOnly)`, assinatura agora `(value: string) => void`) — Otp
Demo e TwoFactorScreen atualizados pra usar o argumento recebido em vez do próprio state.
Testado no navegador: as 7 páginas renderizando corretamente (ForgotPassword com Alert de
sucesso, ResetPassword bloqueando senhas diferentes e mostrando "Muito forte" no medidor,
SignUp bloqueando sem aceite de termos, TwoFactor agora confirmando "Verificado com
sucesso!" ao colar "123456" — bug confirmado corrigido —, Onboarding avançando pelo
Wizard, ErrorScreen alternando 404/500 via SegmentedControl, FullPageLoading com
spinner+mensagem centralizados).

SettingsTemplate (template, novo, `src/interface/screens/` — sem contrato, mesma
disciplina de LoginScreen/páginas: composição pura de componentes já contratados,
registrado no grupo "Templates" do Playground). NavBar no topo + navegação lateral de
seções (Perfil/Segurança/Notificações, lista simples de botões com `aria-current="page"`
no item ativo — sem reaproveitar Tabs, que só suporta horizontal nesta v1) + conteúdo da
seção ativa dentro de um Card. Seção Perfil usa Avatar+TextField; Segurança usa
TextField(senha) + PasswordStrengthMeter pareado + Switch de 2FA; Notificações usa 3
Switch independentes. Testado no navegador: as 3 seções trocando de conteúdo
corretamente ao clicar na navegação lateral, item ativo destacado (verde + negrito),
avatar mostrando iniciais "AB" na seção Perfil, PasswordStrengthMeter reagindo em
Segurança, Switches de Notificações alternando estado (2 ligados por padrão, 1
desligado).

DashboardTemplate (template, novo, `src/interface/screens/` — sem contrato, mesma
disciplina de composição pura). NavBar + grid responsivo de 4 StatCard (receita, pedidos,
ticket médio, cancelamentos — mistura de tendência positiva/negativa) + Datatable
("Pedidos recentes", coluna Status usando Badge colorido por variant). Sem gráficos
(barra/linha/pizza) — fora de escopo por pedido explícito do usuário, mesma exclusão já
registrada no início desta fila. Testado no navegador: 4 StatCards renderizando com cores
de tendência corretas; tabela com Badges (Pago=verde, Pendente=laranja, Cancelado=
vermelho); clique no cabeçalho "Cliente" abrindo o filtro da coluna corretamente (mesmo
comportamento já validado exaustivamente na Datatable sozinha), confirmando que o
componente continua totalmente interativo quando composto dentro do template.

Com isso, a fila de componentes/templates/páginas promovida em 2026-08-18 (exceto
gráficos, explicitamente fora de escopo) está com TODOS os itens concluídos: NavBar,
Stepper, Collapsible/Accordion, Calendar, DatePicker, TimePicker, DateTimePicker, OTP,
Rating, FileUpload, Pagination, Slider, SegmentedControl, Popover, AvatarGroup, Timeline,
StatCard, FilterBar, PasswordStrengthMeter, CopyButton, ConfirmDialog, Wizard, 7 páginas
(ForgotPassword/ResetPassword/SignUp/TwoFactor/Onboarding/Error/FullPageLoading) e 2
templates (Settings/Dashboard).

Ajustes visuais/funcionais pedidos pelo usuário em 2026-08-18, em 6 componentes já
concluídos:

Rating — estrelas marcadas (cheia ou meia) agora usam `weight="fill"` do Icon em vez de
`weight="regular"` (contorno) com só a cor mudando — ficam visualmente preenchidas, não só
coloridas. AJUSTADO a pedido do usuário.

PasswordStrengthMeter — nova prop `showRequirements` (default `true`) lista os requisitos
fixos abaixo da barra (mínimo 8 caracteres, maiúscula, minúscula, número, caractere
especial), cada um com ícone de check/x conforme o valor atual atende ou não. AJUSTADO a
pedido do usuário.

Slider — o círculo de arrastar (thumb) passou de contorno (fundo claro, borda verde) para
preenchido de verde (`acao-primaria`), com anel branco fino ao redor pra manter contraste
contra trilhos preenchidos. Mesmo ajuste no estado disabled (preenchido cinza). AJUSTADO a
pedido do usuário.

Timeline — os círculos marcadores passaram de contorno (fundo claro, borda colorida) para
preenchidos com a cor do tone, com o ícone sempre branco (`texto-invertido`) por cima.
Tone sem ícone explícito agora usa um ícone default por tone (success=check,
warning=warning-circle, error=x-circle, info=info). AJUSTADO a pedido do usuário.

Stepper — nova prop `variant` (`"stacked"` default | `"inline"`). `stacked` mantém a linha
conectando os ícones com o texto abaixo (layout original); `inline` remove a linha e põe o
texto ao lado do ícone, em linha. Demo atualizada mostrando as duas variantes lado a lado.
AJUSTADO a pedido do usuário.

DatePicker/TimePicker/DateTimePicker — os três passaram a aceitar digitação além da
seleção visual. Campo mudou de `<button>` para `<input type="text">` com máscara
automática (só dígitos aceitos, separadores inseridos sozinhos: `DD/MM/AAAA` no
DatePicker, `HH:MM` no TimePicker, `DD/MM/AAAA HH:MM` no DateTimePicker, 12 dígitos).
Lógica de máscara/parse extraída pra `src/components/shared/dateTimeMask.ts`, reaproveitada
pelos três em vez de duplicada. Validação só aceita o valor completo (todos os dígitos
formando data/hora reais, dentro de min/max/disabledDate); campo incompleto ou inválido
nunca dispara `onChange`, e ao perder o foco (blur) reverte pro último valor confirmado —
nunca fica um texto quebrado visível. `useFocus` do floating-ui adicionado (além de
`useClick`) pra abrir o popover também ao tabular até o campo. AJUSTADO a pedido do
usuário.

BUG REAL encontrado e corrigido durante o teste no navegador desse ajuste, nos três
componentes: `onChange`/`onBlur` do input eram passados como props JSX soltas ANTES do
spread de `getReferenceProps()` do floating-ui — que também define seus próprios
`onChange`/`onBlur` internamente. Por object spread, o spread posterior SOBRESCREVIA
silenciosamente os handlers customizados (sem erro nenhum): a máscara funcionava
normalmente, mas a reversão em blur pra um valor inválido nunca disparava, deixando um
texto de data/horário quebrado (ex.: "32/13/2026") visível indefinidamente. Corrigido
passando os handlers como argumento — `getReferenceProps({ onChange, onBlur })` — que é a
forma correta de compor handlers customizados com os internos do floating-ui, em vez de um
sobrescrever o outro. Confirmado no navegador nos três componentes (digitando um valor
inválido e tirando o foco do campo, o texto reverte pro último valor válido confirmado).

Ajustes pedidos pelo usuário em 2026-08-23:

Rating — cor amarela clareada: color='yellow' trocou de semantic.icone-aviso (Amarelo-700,
#9B610D, tom mostarda/marrom) pra semantic.borda-aviso (Amarelo-500, #EBB612, amarelo-ouro
mais claro/saturado) — nenhum token novo, reaproveita um token já existente no harness.
AJUSTADO a pedido do usuário.

Badge/Chip/Timeline — variantes success/warning/error clareadas um degrau: de texto-erro/
texto-sucesso/texto-aviso (tom 700 de cada família) pra fundo-erro-forte/fundo-sucesso-
forte/fundo-aviso-forte (tom 600) — os dois primeiros já existiam em tokens.css pro Toast,
fundo-aviso-forte (Amarelo-600, #C2870C) é novo. success (5.56:1) e error (5.18:1) com
texto branco continuam AA. warning é a exceção: fundo-aviso-forte + texto branco cai pra
3.10:1 (abaixo do mínimo AA) — nesse caso específico o texto/ícone usa semantic.texto-
primario (preto, ~6.6:1) em vez de texto-invertido, seguindo a instrução do usuário de só
usar texto preto onde o contraste com branco ficar prejudicado. accent1/2/3 e info não
mudaram (pedido foi só verde/amarelo/vermelho). AJUSTADO a pedido do usuário. Testado no
navegador: Badge "Pendente" e Chip "Aviso" com texto preto legível sobre o fundo mais
claro; success/error visivelmente mais claros com texto branco ainda legível; Timeline com
marcadores success/error mais claros e glyph branco nítido.

RadioGroup — nova prop `orientation` ('vertical' default | 'horizontal'). horizontal usa
flex-direction:row + flex-wrap:wrap (quebra pra próxima linha sem exigir cálculo de
colunas de quem consome), espaçamento horizontal em espaco-m. AJUSTADO a pedido do
usuário. Testado no navegador: grupo de 4 opções (Feminino/Masculino/Outro/Prefiro não
dizer) numa linha, quebrando a 4ª opção pra segunda linha por falta de espaço.

Alert — nova prop `action` opcional ({ label, onAction }), renderizada como texto
sublinhado (currentColor) abaixo da descrição — não é um Button do harness (que tem
padding/altura pensados pra ficar fora de texto corrido), é pra ações do tipo "Clique aqui
pra X" que precisam ler como parte da frase. Criada especificamente pra viabilizar o Alert
de colunas ocultas do Datatable (ver abaixo), mas é uma prop genérica do Alert, não algo
hardcoded pro Datatable. AJUSTADO a pedido do usuário.

Datatable — 4 ajustes:
1. Indicador de colunas ocultas trocado de Badge (tag pequena ao lado do botão de colunas,
fácil de não notar) pra um Alert (intent='warning') entre a toolbar e a tabela: "Atenção:
você tem N coluna(s) com visualização oculta." + ação "Clique aqui para restaurar" que
zera hiddenColumnKeys (equivalente a marcar de volta todos os checkboxes do dropdown).
2. Filtros ativos (aplicados via input do cabeçalho de coluna) agora ficam visíveis numa
linha de Chips removable entre o Alert de colunas ocultas e a tabela — um Chip por filtro
("Nome da coluna: valor"), removível individualmente (chama onFilterChange(columnKey, '')
só daquele) + botão "Limpar todos".
3. Borda esquerda da coluna sticky (column.sticky='right') trocada de borda-base (cinza
claro, quase invisível durante o scroll) pra borda-inativo (mais escura) + uma sombra
sutil — destaque visual claro de onde a coluna fixa termina e o conteúdo rolável começa.
4. No exemplo completo do Playground, o controle de habilitar/desabilitar (helpers.
requestToggleDisabled) trocou de Switch pra Button iconOnly com ícone eye/eye-slash — a
mesma dupla de ícones já usada nos botões de ativar/desativar em lote (bulkActions), pra
reforçar visualmente que é a mesma operação em escalas diferentes (linha individual vs
lote). Mudança de exemplo/demo, não do componente Datatable em si (a coluna de ações
sempre foi column.render livre).
AJUSTADO a pedido do usuário. Testado no navegador: ocultar a coluna Status disparou o
Alert corretamente, "Clique aqui para restaurar" trouxe a coluna de volta e sumiu o Alert;
filtrar por "Ana" no Cliente mostrou o Chip "Cliente: Ana" com a tabela filtrada pra 1
resultado, removê-lo pelo X limpou o filtro e restaurou os 5 registros da página; scroll
horizontal no exemplo "Muitas colunas" mostrou a borda esquerda da coluna Ações claramente
destacada (mais escura + sombra) separando do conteúdo rolando por baixo; coluna de ações
do exemplo completo mostrando lápis+olho em vez de lápis+switch.

Ajustes finos pedidos pelo usuário em 2026-08-23 (segunda rodada, refinando a rodada
anterior):

Datatable — Alert de colunas ocultas agora numa única linha: description e action ficam
lado a lado (flex row, action alinhada à direita), não mais empilhados. O texto do botão
mudou de "Clique aqui para restaurar" pra só "Restaurar". Essa mudança de layout foi feita
no próprio Alert (prop `action`, genérica), não hardcoded no Datatable — qualquer Alert
com action agora usa esse layout de uma linha só. AJUSTADO a pedido do usuário. Testado no
navegador: Alert de "1 coluna oculta" renderizando numa linha, "Restaurar" à direita.

Rating — no display='compact', o TEXTO do value (ex.: "4.8") com color='yellow' escureceu
de semantic.borda-aviso (Amarelo-500, a mesma cor da estrela) pra semantic.texto-aviso
(Amarelo-700, mais escuro) — só o texto, a estrela continua no amarelo-500 mais claro.
Motivo: o amarelo-500 que funciona bem numa estrela grande preenchida fica claro demais
pra ler como texto pequeno. AJUSTADO a pedido do usuário. Testado no navegador.

Badge/Chip — variante warning clareada mais um degrau: de fundo-aviso-forte (Amarelo-600)
pra semantic.borda-aviso (Amarelo-500, já existente no harness, mesmo tom usado no Rating
e na borda-aviso original). Texto continua semantic.texto-primario (preto), sem mudança —
fundo mais claro só aumenta o contraste com texto preto. Timeline NÃO mudou nesta rodada
(pedido foi só Badge e Chip) — continua em fundo-aviso-forte. AJUSTADO a pedido do
usuário. Testado no navegador: Badge "Pendente" visivelmente mais claro, texto preto ainda
legível.

Badge — ajustes nas 3 variantes accent (categoria, sem status) pedidos pelo usuário em
2026-08-23 (terceira rodada):

accent1/kiwi — clareado de texto-apoio-3 (Kiwi-700) pra semantic.borda-apoio-3 (Kiwi-500,
token já existente) + texto trocado de branco pra semantic.texto-primario (preto). Pedido
explícito incluiu as duas mudanças juntas: kiwi-500 com texto branco cai pra 2.02:1 (falha
AA), com texto preto fica em 8.38:1 (AAA).

accent2/roxo — clareado "um pouco" (pedido mais moderado que kiwi/laranja): de
texto-apoio-1 (Roxo-700) pra um novo token semantic.fundo-apoio-1-forte (Roxo-600, #643BB3
— um degrau só). Texto continua branco (texto-invertido): 7.13:1, ainda AAA.

accent3/laranja — clareado: de texto-apoio-2 (Laranja-700) pra um novo token
semantic.fundo-apoio-2-forte (Laranja-600, #C64208). Texto continua branco: 4.80:1, ainda
AA mas o mais apertado dos 3 accents — não desceu até Laranja-500 (que teria exigido texto
preto como o kiwi, 3.26:1 com branco) porque o usuário não pediu troca de cor de texto
pro laranja, só "mais clara".

AJUSTADO a pedido do usuário. Testado no navegador: Badge "Beta" (kiwi) verde-claro com
texto preto legível, "Interno" (roxo) e "Novo" (laranja) visivelmente mais claros com
texto branco ainda legível.

## Próximo

Fila combinada com o usuário em 2026-08-17, ampliada em 2026-08-18 (candidatos
promovidos, exceto gráficos) — **concluída inteiramente em 2026-08-18** (ver último
parágrafo da seção "Feito").

Gráficos (barra/linha/pizza) continuam explicitamente FORA de escopo, por pedido do
usuário — "Isso a gente vai lidar em outro momento". Retomar essa frente exige alinhar
antes: biblioteca de gráficos (nenhuma dependência de visualização foi trazida pro harness
até agora, mesma disciplina de "sem lib nova sem necessidade comprovada" já aplicada a
PDF/planilha na Datatable e ao medidor de força de senha) e quais tipos de gráfico têm
caso de uso real primeiro.

### Próxima fila — componentes identificados na análise de sistemas legados (2026-08-23)

Baseado em `analise-sistemas-legados.md` (análise pura, sem contrato/token ainda escrito).
Ordem pensada seguindo o grafo de dependência do SKILL.md — ajustes de átomo existente
primeiro, depois átomos novos, depois moléculas que os consomem, depois organismos/
templates que compõem as moléculas. Cada item segue o fluxo normal do harness: contrato →
implementação → Playground → teste real no navegador → documentação.

**Passo 0 — RESOLVIDO com o usuário em 2026-08-23:**
- Todos os itens são prioritários, ordem de execução segue só a dependência técnica (como
  já estava listado abaixo), não importância de negócio.
- Telemedicina/videochamada ENTRA no roadmap do harness — item 3.5 (Barra de controles de
  chamada) está confirmado, não é mais condicional.
- Ajuste do Badge é uma EXTENSÃO do contrato existente (não um componente derivado
  separado tipo "StatusFlag") — suporta ícone+label e as variantes de status de domínio
  observadas dentro do próprio badge.contract.json.

**1. ✅ FEITO (2026-08-23) — Ajuste de fundação — Badge (revisão de contrato existente,
não componente novo).** Nova prop `icon` (IconName, opcional, só combina com label —
nunca com count), renderizada à esquerda do texto com `color="currentColor"` (herda a cor
de texto da variant ativa, sem token de cor novo). Novo variant `critical` — um degrau
mais grave que error, pra domínios onde error já está ocupado por outro status (ex.:
Kanban com "Atrasado" E "Urgente"/"Recusado" coexistindo) — reaproveita
semantic.acao-destrutiva-pressionada (Vermelho-800) já existente em tokens.css, nenhum
token novo criado; contraste com texto branco 11.42:1 (AAA, o mais alto de todas as
variantes coloridas do Badge). Variantes de domínio mais específicas da análise (Em
Análise, Autorização Parcial, Carência Contratual) não ganharam variant dedicado — mapeiam
pra info/neutral/warning conforme o caso, por não terem cor própria clara nas telas legadas
(eram texto simples, sem token de cor consistente por trás). Badge passou a depender de
Icon (`dependencies: []` → `["Icon"]`). Testado no navegador: badges "Autorizado"
(success+check-circle), "Atenção" (warning+warning-circle), "Recusado"
(error+x-circle) e "Atrasado" (critical+warning-circle, visivelmente mais escuro que
error) renderizando corretamente lado a lado. Build e typecheck limpos. Era pré-requisito
de 3.2 (Selectable Card) e 3.3 (Action Card) e do item 5.1 (Ticket Card) — desbloqueados.

**2. ✅ FEITO (2026-08-23) — Átomo novo — DataField.** Novo componente
`src/components/DataField/` (contrato `contratos/data-field.contract.json`): rótulo
(texto-p, texto-secundario) em cima + valor (texto-m, texto-primario, com ícone opcional
prefixando) embaixo, dentro de uma caixa com borda leve (borda-base, raio-pp) — o padrão
mais repetido de todos os prints da análise (Visão 360, Credenciamento, Internações,
proposta do corretor). Props: `label` (obrigatório), `value` (obrigatório, string já
formatada — DataField não mascara/formata nada), `icon` (opcional, decorativo, prefixa o
VALOR, não o rótulo — reflete o padrão real observado). Estritamente só-leitura nesta v1,
sem modo editável (nenhum caso real observado exigia isso; quando precisar, o padrão já
existente é trocar por TextField/Select). Documentado explicitamente no contrato por que
NÃO é o mesmo componente que StackedText (hierarquia visual invertida: StackedText é
principal-em-cima/secundário-embaixo sem caixa/ícone, DataField é rótulo-pequeno-em-cima/
valor-grande-embaixo sempre com caixa, ícone opcional no valor). Depende só de Icon (já
existia). Registrado no Playground (átomos) com demo mostrando uso sem ícone, com ícone,
composição em grade 2 colunas (caso de uso típico) e valor ausente (decisão de quem
consome, ex.: "—"). Testado no navegador — visual bate com o padrão observado nas telas
legadas. Build e typecheck limpos. Desbloqueava qualquer tela de detalhe futura que hoje
remontaria esse padrão na mão — próximos consumidores naturais: itens 3.2/3.3/5.1/5.3
desta mesma fila.

AJUSTE (2026-08-23, pedido do usuário) — BUG REAL corrigido: o espaço visual entre rótulo
e valor estava maior que o espaço entre o texto e a borda da caixa, mesmo com `padding`
uniforme nos 4 lados e um `gap` explícito (4px) numericamente menor que o `padding` (8px).
Causa: o line-height de cada estilo tipográfico (texto-p 1.4, texto-m 1.5) soma leading
próprio acima/abaixo de cada linha, que se acumula com o gap explícito — o resultado
visual não bate com os valores nominais dos tokens. Corrigido removendo o gap explícito
(`gap: 0` no container), deixando o line-height de cada linha ser a única fonte de
espaçamento entre rótulo e valor; o padding da caixa volta a dominar visualmente a régua
de espaçamento. Testado no navegador (screenshot antes/depois + medição via
getBoundingClientRect). Build e typecheck limpos.

AJUSTE 2 (2026-08-23, pedido do usuário) — BUG REAL corrigido, mesma causa raiz: mesmo com
`padding: espaco-pp` numericamente igual nos 4 lados (8px), o padding vertical (topo/
baixo) lia visualmente maior que o horizontal — o line-height das linhas de texto soma
leading vertical (acima da 1ª linha, abaixo da última) sem equivalente horizontal, já que
texto não tem "leading lateral". Corrigido trocando pra `padding: espaco-pp espaco-p`
(8px vertical / 12px horizontal) — o horizontal levemente maior compensa a ausência de
leading lateral e equilibra a percepção dos 4 lados. Testado no navegador. Build e
typecheck limpos.

**3. Moléculas (dependem de 1 e 2 acima + átomos já existentes: Badge, Button, Icon,
ProgressBar, TextField/Button):**
- 3.1 ✅ FEITO (2026-08-23) — ProgressList: lista de barras rotuladas (rótulo em cima,
  ProgressBar+contagem embaixo), `src/components/ProgressList/` (contrato
  `contratos/progress-list.contract.json`). Prop `items` (array de
  `{ label, value, max?, count, variant? }`) — `count` é string pronta pra exibição
  (ProgressList não formata número nenhum), `accessibleLabel` de cada ProgressBar interno
  é derivado automaticamente como `${label}: ${count}` (reduz risco de esquecer o
  accessibleLabel obrigatório do ProgressBar numa lista longa). PRÉ-REQUISITO cumprido
  primeiro: ProgressBar ganhou 3 variantes novas (`warning`/`critical`/`neutral`,
  reaproveitando os mesmos tokens já usados no Badge — borda-aviso/
  acao-destrutiva-pressionada/borda-inativo, nenhum token novo) pra cobrir listas de
  severidade tipo "No prazo/Atenção/Urgente/Atrasado" observadas na análise. BUG REAL
  corrigido em teste no navegador: a raiz do componente (`<ul>`) não tinha `width: 100%`,
  então o wrapper de demo (`align-items: center`) colapsava a lista inteira pra poucos
  pixels de largura — cada barra virava um pontinho quase invisível em vez de proporcional.
  Corrigido adicionando `width: 100%` na raiz (mesma técnica que o próprio ProgressBar já
  usa). Registrado no Playground (moléculas) com demo de prioridade (4 severidades) e de
  rede de atendimento (mesmo tom, `max` diferente por item). Testado no navegador —
  confirmado visualmente antes/depois do bug fix. Build e typecheck limpos.
- 3.2 ✅ FEITO (2026-08-23) — SelectableCard: cartão radio-selecionável rico,
  `src/components/SelectableCard/` (contrato `contratos/selectable-card.contract.json`).
  Props: `checked`/`name`/`value`/`title` obrigatórios; `description`/`price`/`badgeLabel`/
  `badgeVariant`/`state` opcionais. Reaproveita a MESMA técnica de acessibilidade do Radio
  (input nativo `type="radio"` sr-only + `<label>` visual — aqui o `<label>` é o cartão
  inteiro, não uma linha simples), então seleção/navegação por teclado/leitor de tela vêm
  de graça do próprio HTML nativo, sem reimplementar aria-checked/roving tabindex. Preço em
  texto-g-forte (maior que o título) porque é o dado mais escaneável entre opções. Estado
  selecionado usa fundo-invertido + texto-invertido (mesmo par de maior contraste já usado
  em Badge variant='dark'), não uma cor de 'seleção' nova. É o componente INDIVIDUAL (como
  Radio), sem um 'Group' — quem consome monta a grade (grid CSS) com o mesmo `name` em
  cada card; não construído agora porque o layout de grade real varia caso a caso (decisão
  documentada, evita impor um layout errado antes de um segundo caso de uso real).
  Registrado no Playground (moléculas) com demo de grade de 4 planos (badges com variants
  diferentes — neutral/success/dark/accent2), variante sem badge/preço e variante
  desabilitada. Testado no navegador —
  clique em um cartão diferente troca a seleção corretamente (grupo radio nativo
  funcionando, confirmado via texto "Selecionado: topazio" mudando ao clicar). Build e
  typecheck limpos.

AJUSTE (2026-08-23, pedido do usuário) — nova prop `selectedTone`
(dark/primary/accent1/accent2/accent3/info, default 'dark') pra escolher a cor de fundo do
cartão quando checked=true, em vez de fundo-invertido fixo: "no estado selecionado deve
ser possível escolher a cor do fundo, entre verde (a cor principal), preto, kiwi, azul,
etc". Mapeamento: dark=fundo-invertido (preto, default original), primary=acao-primaria
(verde, com acao-primaria-texto branco, mesmo par do Button), accent1=borda-apoio-3 (kiwi,
com texto-primario preto — mesma exceção de contraste já aplicada no Badge accent1),
accent2=fundo-apoio-1-forte (roxo), accent3=fundo-apoio-2-forte (laranja), info=texto-info
(azul). Nenhum token novo — os 6 tons reaproveitam exatamente os mesmos tokens já usados
em Badge/Button. Círculo indicador de seleção passou a usar `currentColor` em vez de uma
cor fixa, pra acompanhar automaticamente qualquer tom escolhido sem repetir regra de cor
por tom. selectedTone é um enum PRÓPRIO (SelectableCardTone), não reaproveita BadgeVariant
diretamente — Badge tem variantes de status (success/warning/error/critical) que não fazem
sentido como cor de card selecionado, e SelectableCard precisava de 'primary' (verde-ação),
que não existe no Badge. Demo atualizada com os 6 tons lado a lado. Testado no navegador —
todos os 6 renderizando com texto/círculo legíveis. Build e typecheck limpos.

AJUSTE 2 (2026-08-23, pedido do usuário) — "quando a cor do fundo selecionado for a mesma
cor da tag, ao selecionar o card, a tag deve assumir o fundo branco e o texto ficar na cor
da seleção (mas em um tom melhor de contraste)". Badge ganhou nova prop `inverted`
(boolean, default false) — quando true, troca o fundo sólido pelo par claro+colorido
equivalente, que é literalmente o "modelo antigo" do Badge (antes da mudança pra fundo
sólido, ver item Badge na seção "Feito" mais acima): fundo-erro/sucesso/aviso/info/
apoio-1/2/3 + texto-erro/sucesso/aviso/info/apoio-1/2/3, todos já existentes em tokens.css
— nenhum token novo. critical (sem "modelo antigo" correspondente) usa fundo-erro +
acao-destrutiva-pressionada como texto. Contraste de todos os pares ≥4.9:1 (AA), maioria
≥6.8:1 (AAA) — já validados antes para os mesmos pares em alert.contract.json.
SelectableCard agora detecta quando `badgeVariant` é da mesma família de cor que
`selectedTone` (mapa fixo dark↔dark, accent1↔accent1, accent2↔accent2, accent3↔accent3,
info↔info — 'primary' nunca colide) e, se sim, passa `inverted=true` pro Badge
automaticamente. A lógica de "como fica um badge invertido" mora inteiramente no Badge
(reaproveitável por qualquer outro consumidor) — SelectableCard só decide QUANDO acionar.
Demo atualizada com comparação lado a lado (mesmo badge roxo, um cartão com selectedTone
diferente/sem colisão vs. outro com selectedTone igual/com colisão) + o card "Infinite" do
grupo principal ajustado pra badgeVariant="accent2" + selectedTone="accent2" de propósito,
demonstrando o caso real que motivou o ajuste. Testado no navegador — confirmado
visualmente: badge "Infinite" vira fundo lavanda claro + texto roxo quando o cartão
selecionado também é roxo, permanece sólido roxo normal quando o cartão é de outra cor.
Build e typecheck limpos.

- 3.3 ✅ FEITO (2026-08-23) — ActionCard: cartão de ação administrativa,
  `src/components/ActionCard/` (contrato `contratos/action-card.contract.json`).
  Reaproveita Card (padding='medium') como superfície externa — não é uma superfície nova.
  Props: `icon`/`title`/`description`/`primaryLabel`/`onPrimaryAction` obrigatórios;
  `iconTone` ('default'=verde/'destructive'=vermelho), `status` ({label, active} — bolinha
  + rótulo, opcional), `primaryVariant` (reaproveita ButtonVariant, NÃO amarrado a
  iconTone — nos prints legados a cor do botão nem sempre acompanhava a cor do ícone, ex.:
  'Cancelar contratos em lote' tinha ícone vermelho mas botão neutro escuro), `secondaryLabel`/
  `onSecondaryAction` (botão link opcional), `onInfo`/`onSettings` (ícones utilitários no
  cabeçalho, só renderizam se a função for fornecida). Novo ícone 'gear' adicionado ao
  registro do Icon (nenhum ícone existente cobria 'configuração' — registro cresce sob
  demanda de consumidor real, primeira vez que precisou). Registrado no Playground
  (moléculas) com demo de grade 2×2 (replicando 4 dos 9 cartões do painel de supervisão
  legado: Contatos de suporte, Verificar assinaturas, Cancelar contratos em lote,
  Suspender vendas) + exemplo com ação secundária. Testado no navegador — visual bate de
  perto com o padrão legado (badge de ícone colorido, utilitários info+engrenagem,
  status com bolinha, botões). Build e typecheck limpos.

AJUSTE (2026-08-23, pedido do usuário) — 2 mudanças:
1. Ícone principal deixou de ter um fundo/badge colorido (quadrado + ícone branco dentro)
   e virou um ícone simples, colorido diretamente sem caixa ao redor. Motivo explícito:
   "os ícones na parte superior esquerda estão muito parecidos com botões, isso pode
   confundir os usuários" — o badge sólido tinha a mesma linguagem visual de um botão
   iconOnly do harness (fundo colorido + cantos arredondados + ícone branco), lendo como
   clicável sem ser. iconTone ganhou uma 3ª opção 'neutral' (icone-secundario, cinza) —
   "podem ser coloridos ou não".
2. Novo par de props `secondaryVariant`/`secondaryOutlined` (reaproveita ButtonVariant,
   nenhum enum novo) — permite um rodapé com DOIS botões reais lado a lado, não só
   principal+link. Default `secondaryVariant='link'` preserva o comportamento original;
   `secondaryVariant='neutral'` + `secondaryOutlined` reproduz o mesmo par "Cancelar
   (contornado) / Confirmar (sólido)" já usado nos Modals de confirmação do Datatable —
   reaproveita um padrão já validado no harness, não inventou um layout novo.
Demo atualizada com exemplo "Excluir conta" (2 botões reais: Excluir destructive +
Cancelar neutral outlined). Testado no navegador — ícones principais agora leem como
decoração, não como botão; par de botões reais renderizando corretamente lado a lado.
Build e typecheck limpos.

AJUSTE 2 (2026-08-23, pedido do usuário) — 2 mudanças:
1. Ações (botão principal + secundário) agora ficam SEMPRE ancoradas no fim do card,
   mesmo quando esticado além da altura do próprio conteúdo (ex.: grid com
   align-items:stretch e cards vizinhos mais altos na mesma linha) — "o espaço em branco
   [deve ficar] entre o texto e o botão", não sobrando embaixo dos botões. Implementado
   envolvendo o conteúdo num wrapper flex-column height:100%, com
   `.actions { margin-top: auto; padding-top: espaco-m }`. Confirmado no navegador via
   getBoundingClientRect: dois ActionCard na mesma linha da grade, conteúdo de tamanhos
   diferentes, botões alinhados exatamente no mesmo Y (428px nos dois).
2. Ícone principal voltou a ter um círculo de fundo ao redor, mas agora TRANSLÚCIDO (10%
   de opacidade, tokens acao-primaria-transparente/acao-destrutiva-transparente já
   existentes em tokens.css, reaproveitados pela 1ª vez fora de Button) em vez de sólido
   com ícone branco — "os ícones da esquerda estão muito sutis... crie uma div redonda ao
   redor dele, com a cor de fundo na mesma cor do ícone, só que bem clarinha". Diferença
   chave que evita reintroduzir o problema do ajuste anterior ("parece botão"): fundo
   translúcido claro + ícone colorido por cima lê como selo decorativo, não como botão
   preenchido de alto contraste. Ícone também cresceu de size='medium' (20px) pra
   size='large' (24px) e ganhou weight='bold' (era 'regular'). Testado no navegador —
   círculos claros visíveis atrás de cada ícone, ícone maior e mais forte, sem lembrar
   botão. Build e typecheck limpos.
- 3.4 ✅ FEITO (2026-08-23) — CommentComposer: compositor de nota/comentário,
  `src/components/CommentComposer/` (contrato `contratos/comment-composer.contract.json`).
  Reaproveita o átomo Textarea (SEM label/helperText, já opcionais no contrato dele) +
  barra inferior com utilitários opcionais (`onAttachImage`/`onMarkImportant` — só
  renderizam se a função for fornecida, mesmo racional de onInfo/onSettings do ActionCard)
  + botão Publicar (`variant='primary'` fixo, sem prop de variante — o print legado só
  mostrava uma cor, diferente do ActionCard que tinha variação real). 100% controlado:
  `onSubmit` NÃO limpa o `value` sozinho, quem decide quando limpar é o consumidor (ex.:
  só depois da API confirmar) — evita perder o texto digitado se o envio falhar. Enter
  dentro do campo é sempre quebra de linha, nunca publica (comportamento nativo de
  textarea, documentado como forbidden explícito). Emoji picker do print legado
  DELIBERADAMENTE fora de escopo — é uma funcionalidade própria (grade de emojis, busca,
  categorias), não um ícone simples; vira componente novo se aparecer necessidade real,
  não antecipado agora. Registrado no Playground (moléculas) com 3 demos: completo com
  utilitários + lista de notas publicadas, sem utilitários (submitLabel customizado
  'Comentar'), e desabilitado (estado 'enviando'). Testado no navegador — botão Publicar
  desabilitado com campo vazio, habilita ao digitar, publica a nota na lista e limpa o
  campo (via callback do consumidor) ao clicar, confirmado passo a passo via interação
  real (digitar + clicar). Build e typecheck limpos.
AJUSTE (2026-08-23, pedido do usuário) — "coloque a opção de adicionar ou remover o
contador de caracteres... e também a possibilidade de limitar o campo, com mensagem de
alerta quando chegar ao limite (bloqueando a digitação ou permitido digitar e alertando e
bloqueando o botão)". Duas peças, uma em cada nível:

Textarea (átomo, ajuste de fundação — a decisão anterior "sem contador nesta versão,
candidato a decisão nova" foi resolvida agora com um caso de uso real):
- Nova prop `showCharacterCount` (default false) — mostra "N/max" no rodapé, à direita do
  HelperText. Só aparece se `maxLength` também estiver definido.
- Nova prop `enforceMaxLength` (default true) — controla SE `maxLength` vira o atributo
  nativo do `<textarea>` (bloqueio físico de digitação) ou só alimenta o contador/estado
  "acima do limite" sem bloquear (`enforceMaxLength=false`, digitação livre além do
  limite). Contador fica texto-erro quando a contagem ultrapassa maxLength — só alcançável
  com enforceMaxLength=false.

CommentComposer (repassa pro Textarea + adiciona a peça que só faz sentido aqui, já que
Textarea sozinho não tem noção de "botão de publicar" pra bloquear):
- Novas props `maxLength`/`showCharacterCount` — repasse direto pro Textarea interno.
- Nova prop `limitMode` ('block' default | 'warn') — 'block' = enforceMaxLength=true
  (bloqueio físico, replica o pedido "bloqueando a digitação"). 'warn' = enforceMaxLength=
  false (digitação livre) + `overLimit = value.length > maxLength` computado no
  CommentComposer, que vira: Textarea com state='error' + helperText "Limite de N
  caracteres excedido.", E botão Publicar desabilitado até o texto voltar a caber —
  replica o pedido "permitido digitar e alertando e bloqueando o botão".

Demos atualizadas: TextareaDemo ganhou exemplo com showCharacterCount e exemplo
enforceMaxLength=false acima do limite; CommentComposerDemo ganhou os 2 modos lado a lado
(block com maxLength=40 travando a digitação, warn com maxLength=40 permitindo digitar
até 75 caracteres com alerta+botão desabilitado). Testado no navegador — contador visível
nos dois átomos, modo "warn" mostrando borda vermelha + "75/40" vermelho + mensagem de
alerta + botão desabilitado; modo "block" confirmado via atributo nativo `maxlength="40"`
presente no DOM (bloqueio real de digitação do usuário, diferente de atribuição
programática de valor que não passa pela validação do navegador). Build e typecheck
limpos.

- 3.5 Barra de controles de chamada ✅ FEITO (2026-08-23)
**CallControlBar** (molécula) criado — fileira de botões circulares para controlar uma
videochamada (Icon como única dependência), padrão identificado repetido em pelo menos
4 telas do fluxo de videochamada nos sistemas legados analisados (Entrevista qualificada,
Avaliação, Notas). Cápsula escura (`fundo-invertido` + `raio-circular`) contendo: botão de
encerrar chamada (sempre vermelho, `acao-destrutiva`/`acao-destrutiva-sobreposta` no hover,
nunca configurável, não é toggle), botão de microfone e botão de câmera (ambos controlados
via props `micOn`/`cameraOn`, alternam entre glifo ligado/mudo — `microphone`/
`microphone-slash`, `video-camera`/`video-camera-slash` — em vez de mudar de cor, replicando
fielmente o padrão visto nos prints legados) e botão de configurações opcional (só renderiza
se `onSettings` for passado, mesmo racional de `onInfo`/`onSettings` do ActionCard). Todos os
botões ícone-only levam `aria-label` dinâmico e `aria-pressed` refletindo o estado mudo, para
que o estado nunca dependa só da troca visual do ícone. `onHangUp` não pede confirmação
internamente — decisão de deixar isso a cargo de quem consome, documentada no contrato.
5 novos ícones adicionados ao registro do Icon sob demanda deste consumidor real: `phone-x`,
`microphone`, `microphone-slash`, `video-camera`, `video-camera-slash` (mais `gear`, já
adicionado antes para o ActionCard). Nenhum token novo criado — reaproveitados
`fundo-invertido`/`texto-invertido` (padrão de superfície escura já existente) e
`acao-destrutiva`/`acao-destrutiva-sobreposta` (tokens de botão destrutivo do Button).
Testado no navegador: renderização da cápsula com 3 e 4 botões, clique no microfone
alternando corretamente o ícone e `aria-pressed`/`aria-label`. Nenhum bug real encontrado.
Build e typecheck limpos.

**4. Extensão de componente já planejado — Timeline** ✅ FEITO (2026-08-27)
Contrato e componente **Timeline** estendidos com duas novas propriedades opcionais em
`items[]`: `value` (string) renderiza uma caixa de valor destacada abaixo da descrição —
fundo claro + texto colorido forte, sempre no MESMO tone do item (sem tone próprio),
reaproveitando o mesmo par de tokens `fundo-X`/`texto-X` já usado no Badge `inverted`
(nenhum token novo criado); `attachments` (array de `{ label, href, external? }`) renderiza
uma lista de links reais abaixo da caixa de valor, um por linha, cada um usando o
componente **Link** já existente (não Button variant="link" — é navegação/download real de
um arquivo, distinção já documentada no próprio contrato do Link) com ícone fixo
`download-simple` à esquerda. Padrão visto em 3 sistemas legados diferentes (Visão 360 →
Histórico do caso, Internações → Histórico, Detalhe de solicitação SolicitaMed —
`analise-sistemas-legados.md`, item 1.3). `value` é string livre, não `children`/node —
mantém a Timeline fechada a composição livre, mesmo racional do resto do harness. Nova
dependência do contrato: Link (além de Icon). Testado no navegador com um novo caso no
TimelineDemo (evento de sucesso com caixa verde + 2 anexos, evento de erro com caixa
vermelha sem anexos) — renderização correta, cores combinando com o tone de cada evento.
Nenhum bug real encontrado. Build e typecheck limpos.

**5. Organismos/templates (dependem de 3.3 Action Card, Badge do item 1, Datatable/Select/
DatePicker/StatCard já existentes):**
- 5.1 Ticket Card ✅ FEITO (2026-08-27) — molécula usada dentro do board (usa Card, Badge com
  ícone de bandeira, Avatar, Icon). Anatomy: Badge de prioridade (enum fechado
  atrasado/urgente/atencao/no-prazo, mapeado a critical/error/warning/success do Badge, com
  ícone flag) + botão de menu overflow (···) opcional no cabeçalho, título, prazo opcional
  (ícone hourglass + texto livre, ex.: "Vence hoje"), linhas de metadado opcionais
  (rótulo+valor inline, sem caixa própria — diferente de DataField) e rodapé opcional com
  Avatar (size="small") + nome do responsável. 2 novos ícones adicionados ao registro do
  Icon sob demanda deste consumidor real: flag, hourglass. Nenhum token novo criado. Card
  usado com padding="small" (menos respiro que ActionCard, pensado pra colunas estreitas de
  um Kanban Board). Testado no navegador: as 4 prioridades renderizando cores/rótulos
  corretos, prazo/metadados/avatar condicionais, clique no botão de overflow sem erros.
  Build e typecheck limpos.
  AJUSTE (2026-08-27, pedido do usuário): o botão de overflow (···) genérico virou um menu
  de ações real, aberto via **Popover** (role="menu", placement="bottom-end"), com até 5
  itens fixos — Duplicar, Habilitar/Desabilitar (rótulo e ícone trocam conforme a prop
  `enabled`), Editar, Ver detalhes, Apagar (único item destrutivo, texto-erro, sem
  confirmação embutida — mesmo racional do onHangUp do CallControlBar). Cada item tem seu
  próprio callback (onDuplicate/onToggleEnabled/onEdit/onViewDetails/onDelete) e só aparece
  no menu se for fornecido; o botão de overflow em si só renderiza se pelo menos um
  callback existir. Isso exigiu uma EXTENSÃO no contrato do **Popover**
  (contratos/popover.contract.json): adicionadas as props opcionais `open`/`onOpenChange`
  pra permitir fechar o painel programaticamente depois de selecionar um item — o contrato
  original já previa essa extensão ("se um caso real precisar controlar a abertura de fora,
  é decisão nova quando esse caso aparecer") e agora apareceu. Quando `open` não é passado,
  o Popover se comporta exatamente como antes (estado interno) — sem quebra pros
  consumidores existentes (PopoverDemo, Datatable). Testado no navegador: menu abre com os
  5 itens corretos, clique em "Desabilitar" fecha o menu automaticamente E troca o próprio
  item pra "Habilitar" (ícone check-circle) na reabertura; Popover não-controlado
  (PopoverDemo) continua funcionando sem regressão. Build e typecheck limpos.
- 5.2 Kanban Board ✅ FEITO (2026-08-27) — organismo que compõe colunas de Ticket Card (5.1),
  usando Badge (contador no cabeçalho de cada coluna). `columns` é uma prop livre (array de
  { id, title, tickets }) — o vocabulário de estágios (Novos/Em andamento/Concluídos) é
  decisão de quem consome, não um enum do harness. Cada `tickets[]` usa o mesmo shape de
  dados do TicketCard mais um `id` obrigatório; os 5 callbacks de ação
  (onDuplicate/onToggleEnabled/onEdit/onViewDetails/onDelete) ficam no nível do BOARD, com
  assinatura `(ticketId: string) => void` — o KanbanBoard já faz o fechamento (closure) por
  ticket ao repassar pra cada TicketCard, poupando o consumidor de montar isso manualmente
  pra cada card. SEM drag-and-drop real nesta v1 — o print legado tinha uma interrogação
  própria sobre isso ("cartões arrastáveis(?)") e o projeto não tem nenhuma lib de DnD
  instalada; decidiu-se não implementar especulativamente, fica como decisão nova se um caso
  de uso real confirmar a necessidade. Coluna vazia mostra um texto simples "Nenhum ticket"
  (texto-inativo), não o componente EmptyState — pesado demais pra uma coluna de 280px. Board
  com scroll horizontal, colunas de largura fixa. BUG REAL encontrado e corrigido em teste no
  navegador: `.board` (flex item dentro do wrapper de demo) crescia até a largura total do
  conteúdo em vez de respeitar o espaço do pai — o `overflow-x:auto` declarado nunca
  engatava, e quem escondia o excesso era um ancestral mais acima, cortando a primeira
  coluna e centralizando o corte. Corrigido com `width:100%` + `min-width:0` em `.board`
  (mesma classe de bug já documentada no ProgressList, item 3.1 — mas agora com o detalhe
  extra de que um flex item também precisa de `min-width:0` pra poder ENCOLHER abaixo do seu
  min-content e ativar o próprio scroll interno). Testado no navegador após a correção: as 4
  colunas renderizam na ordem certa (a primeira, "Novos", já visível sem scroll), contador
  de cada coluna correto, scroll horizontal revela a coluna vazia "Arquivados" com "Nenhum
  ticket"/contador 0, menu de ações (···) de um ticket abre dentro do board e "Apagar"
  remove o ticket + atualiza o contador da coluna em tempo real (fluxo state-up completo).
  Build e typecheck limpos.
- 5.3 Template de dashboard com filtro+KPIs ✅ FEITO (2026-08-27) — o template
  **DashboardTemplate** já existente (NavBar + grid de StatCard + Datatable) foi estendido
  com uma **FilterBar** (molécula já existente, item construído numa fila anterior) acima
  do grid de indicadores, com um slot de filtros livres contendo Select (status: Pago/
  Pendente/Cancelado) + DatePicker em modo range (Início/Fim). Reaproveita o próprio padrão
  de "Chip removível por filtro ativo + link Limpar tudo" que a FilterBar já resolvia — não
  foi preciso inventar um botão de limpar "×" à parte, o que o print legado mostrava
  ("range de data com botão limpar ×") já é exatamente essa peça pronta. Os filtros são
  reais: aplicam de fato na Datatable (filtro por status E por intervalo de data, coluna
  Data nova adicionada aos dados de exemplo). Nenhum componente/token novo criado — pura
  composição de peças já contratadas (NavBar, FilterBar, Select, DatePicker, StatCard,
  Datatable, Badge). Sem contrato próprio (é um Template, mesma convenção já usada em
  SettingsTemplate/DashboardTemplate — "sem contrato — template, não componente"). Testado
  no navegador: abrir o Select e escolher "Pendente" filtra a tabela pra 1 linha e mostra o
  Chip "Status: Pendente" + "Limpar tudo"; clicar em "Limpar tudo" reseta o Select e a
  tabela pros 5 pedidos originais. Build e typecheck limpos.
  AJUSTE (2026-08-27, pedido do usuário): dois pontos corrigidos. (1) "Os campos de status,
  início e fim tem que estar na mesma linha" — `.filterControls` no DashboardTemplate trocou
  `flex-wrap: wrap` + `min-width: 200px` fixo por `flex-wrap: nowrap` + `flex: 1 1 0` (o
  DatePicker em modo range, que já é 2 campos internos, ganha `flex-grow: 2` pra manter uma
  proporção razoável) — Status/Início/Fim agora sempre ficam na mesma linha, encolhendo
  juntos em telas estreitas em vez de quebrar. (2) "Os StatCards também precisam de ajuste,
  pq estão muito simples" — usuário escolheu, entre as opções apresentadas, 3 reforços
  visuais pro **StatCard**: ícone por indicador (prop `icon`, já existia mas o
  DashboardTemplate não usava — adicionados `currency-circle-dollar`/`shopping-cart`/
  `receipt` ao registro do Icon, mais `x-circle` que já existia, um por card), círculo
  colorido atrás do ícone (nova prop `iconTone`, reaproveitando o MESMO enum de `trendTone`
  em vez de criar um tipo novo — por padrão deriva do tone da tendência, reaproveitando os
  tokens `-transparente` já usados no ActionCard) e barra de destaque vertical de 4px na
  borda esquerda do card, colorida com o mesmo tone da tendência (só aparece quando há
  `trendDirection`). Implementado com um wrapper externo ao Card (position:relative +
  overflow:hidden), sem tocar no contrato do Card, que não expõe cor de borda customizada
  por design. Testado no navegador nos dois componentes (DashboardTemplate e StatCardDemo,
  incluindo um caso de `iconTone` sobrescrevendo o tone derivado da tendência). Build e
  typecheck limpos.
  AJUSTE (2026-08-27, pedido do usuário): 3 refinamentos finos no **StatCard**. (1) "O
  padding top e bottom do card pode ser um pouco menor" — sem trocar o padding='medium' do
  Card (que segue controlando o horizontal), um wrapper `.content` interno ganhou
  margin-top/bottom negativo de -espaco-pp (-8px), comprimindo o vertical pra ~16px contra
  24px horizontal. (2) "O texto que fica na parte de cima do card não deve estar em
  negrito" — label perdeu o font-weight:700 hardcoded, virou 400/normal. (3) "O texto da
  parte de baixo do card precisa ser um pouquinho mais escuro, por questão de contraste" —
  helperText trocou de texto-inativo (#9ca3af, pensado originalmente pra estados
  desabilitados) pra texto-secundario (#4b5563). Testado no navegador nos dois demos
  (DashboardTemplate e StatCardDemo). Build e typecheck limpos.
  AJUSTE (2026-08-27, pedido do usuário): 3 correções na barra de destaque, no ícone e na
  borda do **StatCard**. (1) "A faixa colorida na esquerda, não deve existir" — barra de 4px
  removida por completo, junto do wrapper que a implementava. (2) "O ícone sempre deve ter a
  mesma cor do indicador percentual do card" — a prop `iconTone` (que permitia um tom
  independente pro círculo do ícone) foi removida; o ícone agora usa DIRETAMENTE a mesma var
  de cor do indicador de tendência, sem nenhuma forma de divergir (o fundo do círculo
  continua sendo só um tint claro, não a cor do próprio ícone). (3) "Quando um card for
  crítico, a borda do card pode ficar vermelha ou não" — nova prop `critical` (boolean,
  default false), explícita e opcional, NÃO derivada automaticamente de uma tendência
  negativa — implementada com `box-shadow: inset 0 0 0 1px var(--acao-destrutiva)` num
  wrapper que só existe quando `critical=true`, sem modificar o contrato do Card. Testado no
  navegador: faixa lateral sumiu de todos os cards, ícone do "Ticket médio" ficou vermelho
  igual ao indicador -3%, card "Cancelamentos" do DashboardTemplate e "Inadimplência" do
  StatCardDemo (ambos com `critical`) mostram borda vermelha confirmada via
  `getComputedStyle` (`box-shadow: rgb(202, 52, 52) inset`). Build e typecheck limpos.
  AJUSTE (2026-08-27, pedido do usuário): "Não vejo nenhum border vermelho" — BUG REAL
  encontrado. O box-shadow `inset` do `critical` estava sendo pintado por baixo da própria
  borda cinza (`borda-base`) que o Card interno já desenha no mesmo pixel — o Card, sendo
  filho, pinta sua borda por cima do box-shadow inset do wrapper pai, escondendo o vermelho
  completamente mesmo com a propriedade CSS corretamente aplicada (por isso o
  `getComputedStyle` anterior confirmava o valor, mas nada aparecia na tela). Corrigido
  trocando pra um box-shadow NÃO-inset com spread de 1.5px (`0 0 0 1.5px`), que desenha um
  anel PRA FORA da caixa do Card em vez de disputar o mesmo pixel da borda — confirmado
  visualmente no navegador (cards "Inadimplência" no StatCardDemo e "Cancelamentos" no
  DashboardTemplate, ambos com borda vermelha nítida).
  Junto veio um segundo ajuste, no **DashboardTemplate**: "os filtros Status, período início
  e período fim não devem ter label" e "os inputs de data precisam do ícone de calendário na
  esquerda". O Select de status já não tinha label visível (o texto "Status" é o próprio
  placeholder dentro do trigger, que já serve de nome acessível por ser conteúdo de um
  `<button>`) — nada a mudar ali. O problema real estava no **DatePicker** em modo range,
  que sempre renderizava um FieldLabel visível com startLabel/endLabel ("Início"/"Fim"),
  mesmo sem um `label` prop fornecido. Corrigido com uma EXTENSÃO no contrato do DatePicker:
  nova prop `hideLabel` (boolean) que omite o FieldLabel visível mas preserva o texto como
  `aria-label` no input — nome acessível nunca fica dependente só da presença visual do
  rótulo. Também adicionado um ícone `calendar` (novo no registro do Icon, via
  `CalendarBlank` do Phosphor) fixo à esquerda do trigger do DatePicker — não é uma prop
  configurável tipo o `leftIcon` do TextField, é sempre presente em TODO DatePicker (pista
  visual universal de "isso é um campo de data"), então esse ganho aparece automaticamente
  em todos os outros consumidores existentes (DatePickerDemo, DateTimePicker), confirmado
  sem regressão visual em teste no navegador. Testado: labels "Início"/"Fim" sumiram do
  DashboardTemplate mas `aria-label` continua presente (`input[placeholder="Período"]` →
  `aria-label: "Início"`/`"Fim"` via JS), ícone de calendário visível nos dois campos. Build
  e typecheck limpos.
  AJUSTE (2026-08-27, pedido do usuário): "O tom de vermelho na borda do statcard, pode ser
  bem mais claro e o spread pode passar de 1.5px pra 1px" — trocado `acao-destrutiva`
  (#ca3434, vermelho mais saturado) por `borda-erro` (#eb5757, mais claro — mesmo token já
  usado nos estados `state='error'` de TextField/Select/DatePicker, então `critical` no
  StatCard passou a usar exatamente a mesma cor de erro do resto do harness) e reduzido o
  spread do box-shadow de 1.5px pra 1px. Testado no navegador: borda mais fina e mais clara,
  ainda perceptível nos cards "Inadimplência" e "Cancelamentos". Build e typecheck limpos.

**Não entram nesta fila** (ver `analise-sistemas-legados.md`, seção 2, para o racional
completo de cada um): seletor numérico 1-10 (reaproveitar Rating/RadioGroup), dots de
progresso (reaproveitar Stepper compacto), cartão colapsável com ícone circular
(Accordion dentro de Card), carrossel (adiar até 3º caso real), visualizador de imagem com
zoom (fora do DS por ora, caso único), transfer list do SolicitaMed (compor com
ComboBox/lista existente), checklist inline com travessão (Stepper variant inline).

### Ajustes pontuais (2026-08-28) — Datatable, KanbanBoard, CallControlBar

Lote de 3 ajustes pedidos pelo usuário. Item 1 (CallControlBar) veio incompleto (subitens
sem conteúdo) — usuário vai reenviar os detalhes depois, fica pendente. Item 3
(drag-and-drop do KanbanBoard) usa `@dnd-kit` — escolha confirmada com o usuário (opção
recomendada: mais acessível por padrão, mantida ativamente, sem a bagagem legada do
react-beautiful-dnd/react-dnd).

- 2. Datatable — borda esquerda da coluna fixa ✅ FEITO (2026-08-28) — REVISÃO de uma
  decisão anterior. A coluna de ação fixa (`column.sticky='right'`) tinha a borda esquerda
  em `borda-inativo` (#9ca3af, mais escura), decisão tomada num pedido anterior do usuário
  pra destacar melhor a divisão durante o scroll. O pedido atual reverteu isso: "o border
  esquerdo da coluna de ação, quando estiver fixada, deve ser cinza, na mesma cor das bordas
  da tabela" — trocado de volta pra `borda-base` (#d1d5db), a mesma cor de todas as outras
  bordas da tabela. A sombra sutil (box-shadow) que já separava visualmente a coluna fixa do
  conteúdo rolável foi mantida — ela sozinha já cumpre esse papel, sem precisar de uma cor de
  borda diferente do resto. Testado no navegador via `getComputedStyle`
  (`borderLeft: "1px solid rgb(209, 213, 219)"`, confirmando borda-base). Token
  `borda-inativo` removido da whitelist do contrato (não é mais usado em nenhum lugar do
  componente). Build e typecheck limpos.

- 3. KanbanBoard — 5 ajustes grandes ✅ FEITO (2026-08-28)
  - **3.1 Drag-and-drop real.** Instalado `@dnd-kit/core` + `@dnd-kit/sortable` +
    `@dnd-kit/utilities` (decisão confirmada com o usuário entre as opções apresentadas —
    @dnd-kit em vez de react-beautiful-dnd/react-dnd). Nova prop `onMoveTicket` (assinatura
    `{ ticketId, fromColumnId, toColumnId, toIndex } => void`) ativa TODO o sistema de
    arrasto (DndContext + PointerSensor + SortableContext por coluna + droppable por
    coluna) — ausência mantém o board 100% estático, sem nenhum listener montado. Cards
    arrastam dentro da mesma coluna (reordena) e entre colunas (move), com feedback visual
    em tempo real via um espelho de estado local (`localColumns`, sincronizado de `columns`
    por `useEffect`) — `onDragOver` já reflete a mudança de coluna durante o arrasto,
    `onDragEnd` calcula a posição final e dispara `onMoveTicket` uma única vez; a fonte da
    verdade continua sendo o consumidor. `PointerSensor` com `activationConstraint.distance
    = 8` garante que um clique simples no botão de overflow (···) do card não dispare um
    drag acidental. `DragOverlay` mostra uma cópia do card seguindo o ponteiro; o card
    original fica com opacity 0.4 durante o arrasto. Limitação conhecida documentada: só
    `PointerSensor` (mouse/touch/caneta) nesta v1, sem `KeyboardSensor` — reordenar via
    teclado ainda não funciona.
  - **3.2 e 3.3 — Colunas de mesma altura + scroll interno sem esconder o cabeçalho.**
    `.board` trocou `align-items:flex-start` por `align-items:stretch` (todas as colunas
    esticam pra mesma altura); cada `.column` virou `display:flex; flex-direction:column;
    height:100%`, com o cabeçalho `flex-shrink:0` (nunca rola) e `.columnBody` com `flex:1;
    min-height:0; overflow-y:auto` (scroll vertical só no corpo, quando os cards excedem a
    altura da coluna). Isso torna KanbanBoard dependente de uma altura definida vinda de
    fora — decisão explícita documentada no contrato.
  - **3.4 e 3.5 — Página de Kanban com header e filtros.** Criado o template
    **KanbanTemplate** (`src/interface/screens/KanbanTemplate/`, sem contrato — mesma
    convenção de DashboardTemplate/SettingsTemplate) que ocupa `100dvh` com
    `overflow:hidden` (sem scroll vertical externo — só o board rola horizontal, cada
    coluna rola vertical por dentro) e prop `embedded` pra caber num frame de preview do
    Playground. Header fixo no topo: título "Fila de tickets" à esquerda, "Novo card"
    (Button primary) + "Filtrar" (trigger de Popover) à direita. O Popover de filtro contém
    Select multi de status (reaproveitando o vocabulário de TicketPriority), Select de
    prazo (presets: Atrasados/Vence hoje/Em dias) e Select de responsável (lista dinâmica
    derivada dos assignees presentes nos dados), com botões "Aplicar"/"Limpar filtros".
    Contagem de filtros ativos aparece como Badge sobre o botão "Filtrar"; os filtros
    aplicados aparecem como Chips removíveis abaixo do header, com "Limpar tudo". Nenhum
    componente/contrato novo criado — pura composição de KanbanBoard + Button + Popover +
    Select + Badge + Chip + Icon já existentes.
  - **BUG REAL corrigido em teste no navegador** (2 ocorrências, mesma causa): tanto no
    KanbanBoardDemo quanto ao testar a nova versão, o wrapper de altura fixa do demo
    (`<div style={{height: 520}}>`, sem `width` explícito) sentava dentro de um container
    pai `display:flex; align-items:center` — em flex com `align-items:center` (não
    stretch), um filho sem largura própria encolhe pro tamanho do CONTEÚDO em vez de
    respeitar o espaço do pai, criando o mesmo bug documentado antes no ProgressList e no
    próprio KanbanBoard (item 5.2). Corrigido adicionando `width: "100%"` ao wrapper do
    demo — não é um bug do componente em si, mas do container de preview, documentado pra
    não se repetir.
  - Testado no navegador: drag entre colunas confirmado (mover ticket de "Novos" pra "Em
    andamento" na posição 0, contadores atualizando, log registrando o evento completo);
    reordenação dentro da mesma coluna confirmada; todas as colunas com a mesma altura,
    coluna vazia ("Arquivados") ocupando o mesmo espaço; scroll interno por coluna com
    cabeçalho fixo; KanbanTemplate com header, popover de filtro (Select de status
    aplicando corretamente, badge de contagem "1", Chip "Status: Atrasado", "Limpar tudo"
    resetando tudo). Build e typecheck limpos.
  AJUSTE (2026-08-28, pedido do usuário): "O fundo geral deve ser branco, para que o fundo
  cinza das colunas se destaque" — fundo do **KanbanTemplate** (`.page`/`.pageEmbedded`)
  trocado de `fundo-secundario` (cinza, mesma cor das colunas — sem contraste nenhum entre
  página e coluna) pra `fundo-superficie` (branco). Testado no navegador: colunas cinzas
  agora se destacam claramente contra o fundo branco da página. Build e typecheck limpos.

- 1. CallControlBar — chevron de dispositivo + configurações reais ✅ FEITO (2026-08-28)
  `onSettings` (callback simples, sem UI própria) substituído por um painel de
  configurações de verdade, aberto num **Popover** (role='dialog', placement='top-end') com
  as opções pedidas: escolha de alto-falante (`speakerDevices`/`selectedSpeakerDeviceId`/
  `onSelectSpeakerDevice`, mesma lista com ícone check dos chevrons de dispositivo) e um
  **Switch** "Desfoque de fundo" (`backgroundBlurEnabled`/`onToggleBackgroundBlur`). O botão
  de Configurações só aparece se pelo menos uma das duas seções tiver conteúdo — nunca um
  botão vazio. Botões de microfone e câmera ganharam um chevron adjacente (24×44px, dentro
  da mesma cápsula visual, ícone caret-up — a barra normalmente fica na parte inferior da
  tela, então o menu abre pra cima) que abre um Popover (role='menu', placement='top') com a
  lista de dispositivos (`micDevices`/`cameraDevices`, mesmo padrão de item com check).
  Chevron implementado como um botão IRMÃO do botão de toggle (não uma extensão do mesmo
  `<button>`) — evita o problema clássico de acessibilidade de "split button" mal feito.
  Toda a feature é opt-in por presença de prop: sem `micDevices`/`cameraDevices` não há
  chevron, sem `speakerDevices`/`onToggleBackgroundBlur` não há botão de Configurações —
  CallControlBarDemo atualizado com um caso completo (2 dispositivos por chevron + as 2
  seções de configuração) e um caso mínimo (só os 3 botões originais, sem nada disso).
  Testado no navegador: chevron do microfone abre o menu, troca de "Microfone do sistema"
  pra "Fone bluetooth JBL" reflete o check corretamente na reabertura; botão de
  Configurações abre o painel com alto-falante + Switch, toggle do desfoque de fundo
  confirmado visualmente. Build e typecheck limpos.
  AJUSTE (2026-08-28, pedido do usuário): 2 refinamentos visuais. (1) "Botão com Chevron:
  devem combinar e se adaptar com o botão que está à esquerda, como se os dois juntos
  formassem uma elipse, separados apenas por um espaço (gap) de 1 ou 2 px" — botão de
  toggle (mic/câmera) perdeu o arredondamento do lado que encosta no chevron (só
  raio-circular do lado externo) e o chevron perdeu o arredondamento do lado oposto —
  juntos com gap de 2px, leem como uma única elipse partida ao meio por uma linha fina, em
  vez de dois controles soltos. (2) "Dropdown dos botões de áudio, vídeo e configurações:
  Deve ter o fundo escuro, no mesmo tom dos fundos dos botões, com os textos adaptados pra
  leitura funcionar" — EXTENSÃO no contrato do **Popover**: nova prop `tone` ('light'
  padrão | 'dark'), usada nos 3 popovers do CallControlBar. Popover só resolve fundo/borda
  do painel (fundo-invertido reaproveitado); as cores de texto dentro do conteúdo continuam
  responsabilidade de quem consome — `.deviceItem` trocou pra texto-invertido (hover:
  overlay translúcido em vez do fundo-secundario claro que ficaria ilegível), `.settingsLabel`
  virou texto-invertido a 70% de opacidade, e o ícone de check do item selecionado trocou
  de acao-primaria (verde escuro, baixo contraste sobre fundo quase preto) pra
  acao-secundaria (verde-limão, alto contraste). BUG PRÉ-EXISTENTE encontrado e corrigido de
  passagem: `contratos/popover.contract.json` tinha uma vírgula faltando entre duas entradas
  do array `decisions` (JSON malformado, `json.load` falhava) — corrigido junto desta
  edição. Testado no navegador: cápsula mic/chevron e câmera/chevron parecem uma peça só;
  os 3 popovers (chevron de mic, chevron de câmera, configurações) renderizam com fundo
  escuro e texto legível; Popover padrão (PopoverDemo, tone='light' implícito) sem
  regressão. Build e typecheck limpos.

### Modo escuro, auditoria de acessibilidade e auditoria de contratos (2026-08-28)

Lote de 3 ações pedidas pelo usuário, executadas diretamente (sem sub-agentes).

**1. Modo escuro no Playground ✅ FEITO.** Nova coleção de tokens em `tokens/tokens.css`
sob `:root[data-theme="dark"]`, sobrescrevendo TODAS as variáveis de cor (nenhuma variável
estrutural/tipografia muda entre temas). Paleta construída do zero (não existe como
coleção no Figma ainda) seguindo a mesma disciplina de contraste do modo claro — validada
com um script Python de contraste WCAG rodado contra os pares fundo/texto reais do
sistema (todos ≥3:1, a maioria ≥4.5:1; ajustei `acao-destrutiva` de #d64545 pra #c93f3f
depois que o primeiro valor deu 4.38:1 com texto branco, abaixo do alvo). Decisão de
design: `fundo-invertido`/`texto-invertido` NÃO trocam de valor entre temas — representam
uma superfície propositalmente escura em qualquer tema (cápsula do CallControlBar, Badge
dark), não "o oposto do tema atual", mesmo racional de uma barra de chamada de vídeo
continuar escura em app claro ou escuro.
Toggle implementado como feature do PRÓPRIO Playground (não um componente do harness, sem
contrato) — `useTheme` (hook com estado + `localStorage` + `data-theme` no `<html>`) e
`ThemeToggle` (botão com ícone sol/lua, novo `sun`/`moon` no registro do Icon), integrados
na Sidebar. Como todo o harness já consome cor exclusivamente via `var(--token)`, o toggle
restyle automaticamente TODOS os componentes sem precisar tocar em nenhum deles.
Testado no navegador em 7 componentes representativos (Icon, Badge, Datatable, StatCard,
Alert, TextField, Calendar, KanbanTemplate) — nenhuma quebra visual, todas as cores
(inclusive Badge critical, borda crítica do StatCard, cápsula do CallControlBar) mantêm
contraste e legibilidade no modo escuro. Build e typecheck limpos.

**2. Auditoria de acessibilidade ✅ FEITO** (padrão relaxado — usuários internos, não
idosos, conforme orientação explícita do usuário). Metodologia: (a) validação de contraste
sistemática via script Python (WCAG) pros pares fundo/texto reais do sistema, nos dois
temas; (b) varredura por grep de TODOS os `<button>` ícone-only em busca de `aria-label`
ausente; (c) varredura de TODOS os `<input>` em busca de `id`/label ou `aria-label`
ausente; (d) inspeção visual no navegador de uma amostra representativa nos dois temas.
Resultado: nenhum problema real encontrado. As varreduras (b) e (c) inicialmente
sinalizaram 9 + 21 candidatos, mas a inspeção manual de cada um confirmou que TODOS já
tinham `aria-label` ou `id`+label corretos (falsos positivos do meu script, que não lidava
bem com atributos quebrados em múltiplas linhas) — a cobertura de acessibilidade já
documentada em cada contrato (aria-pressed/aria-expanded/aria-haspopup, foco visível,
navegação por teclado) se confirmou real no código, não só no papel. `texto-inativo` (~3.4:1
nos dois temas) é a única cor deliberadamente abaixo de AA — aceitável pelo padrão relaxado
combinado com o próprio racional dos contratos ('estado desabilitado comunica
indisponibilidade via contraste reduzido de propósito').

**3. Auditoria de todos os contratos ✅ FEITO.** Script Python percorreu os 64 arquivos em
`contratos/` (63 contratos + o schema JSON) cruzando cada entrada de `tokensAllowed` contra
as variáveis reais de `tokens.css`, checando campos obrigatórios do schema e validade de
JSON. Encontrados e corrigidos:
- **3 contratos com JSON malformado** (vírgula faltando entre entradas do array
  `decisions`, um bug de edição anterior que não travava nada visualmente mas quebrava
  `JSON.parse`): `badge.contract.json`, `progress-bar.contract.json`,
  `rating.contract.json`.
- **2 contratos referenciando tokens fantasma** (citados na whitelist mas inexistentes em
  `tokens.css` e nunca usados em nenhum componente real, confirmado via grep):
  `icon.contract.json` (semantic.icone-primario, semantic.icone-invertido,
  semantic.acao-apoio-1-texto, semantic.acao-apoio-2-texto) e `spinner.contract.json`
  (semantic.icone-primario, semantic.icone-invertido) — removidos e substituídos pelos
  tokens que a base de código REALMENTE usa pra essas cores (texto-invertido,
  texto-secundario, acao-primaria); `icone-apoio-3` (existia em tokens.css mas faltava na
  whitelist do Icon) também foi adicionado.
- **4 contratos com inconsistência de formatação em `dependencies`**
  (`combobox.contract.json`, `select.contract.json`, `text-field.contract.json`,
  `textarea.contract.json`) — o array embutia texto explicativo dentro do próprio nome da
  dependência (ex.: `"Tooltip (indireto, via variante with-info do FieldLabel)"`) em vez
  de um nome limpo; normalizado pra `"Tooltip"`/`"Icon"`, já que `field-label.contract.json`
  (que esses 4 componentes consomem) já declara essas dependências por conta própria — a
  informação não se perdeu, só parou de ficar duplicada de um jeito inconsistente com o
  resto do harness.
- Confirmados como OK (não são bugs, já documentados/intencionais): `"transparent"` sem
  prefixo em `button.contract.json` e `"currentColor"` sem prefixo em `badge.contract.json`
  — os dois são palavras-chave CSS primitivas, não tokens do pipeline, e já vêm com
  comentário explicando isso.
Após as correções: 64/64 arquivos JSON válidos, 0 tokens fantasma restantes, 0
inconsistências de dependência restantes. Build e typecheck limpos.

### Modo escuro — rodada de correção de contraste (2026-08-28)

Lote grande de ajustes pedidos pelo usuário depois de testar o modo escuro recém-criado.
Praticamente todos os achados eram o MESMO tipo de bug estrutural repetido em vários
componentes: um token pensado pra um papel específico (texto sobre fundo claro, fundo
sempre escuro) foi reaproveitado noutro papel (fundo sólido, texto sobre fundo saturado)
que quebra quando o token muda de valor no tema escuro. Corrigido token por token, não
componente por componente.

**Fundo das páginas menos azulado.** A paleta neutra original do modo escuro
(`fundo-superficie`/`fundo-secundario`/`borda-base`/`icone-secundario`/`texto-secundario`)
usava uma escala azul-ardósia (slate). Trocada por uma escala verdadeiramente neutra
(baixíssima saturação, no espírito do dark mode do próprio Claude) —
`fundo-superficie: #262624`, `fundo-secundario: #302f2d`, `borda-base: #46453f`.

**Token novo: `semantic.texto-escuro-fixo`.** Contraparte fixa de `texto-invertido`
(que já não mudava de valor entre temas) — texto SEMPRE escuro (#111827), pra fundos que
continuam claros/saturados em qualquer tema (ex.: Badge/Chip/Toast `warning`,
Badge `accent1`/kiwi). O bug raiz: esses componentes usavam `texto-primario` (que
CORRETAMENTE vira claro no escuro pra texto de página comum) como se fosse "sempre
escuro" — no claro isso por acaso funcionava (texto-primario É escuro lá), no escuro
quebrou (texto-primario virou claro, mas o fundo amarelo/kiwi continuou claro também).
Corrigido em `badge.contract.json`/`chip.contract.json`/`toast.contract.json` (CSS +
`Toast.tsx`/`Chip.tsx`, onde o ícone tinha cor calculada em JS, não só CSS). De brinde,
`Badge`/`Chip` `variant='info'` tinha o MESMO tipo de bug ao contrário: usava
`texto-info` (pensado pra texto, clareia no escuro) como FUNDO sólido — trocado pra
`fundo-info-forte` (a família "-forte", já pensada pra fundo sólido fixo, que
success/error/critical já usavam corretamente).

**Token novo: `semantic.fundo-campo`.** "O fundo dos inputs de forma geral, devem ser
levemente mais escuros que a cor de fundo da página onde estão, para destacar melhor" —
no claro é idêntico a `fundo-superficie` (sem mudança visual), no escuro é um degrau mais
escuro (`#201f1e`) que a própria página. Aplicado ao fundo real de campo em 11
componentes: TextField, Select (trigger, não o dropdown), ComboBox (idem), DatePicker/
TimePicker/DateTimePicker (trigger, não o popover do calendário), Textarea, Otp,
QuantitySelector, Checkbox, Radio — cada um com uma entrada em `decisions` no próprio
contrato.

**Botões — `acao-neutra`/`acao-sutil` reformulados só no escuro.** "A variante neutral
preenchido deve ter o fundo bem mais claro e as letras escuras" → `acao-neutra` virou
quase-branco (#e5e4e1) com `acao-neutra-texto` escuro, só no dark override (claro
inalterado). "A variante subtle preenchido, precisa do fundo apenas um nível mais claro"
→ `acao-sutil` virou um cinza um degrau acima da página (#3a3937). "A variante neutral
outlined precisa que tanto o texto, quanto a borda e os ícones sejam bem claros, quase
brancos" → resolvido de graça pela mesma troca de `acao-neutra`, já que
`outlined.neutral` reaproveita a MESMA variável pra border-color e --btn-text (nenhuma
mudança de código em Button.tsx). **FileUpload** (que usa `<Button variant="neutral"
outlined>` internamente) ficou visível automaticamente, sem nenhuma edição própria.

**Popover.** Nova prop `tone` ('light' padrão | 'dark') — resolve o painel de fundo
escuro do CallControlBar (já em uso desde a rodada anterior), documentado formalmente no
contrato. O bug relatado ("input claro, texto do dropdown escuro") era do PRÓPRIO
`PopoverDemo.tsx` — os dois exemplos usavam `style={{...}}` inline sem `background`/`color`
nenhum, herdando o preto/branco padrão do navegador em vez de acompanhar o tema. Corrigido
com `var(--fundo-campo)`/`var(--texto-primario)` explícitos.

**Modal.** BUG REAL: `.dialog` nunca declarava `background`/`color` próprios — o
`<dialog>` nativo tem fundo branco por padrão no user-agent stylesheet, então o card do
Modal continuava claro mesmo no tema escuro. Adicionados os dois, ambos tokens que já
existiam (só faltava declará-los).

**Drawer / conteúdo livre em geral.** Causa raiz: nenhum reset global definia
`color`/`background` no `<body>` — qualquer texto sem cor própria (ex.: um `<p>` passado
como children pro Drawer) caía no preto padrão do navegador, ignorando o tema. Criado
`src/base.css` (importado uma vez em `main.tsx`) com `html, body { background:
var(--fundo-superficie); color: var(--texto-primario) }` — fixa Drawer e qualquer outro
container de conteúdo livre de uma vez, na raiz do problema.

**Barra de rolagem.** Não vira um componente React formal (scrollbar é renderizada pelo
navegador, não algo que se componha em JSX — um `Scrollbar.tsx` sem props nem
comportamento seria só burocracia). Estilizada globalmente em `base.css` via
`scrollbar-color`/`scrollbar-width` (Firefox) + `::-webkit-scrollbar*` (Chrome/Safari/
Edge), fina e minimalista, usando `borda-inativo`/`icone-secundario` — já reage ao tema
automaticamente, sem token novo.

Testado no navegador, item por item: Badge (info/warning/accent1 legíveis), Chip (mesmos
3), Toast warning (fundo + texto + ícone + botão fechar, todos escuros e legíveis),
Button neutral/subtle/outlined.neutral, FileUpload (botões agora visíveis), Modal (fundo
escuro correto), Drawer (texto do conteúdo claro), Popover (input escuro dentro do
painel claro, menu de ações legível). Confirmado sem regressão no modo claro (Badge/Chip
inalterados visualmente, fundo-campo idêntico a fundo-superficie). Build e typecheck
limpos.

### Modo escuro — 2ª rodada de correção (2026-08-28)

Sete ajustes finos pedidos pelo usuário depois de mais uma rodada de teste.

**1. Fundos ainda muito claros — valores exatos.** Escala neutra da rodada anterior
(`#262624`/`#302f2d`/`#201f1e`) trocada pelos 3 valores exatos pedidos:
`fundo-campo` (mais escuro) `#111111`, `fundo-superficie` (intermediário) `#161616`,
`fundo-secundario` (menos escuro) `#20201F`.

**2 + 3 + 5. Menu selecionado / Tooltip / SelectableCard 'preto' padrão ainda azulados —
mesma causa raiz.** Os 3 reaproveitavam `semantic.fundo-invertido` (#111827, ainda
azul-ardósia, nunca tinha sido neutralizado na rodada anterior porque esse token
deliberadamente NÃO muda de valor entre temas). Neutralizado direto na fonte —
`fundo-invertido: #111111` (mesmo tom mais escuro pedido no item 1) — resolve os 3 de
uma vez: Tooltip, o item ativo da Sidebar do Playground, e `SelectableCard`
`selectedTone='dark'` (o valor padrão). Efeito colateral notado e corrigido de
propósito: com a página agora tão escura quanto `fundo-invertido`, o item ativo da
Sidebar (chrome só do Playground, sem contrato) ficaria quase invisível em vez de se
destacar — trocado pra `acao-primaria`/`acao-primaria-texto` (verde de marca), garantindo
contraste nos dois temas. Tooltip ganhou `box-shadow: sombra-p` pelo mesmo motivo
(fundo-invertido sozinho não bastava mais pra se destacar da própria página no escuro).

**4. Avatar com fundo muito próximo da página.** `fundo-secundario` (usado no círculo de
fallback iniciais/ícone) ficou perto demais da página depois do escurecimento geral —
trocado pra `borda-inativo`, mais claro, ainda neutro.

**6. Ordem de empilhamento do Toast.** Container trocou `flex-direction: column-reverse`
por `column` — a fila já era mantida em ordem cronológica (mais antigo primeiro)
internamente, um flex column comum já renderiza nessa ordem (mais antigo no topo, mais
recente entrando embaixo). Testado com "Disparar 5 toasts": Notificação 1 no topo, 2 e 3
entrando abaixo dela.

**7. Texto do Drawer ainda escuro.** BUG REAL, mesma causa do Modal (já corrigido na
rodada anterior, mas o Drawer tinha o MESMO bug e não tinha sido pego): `<dialog>` nativo
tem `color: CanvasText` no user-agent stylesheet, herdado DIRETO pelos filhos a partir do
próprio `<dialog>` — o reset global de `body` (criado na rodada anterior) nunca alcança
esse elemento, porque a cadeia de herança de `color` começa no `<dialog>` (que já tem seu
próprio valor da UA), não pula direto de `<body>`. Corrigido com `color:
var(--texto-primario)` explícito em `.drawer`, mesmo fix do `.dialog` do Modal.

Testado no navegador, item por item, nos dois temas: fundos mais escuros confirmados
visualmente; Sidebar com item ativo verde (mesma cor nos dois temas); Tooltip com sombra
visível contra o fundo escuro; SelectableCard tom 'Preto (padrão)' neutro; Avatar com
círculo de iniciais destacado da página; Toast com 5 notificações empilhando na ordem
certa (`getComputedStyle` confirmando `color` correto no `<p>` do Drawer, de
`rgb(0,0,0)` pra `rgb(243,244,246)` depois do fix). Sem regressão no modo claro. Build e
typecheck limpos.

### Modo escuro — 3ª rodada (2026-08-28): Avatar regrediu no modo claro

O fix do Avatar (item 4 da rodada anterior) trocou `fundo-secundario` por
`borda-inativo` GLOBALMENTE, sem perceber que `borda-inativo` tem valores bem diferentes
por tema: no escuro (#5c5b54) ficou correto, mas no claro (#9ca3af, bem mais saturado
que o `fundo-secundario` original #f3f4f6) ficou escuro demais — "apenas no modo claro,
o fundo do círculo do avatar com letras e ícone está muito escuro. No modo escuro está
ótimo." Corrigido restringindo a troca só ao modo escuro, via seletor CSS
`[data-theme="dark"] .fallback` — modo claro voltou pra `fundo-secundario` (correto
desde sempre, nunca devia ter mudado), modo escuro continua com `borda-inativo`
(correto). Testado nos dois temas no navegador. Build e typecheck limpos.

### Auditoria de contratos ausentes (2026-08-28)

Pedido do usuário: revisar todas as decisões da sessão pra achar componentes discutidos
mas nunca contratados. Cruzados os 9 itens de "Construir" do `analise-sistemas-legados.md`
+ todos os ~22 átomos/moléculas/organismos da lista original do ROADMAP contra os 63
contratos existentes em `contratos/` — **nenhum gap encontrado**. Os itens da seção "Não
construir agora" (seletor numérico 1-10, dots de progresso, cartão colapsável, carrossel,
visualizador de imagem com zoom, transfer list, checklist inline, gráficos, scrollbar como
componente) são decisões explícitas já fechadas com justificativa registrada, não
pendências. Usuário confirmou: seguir pros Templates/Páginas.

### Redesenho do LoginScreen (2026-08-28)

Primeira página da fila de refinamento de Templates/Páginas. Pedido do usuário: replicar
a ESTRUTURA do padrão real usado hoje nos produtos (anexos 1 e 2 — imagem em tela cheia à
esquerda, formulário à direita, no celular a imagem some e só o formulário fica, ocupando
100% da tela) usando os componentes do harness, com inspiração ESTÉTICA (não estrutural)
dos anexos 3 e 4 (cartão flutuante com cantos arredondados) — sem login social, que os
sistemas reais não têm.

**EXTENSÃO no TextField — nova opção `type='cpf'`.** Motivada diretamente pelo padrão
real (campo de identificação por CPF mascarado, `000.000.000-00`). Mesma técnica já
estabelecida por `type='tel'`: lógica extraída pra `src/components/shared/cpfMask.ts`
(mesmo padrão de `phoneMask.ts`), aplica só dígitos e insere pontuação progressivamente.
CPF não é um type nativo de `<input>` — renderiza como `type='text'` por baixo, com
`inputMode='numeric'`. Sem validação de dígito verificador nesta v1 — TextField mascara o
FORMATO, não valida se é um CPF real (fronteira de responsabilidade já estabelecida em
todo o resto do harness). 2 ícones novos no registro do Icon: `identification-card`
(leftIcon do campo CPF) e `leaf` (marca genérica usada no redesenho).

**LoginScreen reescrito por completo.** Layout split-screen edge-to-edge: painel
esquerdo com um gradiente decorativo nos tons verdes da própria marca (`acao-primaria`/
`acao-secundaria` — sem foto real disponível neste harness, um gradiente abstrato no lugar
de tentar simular uma foto de banco de imagens) + marca (ícone + wordmark genérico
"Portal", não copiando nome/logo real de nenhum cliente) + headline; painel direito
sempre presente, contendo um Card flutuante (`padding='large'`, `elevation='low'`, a
mesma peça que já existia) com o formulário: CPF mascarado (`leftIcon='identification-card'`),
senha (toggle mostrar/ocultar que o TextField já tinha), "Esqueci minha senha" alinhado à
direita, botão "Entrar" cheio. Painel de imagem esconde via `@media (max-width: 768px)`
— mesmo breakpoint convencional, formulário assume 100% da largura/altura no celular.
Escolha de escopo: optei pelo fluxo CPF+senha num passo só (padrão do anexo 2,
"BackOffice") em vez do fluxo de 2 passos do anexo 1 (CPF isolado → próxima tela pede
senha) — mantém a página funcionalmente completa (identificação + autenticação) num só
componente, mesmo escopo que o LoginScreen já tinha antes do redesenho (login+senha).
Se o fluxo de 2 passos for o que o usuário realmente quer, é uma tela nova
(`CpfIdentificationScreen` ou similar), não uma alteração desta.

Testado no navegador: máscara de CPF digitando ao vivo (`123.456.789-09`), validação
nativa `required` bloqueando submit com senha vazia, Alert de erro aparecendo depois de
preencher os dois campos e submeter, breakpoint mobile confirmado via
`window.matchMedia`/`getComputedStyle` (`display:none` no painel de imagem a 375px de
viewport — o preview embutido no Playground fica dentro de um frame menor que o
viewport real do navegador, então redimensionar só o FRAME não aciona o `@media`, que é
sempre relativo ao viewport; comportamento correto pra produção, onde a página ocupa a
tela inteira de verdade), modo escuro sem nenhuma quebra visual. Build e typecheck
limpos.

**AJUSTADO a pedido do usuário (mesmo dia):** usuário pediu um visual mais clean, citando
uma referência com um único cartão flutuante (imagem + formulário dentro do mesmo
contorno arredondado, sem borda cinza separada em volta do formulário) e sem
texto/logo sobrepostos na imagem — a informação necessária já vem embutida na própria
imagem inserida ali. Mudanças: (1) removido o `Card` do painel de formulário — o `Card`
sempre aplica `border: 1px solid var(--borda-base)` (não tem variante sem borda), então
usar `Card` aqui sempre deixaria a borda cinza que o usuário rejeitou; a página passou a
montar o cartão flutuante direto com CSS própria (`.floatingCard`, `--raio-p` +
`--sombra-m`, sem `border`), consistente com o precedente já estabelecido de que
layout de página é responsabilidade da própria página, não do componente; (2) removidos
o logo, o wordmark e a headline que ficavam sobrepostos no painel de imagem — o painel
virou um `<div>` só com o gradiente de fundo, decorativo (`aria-hidden`); (3) fundo da
página passou a usar `--fundo-secundario` (tom neutro) pra dar contraste ao cartão
branco flutuante, igual à referência. No mobile (<768px), o cartão perde o
arredondamento e a sombra e vira tela cheia (fazia sentido manter esse comportamento
igual ao resto do redesenho: sem o painel de imagem, um cartão "flutuante" no meio da
tela não faz sentido visual). Testado nos dois temas e no breakpoint mobile via
`getComputedStyle`. Build limpo.

**AJUSTADO a pedido do usuário (mesmo dia, 2ª rodada):** padding do painel de
formulário aumentado pro maior espaçamento estrutural disponível (`--espaco-xgg`,
64px) pra dar a sensação vazia/clean pedida (16px no mobile, via media query, onde
64px sobraria demais numa tela de 375px). Além disso, o painel de formulário nunca
pode passar de 50% da largura da tela e em monitores grandes deve ficar entre 35% e
40% — antes o `.floatingCard` tinha um teto fixo de 920px, o que já deixava o
formulário bem menor que 50% da tela em qualquer monitor grande, mas por acidente,
não por regra; o teto do cartão flutuante subiu pra 1600px (só pra não esticar demais
em ultrawide) e o painel de formulário passou a ter `flex-basis`/`max-width: 40%`
sempre (nunca mais que isso, então nunca mais que metade da tela em nenhum caso), com
uma media query `min-width: 1440px` estreitando pra 37% especificamente em monitores
grandes. Verificado via `getComputedStyle`/`getBoundingClientRect` em viewport real de
1920px. Build limpo.

**AJUSTADO/BUG REAL corrigido (mesmo dia, playground):** ao clicar em "Ver como
smartphone" apareciam barras de rolagem indesejadas dentro do iframe. Causa raiz: o
`body` global do harness ([base.css](src/base.css)) nunca tinha `margin: 0` — o
reset de 8px padrão do navegador ficava mascarado no shell principal da Playground
(`.shell` força `height:100vh; overflow:hidden`), mas dentro do modo standalone
(`.standalone`, usado pelo iframe) o `overflow:auto` deixava esse respiro de 16px
(8px de cada lado) estourar a largura da viewport e gerar scroll horizontal
desnecessário. Corrigido na raiz — `margin:0` em `html, body` — não é um hack
específico da Playground, é um reset de fato faltando no harness inteiro.
Confirmado via `scrollWidth === clientWidth` dentro do iframe depois do fix, no
LoginScreen e no KanbanTemplate (que tem um scroll horizontal PRÓPRIO e
intencional no board — esse continua existindo, só o scroll indesejado do
documento inteiro sumiu).

**AJUSTADO a pedido do usuário (containers do canvas):** a área de exemplo
(`.canvas` do StoryDetail) tinha padding + borda próprios, e o `.frame` que envolve
todo Template/Página nos arquivos `*Demo.tsx` ([LoginScreenDemo.module.css](src/interface/stories/pages/LoginScreenDemo.module.css),
reaproveitado por todos os outros Demos de Templates/Páginas) também tinha borda +
raio próprios — duas molduras aninhadas com um respiro no meio, sem necessidade.
Removida a borda/raio do `.frame` (o canvas já é a moldura); novo modificador
`.canvasFlush` (só aplicado pra Templates/Páginas, via `isResponsive`) zera o
padding do canvas e liga `overflow: hidden`, deixando o cantos arredondados do
canvas cortarem o `.frame` reto por baixo — resultado: uma moldura só, e o
template/página encosta direto na borda da área de exemplo. Átomos/Moléculas/
Organismos não mudam (canvas normal, com padding). Testado no LoginScreen e no
KanbanTemplate, nos dois modos (desktop e "ver como smartphone"). Build limpo.

**AJUSTADO a pedido do usuário (mesmo dia, 3ª rodada):** confirmado (sem mudança de
código) que o padding do painel de formulário só diminui na media query mobile
(`<=768px`, `--espaco-g`) — em nenhum outro breakpoint (nem o de 1440px, que só mexe em
`flex-basis`/`max-width`) o padding muda; testado a 320px de viewport real sem overflow
horizontal.

### Playground — botões de "abrir em nova página" e "simular smartphone" (2026-08-28)

Pedido do usuário: nas seções de Templates e Páginas, a área de exemplo (canvas) do
`StoryDetail` ganhou uma barra de ferramentas no canto superior direito com 2 botões,
visíveis só para esses dois grupos (`RESPONSIVE_GROUPS` em
[StoryDetail.tsx](src/interface/stories/StoryDetail.tsx)) — Átomos/Moléculas/Organismos
não mudam.

**Botão 1 — "Abrir em nova página".** Abre `?standalone=<id-do-story>` numa aba nova
(`window.open`). Novo modo em [App.tsx](src/interface/App.tsx): se a URL tiver esse
parâmetro, a página renderiza só `<story.Demo />` (mesmo componente de preview já
existente), sem sidebar nem nenhum chrome da Playground — só o exemplo, ocupando a aba
inteira, com o tema (claro/escuro) preservado via `localStorage` (mesma chave que
`useTheme` já usa).

**Botão 2 — "Ver como smartphone" / "Ver como desktop" (toggle único).** EXTENSÃO
motivada por uma limitação técnica já documentada nesta mesma seção do ROADMAP (ver
entrada do LoginScreen, "confusão de frame vs. viewport"): `@media` só reage à largura
real de uma *viewport*, e o canvas embutido na Playground é só uma `div` — encolhê-la
NÃO aciona os breakpoints responsivos de verdade. A solução correta é um **iframe**, que
tem sua própria viewport isolada: no modo "smartphone", o canvas passa a renderizar um
`<iframe src="?standalone=<id>">` com largura fixa de 390px (`.deviceFrame` em
[StoryDetail.module.css](src/interface/stories/StoryDetail.module.css)) — como é uma
viewport real de 390px, o `@media (max-width: 768px)` do LoginScreen (por exemplo)
dispara de verdade dentro do iframe, mesmo a página da Playground estando bem mais
larga. No modo "desktop" (padrão), o canvas volta a renderizar `<Demo />` direto, sem
iframe, igual a antes.

2 ícones novos no registro do Icon: `desktop` e `device-mobile` (Phosphor `Desktop` /
`DeviceMobile`), usados só nesse toggle.

Testado no navegador: toolbar aparece em LoginScreen e KanbanTemplate (Templates e
Páginas), some em Icon (Átomos); toggle "smartphone" no LoginScreen mostra
corretamente o painel de imagem escondido (confirmando que o iframe aciona o breakpoint
real); "abrir em nova página" navegado diretamente pra
`?standalone=login-screen` renderiza a página isolada, sem sidebar, sem erros. Build
limpo.

**BUG REAL corrigido em teste no navegador — 2 problemas no "Ver como smartphone" do
KanbanTemplate:**

1. **Scroll vertical externo indesejado.** Causa raiz: cada `*Demo.tsx` de
   Templates/Páginas envolve o componente real num `.frame` (compartilhado via
   [LoginScreenDemo.module.css](src/interface/stories/pages/LoginScreenDemo.module.css))
   com uma altura FIXA em pixels passada por `style` inline (ex.: `720` no
   KanbanTemplateDemo/DashboardTemplateDemo) — necessária só pra o preview ter uma
   altura concreta dentro do canvas que rola a página inteira da Playground. Dentro
   do iframe de "ver como smartphone" (390×700), essa altura fixa de 720px não bate
   com os 700px reais do iframe, sobrando 20px que criavam um scroll vertical no
   `<html>` do iframe — chegando a aparecer como uma barra extra "por fora" do
   cartão do celular. Corrigido com um novo modo `data-standalone` marcado em
   `<html>` por [App.tsx](src/interface/App.tsx) sempre que a página está rodando
   via `?standalone=<id>` (usado tanto pelo iframe quanto pela aba de "abrir em
   nova página"): `html[data-standalone] .frame { height: 100% !important; }` — o
   `!important` é necessário só aqui, pra vencer a altura fixa inline que cada Demo
   passa; fora do modo standalone, nada muda (canvas embutido na Playground continua
   igual). Confirmado via `scrollHeight === clientHeight` dentro do iframe.

2. **Modo escuro não propagava pro conteúdo do celular simulado.** O iframe é um
   documento à parte, com seu próprio `useTheme()` que só lê o tema do
   `localStorage` uma vez, no mount — alternar claro/escuro no shell principal da
   Playground não reflete automaticamente num iframe já carregado (não há troca de
   mensagens entre os dois documentos). Corrigido incluindo o tema atual na `key`
   do `<iframe>` em [StoryDetail.tsx](src/interface/stories/StoryDetail.tsx)
   (`theme` agora é uma prop de `StoryDetail`, passada por `App.tsx`) — trocar de
   tema força o React a desmontar e remontar o iframe, recarregando a página do
   zero já com o `localStorage` atualizado. Testado no navegador: alternando
   claro/escuro com o KanbanTemplate em modo "ver como smartphone", tanto o fundo do
   canvas quanto o conteúdo dentro do celular simulado acompanham o tema.

Build limpo.

**BUG REAL corrigido em teste no navegador — 2 problemas relatados pelo usuário
testando "Abrir em nova página" na LoginScreen:**

1. **Conteúdo centralizado com espaço vazio demais em vez de ocupar a tela.** O
   `.floatingCard` do [LoginScreen](src/interface/screens/LoginScreen/LoginScreen.module.css)
   não tinha `height` própria — só crescia até a altura natural do conteúdo do
   formulário (~576px). Isso passava despercebido no preview embutido da Playground
   (canvas de ~640px de altura, então a diferença era pequena), mas numa aba real de
   verdade, numa tela de 1080px+ de altura, sobrava mais de 400px de fundo escuro vazio
   em cima e embaixo do cartão — só visível de fato ao testar "abrir em nova página"
   pela primeira vez numa tela cheia real. Corrigido com `height: min(760px, 100%)` —
   o cartão cresce até preencher boa parte de uma tela cheia sem esticar o
   FORMULÁRIO em si (o painel de imagem, que já estica via flex pra acompanhar a
   altura do cartão, absorve o espaço extra). Testado a 1920×1080: o cartão agora
   ocupa a maior parte da tela, sem a folga excessiva de antes.

2. **"Abrir em nova página" não garantia abrir numa aba nova.** O botão chamava
   `window.open(url, "_blank", "noopener,noreferrer")` — passar uma string de
   `windowFeatures` (mesmo só com tokens de segurança, sem width/height) pode levar
   navegadores a tratar a chamada como popup/navegação em vez de aba nova dependendo
   do contexto. Trocado por um `<a href={url} target="_blank" rel="noopener
   noreferrer">` de verdade, estilizado igual ao botão anterior — é o jeito nativo do
   navegador garantir abertura em aba nova, sem ambiguidade de popup blocker.

Build limpo.

**AJUSTADO a pedido do usuário — removido o cartão flutuante.** Mesmo com a altura
corrigida (`min(760px, 100%)`), o usuário testou de novo numa aba real e viu que
continuava sendo "um elemento centralizado" — queria a tela SENDO a própria página,
sem margem nenhuma entre ela e a borda da tela. Voltamos à estrutura edge-to-edge
original (anexos 1 e 2, primeira versão do redesenho): removida a `<div
className={styles.floatingCard}>` que envolvia imagem+formulário — agora
`.imagePanel`/`.formPanel` são filhos diretos de `.page`/`.pageEmbedded`, sem
`border-radius`, `box-shadow`, `max-width` ou padding na página. Mantido tudo o resto
já validado nas rodadas anteriores: painel de imagem sem logo/texto, CPF mascarado,
padding generoso dentro do formulário (`--espaco-xgg`), formulário nunca passando de
40%/37% da largura real da tela, breakpoint mobile (imagem some abaixo de 768px).
Verificado via `getBoundingClientRect`: `top/left/right/bottom` = 0 em relação à
viewport (zero margem). Build limpo.

### Mesma estrutura do LoginScreen aplicada a 5 Páginas (2026-08-28)

Pedido do usuário: aplicar a mesma estrutura/lógica do LoginScreen (split-screen
edge-to-edge, sem cartão flutuante, sem `Card`, painel de imagem decorativo à
esquerda sem logo/texto, painel de formulário à direita nunca passando de 40%/37%
da tela, padding generoso `--espaco-xgg`, breakpoint mobile <768px escondendo a
imagem) em [ForgotPasswordScreen](src/interface/screens/ForgotPasswordScreen/ForgotPasswordScreen.tsx),
[ResetPasswordScreen](src/interface/screens/ResetPasswordScreen/ResetPasswordScreen.tsx),
[SignUpScreen](src/interface/screens/SignUpScreen/SignUpScreen.tsx),
[TwoFactorScreen](src/interface/screens/TwoFactorScreen/TwoFactorScreen.tsx) e
[OnboardingScreen](src/interface/screens/OnboardingScreen/OnboardingScreen.tsx).

Cada página manteve 100% da própria lógica de negócio (campos, validação, estados de
erro/sucesso) — só a casca de layout mudou: removido `Card` (não tem variante sem
borda, mesmo motivo já documentado na entrada do LoginScreen), removida a
centralização em página inteira, adicionado o painel de imagem decorativo (mesmo
gradiente verde da marca) e a marca "Portal" (ícone + wordmark) no topo do
formulário. CSS duplicado propositalmente entre os 6 `*.module.css` de
Páginas — mesma decisão de "sem dedup prematuro" já registrada nas memórias do
projeto; contratos de página continuam não existindo (páginas não são componentes).

Duas variações de conteúdo mantidas onde fazia mais sentido que fugir do padrão:
`SignUpScreen` (formulário mais longo) já dependia do `overflow-y: auto` do
`.formPanel` pra rolar por dentro sem quebrar o layout — testado, funciona sem
ajuste extra; `TwoFactorScreen` manteve o conteúdo centralizado (`.content` com
`align-items: center`, título/subtítulo com `text-align: center`) porque um código
OTP centralizado lê melhor que alinhado à esquerda — mesma exceção estética que o
resto do harness já tolera caso a caso; `OnboardingScreen` manteve `max-width: 480px`
no `.content` (mais largo que os 360px dos formulários) pra caber os 3 passos do
Wizard confortavelmente.

Testado no navegador: as 5 páginas renderizam corretamente no preview do canvas
(Templates/Páginas) e no modo "ver como smartphone" (painel de imagem some, form
ocupa 100%). Build limpo.

**AJUSTADO a pedido do usuário (mesmo dia) — removido o logo, adicionado botão de
voltar em 4 das 5 páginas.** A marca "Portal" (ícone + wordmark) saiu de todas as 5
páginas — não fazia sentido repetir a marca em cada etapa do fluxo de auth.
Em [ForgotPasswordScreen](src/interface/screens/ForgotPasswordScreen/ForgotPasswordScreen.tsx),
[ResetPasswordScreen](src/interface/screens/ResetPasswordScreen/ResetPasswordScreen.tsx),
[SignUpScreen](src/interface/screens/SignUpScreen/SignUpScreen.tsx) e
[TwoFactorScreen](src/interface/screens/TwoFactorScreen/TwoFactorScreen.tsx), no
lugar do logo entrou um botão "Voltar" (`variant="link"`, `leftIcon="arrow-left"`),
alinhado à esquerda no topo do formulário — inclusive no TwoFactorScreen, cujo
conteúdo é centralizado (`align-items: center`): o botão usa `align-self:
flex-start` só nele pra ficar à esquerda mesmo com o resto centralizado.
`OnboardingScreen` não ganhou botão de voltar (não foi pedido — é uma etapa
posterior ao login, sem "voltar" óbvio no fluxo) — só perdeu o logo mesmo.

**EXTENSÃO no Icon** — novo ícone `arrow-left` (Phosphor `ArrowLeft`) no registro
fechado, consumidor real: o botão "Voltar" dessas 4 páginas. Simétrico ao
`arrow-right` que já existia (usado no botão "Entrar" do LoginScreen).

Testado no navegador nas 4 páginas com botão de voltar e na OnboardingScreen (sem
logo, sem botão). Build limpo.

### SignUpScreen em 2 passos, ForgotPasswordScreen sem link redundante, 2 páginas novas de status (2026-08-28)

Pedido do usuário, 3 ajustes:

**1. [SignUpScreen](src/interface/screens/SignUpScreen/SignUpScreen.tsx) virou um
fluxo de 2 passos.** Reaproveitado o `Wizard` (mesmo componente já usado no
`OnboardingScreen`, com `Stepper` + navegação Anterior/Próxima embutidas) em vez de
inventar uma máquina de passos própria. Passo 1 ("Seus dados"): nome, e-mail e CPF
(`TextField type="cpf"`, mesmo padrão do LoginScreen — novo `leftIcon`, sem
`autoComplete` porque não é login). Passo 2 ("Senha"): senha + `PasswordStrengthMeter`
+ confirmação + aceite de termos. `validateStep` do Wizard valida cada passo antes de
avançar (passo 1: os 3 campos preenchidos; passo 2: senha ≥8 caracteres, senha ==
confirmação, termos aceitos) — sem isso o Wizard deixaria avançar de passo mesmo com
campo vazio, já que "Próxima etapa" não é um `type="submit"` dentro de um `<form>`
(a validação nativa HTML5 `required` não entra em ação aqui).

**2. Removido o botão "Voltar para o login" do rodapé do
[ForgotPasswordScreen](src/interface/screens/ForgotPasswordScreen/ForgotPasswordScreen.tsx).**
Ficava redundante com o botão "Voltar" que já existe no topo da página (adicionado na
rodada anterior).

**3. Duas páginas novas, mesmo modelo split-screen do LoginScreen — mensagens de
status genéricas, reaproveitáveis por qualquer fluxo (não só auth):**

- [SuccessScreen](src/interface/screens/SuccessScreen/SuccessScreen.tsx) — ícone
  `check-circle` em `--icone-sucesso`, título/descrição/label do botão configuráveis
  via props (com defaults genéricos), `onAction` delegado ao consumidor. Conteúdo
  centralizado (mensagem de status, não formulário) — mesmo tratamento que o
  TwoFactorScreen já usa quando o conteúdo não é uma lista de campos.
- [ConnectionErrorScreen](src/interface/screens/ConnectionErrorScreen/ConnectionErrorScreen.tsx)
  — ícone `warning-circle` em `--icone-erro`, botão "Tentar novamente" que simula
  ~900ms de loading (`Button state="loading"`) antes de chamar `onRetry` — só pra
  demonstrar visualmente o estado de carregamento do botão nesta demo sem backend
  real, igual ao resto do harness (ex.: `Wizard`'s `validating`). Deliberadamente
  DIFERENTE do `ErrorScreen` já existente (404/500, layout centralizado simples, sem
  painel de imagem) — aquele é pra erro de rota/servidor; este é pra falha
  transitória de conexão, no mesmo modelo visual das páginas de auth (split-screen).
  Ambos continuam existindo, cada um pro seu caso de uso.

Corrigidas também as listas `dependencies` desatualizadas no `registry.ts` de
LoginScreen/ForgotPasswordScreen/ResetPasswordScreen/SignUpScreen/TwoFactorScreen/
OnboardingScreen, que ainda citavam `Card` (removido faz 2 rodadas, quando o cartão
flutuante virou edge-to-edge).

Testado no navegador: fluxo completo do SignUpScreen (passo 1 → validação → passo 2
→ "Criar conta"), ForgotPasswordScreen sem o link duplicado, SuccessScreen e
ConnectionErrorScreen (incluindo o clique em "Tentar novamente"). Build limpo.

### DatePicker/TimePicker/DateTimePicker — ícone à esquerda vira opcional (2026-08-28)

Pedido do usuário: os 3 pickers de data/hora devem poder exibir ou não um ícone
(calendário/relógio) fixo à esquerda do campo.

**REVISADO** — o [date-picker.contract.json](contratos/date-picker.contract.json)
tinha uma decisão explícita registrada dizendo que o Icon 'calendar' era "sempre
presente, não configurável", diferente do `leftIcon` opcional do TextField. Essa
decisão foi revertida a pedido do usuário: nova prop `showIcon` (default `true`,
preserva o comportamento visual de quem já usa o componente) em
[DatePicker](src/components/DatePicker/DatePicker.tsx),
[TimePicker](src/components/TimePicker/TimePicker.tsx) e
[DateTimePicker](src/components/DateTimePicker/DateTimePicker.tsx).

TimePicker e DateTimePicker não tinham NENHUM ícone à esquerda até agora (só o
caret-down decorativo à direita) — ganharam um pela primeira vez, já nascendo
opcional: TimePicker usa o novo Icon `clock` (Phosphor `Clock`, adicionado ao
registro fechado do Icon — antes só existia em outros componentes de horário
indiretamente, nunca como ícone de campo); DateTimePicker reaproveita o `calendar`
que o DatePicker já usa (não existe um ícone combinado data+hora no registro, e criar
um agora seria antecipar sem um pedido explícito por ele).

Implementação idêntica nos 3: `showIcon` só controla a renderização condicional do
`<Icon>` fixo (mesma cor condicional de sempre — `--icone-inativo` quando
`disabled`, `--icone-secundario` nos demais estados) — não mexe em `showPicker`,
máscara, popover ou nenhum outro comportamento. Prop propagada nos dois branches
(campo único e range) dos 3 componentes.

**Autoauditoria contra os 3 contratos:** tokens de cor do ícone continuam dentro da
whitelist `tokensAllowed.iconColor` já existente nos 3 (`semantic.icone-secundario`,
`semantic.icone-inativo`) — nenhum token novo fora da lista. Nenhum estado novo
adicionado. a11y não muda (ícone já era `decorative` nos 3). Nenhuma divergência
encontrada.

Demos atualizados (DatePickerDemo/TimePickerDemo/DateTimePickerDemo) com uma seção
`showIcon=false` cada, mesmo padrão das seções `showPicker=false` já existentes.
Testado no navegador nos 3 componentes — ícone aparece por padrão, some com
`showIcon={false}`, sem afetar mais nada do campo. Build limpo.

### Painel de imagem das 8 Páginas de auth — foto real em vez do gradiente (2026-08-28)

Pedido do usuário: trocar o gradiente decorativo do `.imagePanel` (presente em
LoginScreen, ForgotPasswordScreen, ResetPasswordScreen, SignUpScreen,
TwoFactorScreen, OnboardingScreen, SuccessScreen e ConnectionErrorScreen) por uma
foto de pessoas da terceira idade com traços latinos/brasileiros, fazendo algo
cotidiano e alegre, passando a ideia de saúde e bem-estar — buscada num serviço tipo
placehold.it.

**Primeira tentativa (revertida) — LoremFlickr.** Serviço de imagem-placeholder por
tag (`loremflickr.com/W/H/tag1,tag2`), a família mais próxima de "placehold.it mas
com foto real" que existe sem precisar de API key. Testado com tags como
`senior,brazil`/`senior,latina`/`grandmother,brazil` — todas resolviam pra uma URL
de foto real (não caíam no fallback "sem resultado" do serviço), então parecia
funcionar. Só depois de aplicar nas 8 páginas e olhar o resultado renderizado é que
ficou claro que a busca por tag do Flickr não tem curadoria nenhuma: o LoginScreen
mostrou uma dupla de patinação artística, o SignUpScreen mostrou uma foto de um
cartaz de protesto político sobre reforma da saúde nos EUA — nada a ver com o
pedido, e o segundo caso especificamente incompatível com o tom do harness. BUG REAL
visto testando no navegador.

**Solução — fotos do Unsplash escolhidas e conferidas visualmente uma a uma.** Em
vez de confiar em busca por tag automática, usei o navegador pra pesquisar no
Unsplash (`idosos brasileiros felizes saúde`, `idosos latinos dançando felizes`,
etc.), ler o `alt` de cada resultado (a maioria já vem descrito em PT: "Casal de
idosos feliz sorrindo...") e abrir a imagem em tamanho real antes de decidir usar —
só entrou no harness o que eu de fato vi e confirmei bater com o pedido (casal
latino idoso, expressão alegre, cenário de jardim/casa). 5 fotos aprovadas,
repetidas em algumas das 8 páginas (dado o volume de fotos genuinamente boas
encontradas, repetir foi mais responsável do que arriscar mais tentativas
às-cegas por tag).

`.imagePanel` de cada uma das 8 páginas trocou de `background: <gradientes>` pra
`background: url("https://images.unsplash.com/photo-...")`, mesmo `flex`/`min-width`
de antes — nenhuma outra mudança estrutural. `w=1200&q=80&fm=jpg&fit=crop&auto=format`
nos parâmetros da URL pra já pedir a imagem num tamanho/qualidade adequados ao uso
(painel de tela cheia) em vez do tamanho original de vários MB.

Testado no navegador (LoginScreen, SignUpScreen, TwoFactorScreen): fotos corretas
carregando depois de um pequeno atraso de rede esperado pra imagem externa. Build
limpo.

### Mesma foto (casal abraçado) em todas as 8 páginas — link do usuário era Unsplash+ pago (2026-08-28)

Pedido do usuário: usar uma foto específica que ele linkou (Unsplash, "Um casal de
idosos afetuosos apaixonados em pé dentro de casa, abraçados") nas 8 páginas.

**Bloqueio real, sinalizado antes de agir:** a foto linkada é **Unsplash+**, paga e
licenciada pela Getty Images — a própria página mostra o preview com marca d'água
e o botão de download bloqueado atrás de assinatura ("Faça o upgrade para
Unsplash+"). Sem uma licença eu não posso embutir esse arquivo no harness (é
conteúdo protegido por direitos autorais, não uma imagem de banco gratuito).
Perguntei ao usuário como preferia seguir; a resposta foi buscar uma foto
GRATUITA parecida.

**Substituta escolhida:** ["Um casal mais velho se abraçando na frente de um
arbusto"](https://unsplash.com/pt-br/fotografias/um-casal-mais-velho-se-abracando-na-frente-de-um-arbusto-V7qW7-yaJPA)
(Junior Reis, fotógrafo brasileiro, licença gratuita padrão do Unsplash, "Baixar
gratuitamente" sem bloqueio nenhum) — mesmo espírito da foto original (casal
idoso, abraço afetuoso e carinhoso, olhos fechados, testa encostada) e visual
latino/brasileiro forte (o próprio fotógrafo é brasileiro). Confirmado
visualmente antes de usar, mesmo processo já estabelecido na rodada anterior.

Essa MESMA foto agora está nas 8 páginas (LoginScreen, ForgotPasswordScreen,
ResetPasswordScreen, SignUpScreen, TwoFactorScreen, OnboardingScreen,
SuccessScreen, ConnectionErrorScreen) — antes cada uma tinha uma foto diferente
da mesma "família" temática; agora é uma foto só, repetida, pra dar consistência
visual mais forte entre as telas do fluxo de auth/status (pedido explícito do
usuário: "use a imagem... para as páginas citadas anteriormente"). Testado no
navegador (LoginScreen, ConnectionErrorScreen). Build limpo.

**AJUSTADO a pedido do usuário (mesmo dia) — trocada de novo.** Usuário indicou uma
segunda foto do Unsplash, ["Casal de idosos sorrindo enquanto olha para o laptop
juntos"](https://unsplash.com/pt-br/fotografias/casal-de-idosos-sorrindo-enquanto-olha-para-o-laptop-juntos-XIdcEnBVHfI)
(Vitaly Gariev) — confirmada como gratuita ("Baixar gratuitamente", Licença Unsplash
padrão, sem bloqueio) antes de usar. Substituiu a foto do abraço nas 8 páginas
(LoginScreen, ForgotPasswordScreen, ResetPasswordScreen, SignUpScreen,
TwoFactorScreen, OnboardingScreen, SuccessScreen, ConnectionErrorScreen). Testado no
navegador (LoginScreen). Build limpo.

### NavBar multi-nível + responsivo, e novo componente SideNav (2026-08-28)

Pedido do usuário: faltavam versões de menu com o topo horizontal e lateral, cada
uma em versão de um nível só e multi-nível (até 4), com colapso responsivo. Antes de
codar, 4 decisões fechadas com o usuário (ver `AskUserQuestion`): (1) dois
componentes separados (NavBar + SideNav novo), não um só com `orientation`; (2) no
SideNav, multi-nível vira árvore indentada expansível (não flyout lateral); (3) no
NavBar, multi-nível vira dropdown em cascata (não mega-menu); (4) o colapso
responsivo dos dois reaproveita o Drawer que já existe no harness.

**[NavBar](contratos/navbar.contract.json) — REVISA duas decisões antigas
já documentadas como "lacuna conhecida".** `items` agora é uma árvore recursiva
(`children?`), validada em tempo de erro até 4 níveis
([NavBar.tsx](src/components/NavBar/NavBar.tsx)). Item com filhos vira um
`<button aria-haspopup="menu" aria-expanded>` que abre um dropdown ancorado via
`@floating-ui/react` (mesmo padrão de Select/DatePicker/Breadcrumb — `useClick` +
`useDismiss`, sem hover-intent); nível 1 abre abaixo do gatilho
(`placement: bottom-start`), níveis 2-4 abrem em cascata à direita do nível anterior
(`right-start`) — componente recursivo (`NavBarDropdown` chama a si mesmo pro
próximo nível). Abaixo de 768px, a lista de itens some e um botão de hambúrguer
abre um `Drawer` (reaproveitado, não reimplementado) com a MESMA árvore, só que
renderizada como árvore vertical expansível (`MobileGroup`, mesmo padrão do
SideNav) em vez de dropdown — cascata não cabe num painel estreito.

**[SideNav](contratos/side-nav.contract.json) — componente NOVO.** Não existia
menu lateral persistente no harness (só um Sidebar interno da própria Playground,
que não é um componente do design system). `items` é a mesma árvore recursiva
(`{ key, label, href?, icon?, active?, children? }`), item com filhos vira um
botão expansível reaproveitando EXATAMENTE o padrão de estado do Accordion
(`openKeys`/`onOpenKeysChange`, controlado) — cada nível indenta um passo a mais
(`padding-left: var(--espaco-m)` recursivo). Item-folha é o átomo Link (com `leftIcon`
opcional), ativo ganha `aria-current=page` + destaque de fundo
(`acao-primaria-transparente` no `<li>`) — a cor de texto/ícone continua sendo a que
o próprio Link já aplica no estado `current`, SideNav não sobrescreve. `width`
small/medium/large (200/248/296px, mesmo vocabulário de tamanho do Drawer, valores
menores). `header`/`footer` são slots livres (mesma filosofia de `brand`/`actions`
da NavBar). Mesmo colapso em Drawer abaixo de 768px que a NavBar.

**Autoauditoria contra os 2 contratos:** 1 divergência real encontrada e corrigida —
o contrato do SideNav descrevia o item ativo com "texto/ícone acao-primaria", mas a
implementação usa a cor que o próprio Link já aplica no estado `current`
(`acao-link-texto-sobreposto`) — só o FUNDO do `<li>` usa `acao-primaria-transparente`.
Corrigido o contrato (anatomy, tokensAllowed.text/iconColor, a11y.contrastMin) pra
bater com a implementação real, em vez de mudar o código pra inventar uma cor
própria onde o harness já tem uma decisão estabelecida (NavBar já documenta esse
mesmo racional: cor de link ativo é governada pelo próprio átomo Link). Nenhuma
outra divergência — tokens, estados e a11y batem com os 2 contratos.

Testado no navegador: dropdown em cascata até o 4º nível no NavBar (desktop),
colapso em Drawer com árvore expansível até o 4º nível (mobile, 375px — inclusive
achado e descartado um falso-positivo de teste, onde eu tinha clicado sem querer no
gatilho desktop escondido via CSS em vez do gatilho de dentro do Drawer, o que abria
um popover órfão fora do Drawer; reproduzido, identificado a causa real, e
confirmado que o componente em si funciona certo clicando dentro do `<dialog>`
correto); SideNav flat (1 nível, com Icon) e em árvore (4 níveis) nos dois temas.
Build limpo.

### NavBar/SideNav — paleta branco/verde, e SideNav ganha trilho recolhido com hover-expand (2026-08-28)

Pedido do usuário, 2 ajustes nos componentes de menu criados na rodada anterior.

**1. Paleta de cor dos itens.** Antes de mexer, perguntei se "branco" implicava
também mudar o FUNDO do NavBar/SideNav pra escuro (senão texto branco sumiria
contra o fundo claro do modo claro) — usuário confirmou que o fundo continua
acompanhando o tema normalmente, só a cor do texto muda. Resolvido com
`texto-primario` em repouso (já é quase-branco no modo escuro, tom neutro escuro
no modo claro — o MESMO token, sem duplicar lógica de tema) e `acao-primaria`
(verde, igual nos dois temas) pro item ativo/hover — REVISA a paleta anterior
(`acao-link-texto`/`-sobreposto`, herdada do átomo Link).

Como reaplicar essa cor sem tocar no átomo Link (cor fixa por contrato, sem prop
de override) nem violar o `forbidden` de "não reimplementar o link fora do átomo
Link": a cor é reafirmada por CIMA do Link via seletor CSS de maior especificidade
dentro do próprio NavBar/SideNav (`.nav a`, `.dropdown a`, `.item a`) — Link
continua 100% intacto (href, foco, aria-current, semântica), só a pintura visual
é reafirmada pelo contexto (mesmo espírito do fix de fonte do popover do
Breadcrumb já documentado). Pro ÍCONE dentro do Link (leftIcon), a mesma técnica
funciona mas por um motivo técnico diferente e interessante: o Icon/Phosphor passa
a cor como **atributo de apresentação SVG** (`fill="var(...)"`), não como estilo
inline — atributos de apresentação têm a prioridade MAIS BAIXA de todo o cascade
CSS, perdendo pra qualquer regra normal de folha de estilo (nem precisa de
`!important`). Confirmado no navegador via `getComputedStyle`: ícone padrão
`rgb(243,244,246)` (texto-primario escuro) e ícone do item ativo
`rgb(22,129,74)` (acao-primaria) — a técnica funciona.

**2. SideNav — modo recolhido (collapsed/onCollapsedChange).** Novo par de props
(a presença de `onCollapsedChange` é o que ATIVA o recurso inteiro — mesmo
racional de actionLabel/onAction do EmptyState). `collapsed=true` vira um trilho
de 64px só com os ícones do 1º nível (item com filhos vira um ícone
NÃO-interativo — achatar níveis profundos no trilho deixaria itens sem ícone
próprio como espaços vazios sem sentido). Passar o mouse OU focar (Tab) em cima
do trilho abre o painel completo (mesmo `<nav>` normal, mesma largura de `width`)
ancorado na borda do trilho via `position:absolute`, flutuando por cima do
conteúdo sem empurrar o layout; tirar o mouse/foco fecha de novo — reaproveita
100% a árvore/lógica de expansão já existente (não duplica nada), só muda a
posição de renderização. Foco (`onFocus`/`onBlur` no wrapper), não só hover do
mouse, porque um recurso só-mouse deixaria o painel completo inacessível por
teclado — adicionado como requisito explícito em `forbidden`.

Testado no navegador: NavBar (raiz e dropdown em cascata) e SideNav (flat e
árvore) com item padrão branco/neutro e ativo verde, nos dois temas; SideNav
recolhido — trilho com 3 ícones (só 1º nível), hover abre o painel completo por
cima do "conteúdo da página ao lado" sem deslocar o layout, tirar o mouse fecha
de volta pro trilho. Contratos atualizados (tokensAllowed, anatomy, a11y,
forbidden, decisions) nos dois — nenhuma divergência encontrada na autoauditoria
desta rodada. Build limpo.

### SideNav — polish visual inspirado nas referências anexadas (2026-08-28)

Pedido do usuário: 3 imagens de referência (sidebars tipo "Yorigo Lab" e
"Untitled UI") pra inspirar a estética do SideNav.

**O que mudou no componente em si (CSS, sem mudança de contrato/prop):** raio das
"pílulas" de item (ativo, hover, cabeçalho de grupo, ícone do trilho) subiu de
`raio-pp` (8px) pra `raio-p` (12px) — mais arredondado, mais perto do visual das
referências; item-folha inativo ganhou fundo sutil no hover (`fundo-secundario`,
antes só a cor do texto mudava); botão de recolher/expandir perdeu a borda
(ícone solto com hover, mais discreto, como nas referências). Nenhum token novo
fora da whitelist já existente — só reaproveitou tokens que o contrato já
permitia.

**O que mudou só na demo (composição via os slots `header`/`footer`, que já
eram — e continuam sendo — 100% livres, sem mudança de contrato):** as
referências mostram um cabeçalho tipo "workspace switcher" (logo + nome + URL) e
um rodapé com cartão de perfil (avatar + nome + e-mail) que abre um menu de
conta ao clicar. Isso NÃO virou prop nova do SideNav — é só uma composição de
exemplo no [SideNavDemo.tsx](src/interface/stories/organisms/SideNavDemo.tsx)
reaproveitando componentes que já existem (Avatar, StackedText, Popover, Icon),
demonstrando o padrão recomendado sem o SideNav precisar saber nada sobre o que
tem dentro de header/footer — mesma filosofia de slot livre já documentada no
contrato. O menu do Popover (My profile / Account settings / Device management /
Log out) replica a estrutura das referências, com o item "ativo" em
`fundo-invertido`/`texto-invertido` (mesmos tokens fixos já usados em
Badge/CallControlBar no modo escuro).

Testado no navegador nos dois temas: header com selo verde + nome/URL, cartão de
perfil abrindo o Popover com o menu de conta corretamente posicionado acima do
gatilho. Build limpo.

### SideNav — botão de recolher ao lado do logo, avatar sozinho no trilho (2026-08-28)

Pedido do usuário, 2 ajustes finos no modo recolhido/expandido:

**1. Botão de recolher/expandir na mesma linha do logo.** Antes ficava numa
linha própria acima do header (`overlayToggleRow`, só o botão, alinhado à
direita). Agora `header` e o botão dividem uma linha só (`headerRow`, flex
space-between) — logo à esquerda, botão à direita, exatamente como nas
referências anexadas na rodada anterior. Só vale pro painel expandido/overlay;
o trilho recolhido mantém o botão sozinho no topo (não tem header ali), e o
Drawer mobile mostra o header sozinho, sem o botão (recolher não é um conceito
mobile).

**2. footerCollapsed — nova prop.** O footer normal (ex.: cartão de perfil
completo com nome/e-mail/chevron) nunca coube no trilho de 64px, então sempre
sumia lá — mas o usuário queria que pelo menos o Avatar continuasse visível.
Como `footer` é um ReactNode livre, o SideNav não tem como saber "qual pedaço
é só o avatar" pra recortar sozinho — em vez de tentar adivinhar, nova prop
`footerCollapsed` deixa o consumidor decidir explicitamente o que aparece no
rodapé do trilho (tipicamente `<Avatar .../>` sozinho, sem o cartão inteiro).
Fixado embaixo do trilho via `margin-top:auto` (mesmo truque de
header/body/footer do painel normal). Sem essa prop, nada muda — o rodapé
simplesmente não aparece no trilho, comportamento de antes.

**Autoauditoria pegou 1 divergência da rodada anterior:** o polish visual
(raio-p em vez de raio-pp nas pílulas) nunca tinha sido refletido no
`tokensAllowed.radius` do contrato — só listava raio-pp. Corrigido agora.

Testado no navegador: painel expandido mostra o botão `<` ao lado do logo;
trilho recolhido mostra o botão `>` sozinho no topo e o Avatar "TR" sozinho
embaixo; hover no trilho abre o overlay com header+botão na mesma linha. Build
limpo.

### SideNav — hover e ativo unificados em verde sólido + texto branco (2026-08-28)

Pedido do usuário: hover E selecionado precisam ter fundo verde e texto/ícone
branco, hover incluindo os itens "pai" de submenu (groupHeader — antes só tinham
hover cinza neutro, sem relação com a paleta verde do resto).

**REVISA a decisão de cor da rodada anterior** (fundo verde translúcido só no
ativo, texto verde no ativo/hover, fundo cinza neutro no hover comum) — agora
hover e ativo são o MESMO tratamento: fundo `acao-primaria` SÓLIDO (não mais
transparente) + texto/ícone `texto-invertido` (branco fixo, mesmo token de
Badge/CallControlBar no modo escuro). Vale pros 3 níveis de renderização
(painel expandido/overlay, cabeçalho de grupo, trilho recolhido).

Mudança estrutural: o fundo saiu do `<li>` (classe `.itemActive`, que foi
removida do componente) e foi pro próprio `<a>` (agora `width:100%` pra
preencher a linha toda) — hover e `aria-current="page"` acionam a MESMA regra
CSS, então não existe mais "ativo com hover" visualmente diferente de "só
hover". `groupHeader` (item pai) ganhou o mesmo par hover verde/branco,
incluindo o caret. No trilho, `.railItem` ganhou o mesmo tratamento e o ícone
de cada item folha simplificou pra sempre `texto-primario` no JSX — hover/ativo
agora são resolvidos só via CSS (`fill` sobrescrevendo o atributo de
apresentação do Phosphor), consistente com o resto.

Testado no navegador nos dois temas: "Pedidos" (ativo) e "Relatórios" (hover)
mostram fundo verde sólido + texto/ícone branco; "Produtos" (item pai, hover)
mostra o mesmo tratamento incluindo o caret. Contrato atualizado
(tokensAllowed, anatomy, a11y, decisions). Build limpo.

### SideNav — sem bordas, painel num tom mais claro, User Card mais escuro, sem sublinhado no hover (2026-08-28)

Pedido do usuário, 4 ajustes de acabamento visual:

**1. Sem bordas.** Removidas todas as bordas do componente — painel↔conteúdo,
trilho↔conteúdo, header↔lista, footer↔lista, botão de hambúrguer. `border` saiu
do `tokensAllowed` do contrato (o componente não usa mais nenhuma).

**2. Painel num tom mais claro que a página.** Fundo do painel/trilho passou de
`fundo-superficie` (igual à página) pra `fundo-secundario` (um tom a mais) — a
separação visual do conteúdo ao lado agora vem só da diferença de fundo, não de
uma linha. `fundo-secundario` é o mesmo token de "superfície secundária" já
usado em cards/painéis no resto do harness (mais claro que a página no modo
escuro, mais escuro no modo claro — comportamento por tema já estabelecido,
não recalculado por componente).

**3. "User Card" mais escuro.** O cartão de perfil no rodapé (composição de
exemplo na demo, não parte do contrato) voltou a usar `fundo-superficie` (o
tom mais escuro/de página) como fundo — contrastando com o `fundo-secundario`
mais claro do painel ao redor — e a borda ficou um pouco mais escura que
`borda-base` via `color-mix(in srgb, var(--borda-base), black 20%)` (sem
inventar token novo).

**4. Sem sublinhado no hover.** Link sublinha por padrão no próprio `:hover`
(`link.contract.json`) — redundante em cima do destaque de fundo+cor sólidos
que o SideNav já aplica. Sobrescrito com `text-decoration: none` na mesma
regra CSS que já reaplica fundo/cor no hover — Link.tsx e seu contrato
continuam intocados, só o CONTEXTO do SideNav reafirma a apresentação.

Testado no navegador nos dois temas: painel visivelmente mais claro que a área
de conteúdo ao lado (mais escura) no modo escuro; User Card com fundo escuro e
borda sutil bem distinguível do painel ao redor; hover em itens-folha e em
"Produtos" (item pai) sem sublinhado, só fundo verde + texto branco. Contrato
atualizado (anatomy, tokensAllowed, forbidden, decisions). Build limpo.

### SideNav — fundo do painel por tema, User Card sem borda, mais espaço ícone/texto, rebrand pra LVXFR (2026-08-31)

Pedido do usuário, 4 ajustes (o 2º ajuste da rodada anterior, "painel num tom
mais claro que a página", precisou ser REVISADO aqui — ver item 1):

**1. Fundo do painel por tema.** No modo claro o painel/trilho volta a usar
`fundo-superficie` (branco) e a página ao lado usa `fundo-secundario` (cinza
claro); no modo escuro é o oposto (painel em `fundo-secundario`, página em
`fundo-superficie`) — comportamento já existente da rodada anterior. O motivo
de precisar do par condicional por tema (`:root[data-theme="dark"] .nav`/`.rail`)
em vez de um token só: `fundo-secundario` é mais ESCURO que `fundo-superficie`
no modo claro, mas mais CLARO no modo escuro (mesma inversão já documentada no
fix de `Avatar.fallback`) — nenhum token único representa "sempre a superfície
mais clara das duas" nos dois temas ao mesmo tempo. Nova classe `.pageArea`
(em `Demo.module.css`, compartilhada pelas demos) centraliza o fundo "da
página" com a mesma lógica invertida, reaproveitada tanto nos placeholders de
conteúdo quanto no User Card (item 2).

**2. User Card sem borda.** Removida a borda do cartão de perfil no rodapé
(composição de exemplo na demo, não parte do contrato) e o fundo passou a
usar a mesma `.pageArea` da página ao lado, em vez de um tom fixo/distinto —
o cartão agora se funde visualmente com a página, tanto no modo claro quanto
no escuro.

**3. Mais espaço entre ícone e texto.** `gap: var(--espaco-m)` (16px)
reaplicado em `.item a`, sobrescrevendo o gap padrão do átomo Link
(`espaco-xp`/4px) via seletor de maior especificidade — mesma técnica já
usada pra cor/fill/sublinhado nesse mesmo seletor, Link.tsx continua intacto.

**4. Rebrand pra LVXFR.** Removida toda menção a "Gastura" e a vocabulário de
vestuário/acessórios (Camisetas, Acessórios, Bonés, Bolsas, Transversais,
Mochilas, Roupas etc.) nas demos do harness — não só em SideNav/NavBar
(escopo original do pedido), mas em todo o projeto (Breadcrumb, FilterBar,
ImageThumbnail, Datatable, registry.ts e o contrato de QuantitySelector
tinham a mesma vocabulário como texto de exemplo). Marca provisória "LVXFR"
substitui "Gastura"; categorias de exemplo trocadas por um domínio neutro
(documentos/relatórios financeiro-jurídico no SideNav/NavBar, eletrônicos/
periféricos no Datatable/Breadcrumb/FilterBar/ImageThumbnail) — sem
vestígio de vestuário em lugar nenhum.

Testado no navegador nos dois temas via `data-theme` (light/dark): painel
branco + página cinza-claro no modo claro, painel cinza-claro + página escura
no modo escuro (cores computadas via `getComputedStyle`, batendo com os
tokens esperados); User Card e placeholders de "página" com o mesmo
`background-color` exato do tema ativo e `border: none`; gap ícone/texto
computado em 16px. Busca por "Gastura"/vocabulário de vestuário no projeto
inteiro (`grep -rIn`) sem nenhum resultado após os ajustes. Contrato do
SideNav atualizado (decisions revisando o fundo por tema e o novo gap,
forbidden ajustado pra não descrever mais uma direção fixa de contraste).
Build limpo.

### SideNav — gap ícone/texto do item "pai" (com submenu) igualado ao dos itens-folha (2026-08-31)

Bug encontrado pelo usuário via screenshot: `.groupLabel` (label dentro do
`groupHeader`, usado pelos itens "pai" de submenu) ainda usava o gap antigo
(`espaco-pp`/8px) da rodada anterior a essa, enquanto `.item a` (itens-folha)
já tinha sido ajustado pra `espaco-m`/16px — o pedido de "aumentar o
espaçamento" só tinha sido aplicado num dos dois lugares. Corrigido: `.groupLabel`
agora usa o mesmo `espaco-m`. Testado no navegador (computed style + screenshot)
— gap de "Documentos" (item pai) agora bate visualmente com "Início"/"Sobre"
(itens-folha). Build limpo.

### Novo template — BackofficeTemplate, página de backoffice vazia (2026-08-31)

Pedido do usuário, inspirado numa imagem em anexo (trilho de navegação
recolhido à esquerda com logo no topo, barra superior com título da página +
notificações + menu de conta, card de conteúdo em branco vazio). Sem
contrato próprio — é um TEMPLATE (composição de componentes já contratados),
mesmo padrão de SettingsTemplate/DashboardTemplate/KanbanTemplate.

Composição: `SideNav` (`collapsed`/`onCollapsedChange`, 3 itens: Início/
Relatórios (ativo)/Configurações) + um logo próprio do TEMPLATE acima dele
(elemento à parte, não é o slot `header` do SideNav — o header não aparece
no modo recolhido, então não daria pra usar o slot pra isso) — os dois
empilhados na MESMA cor de fundo por tema (`.railColumn`, reaproveitando o
mesmo par `fundo-superficie`/`fundo-secundario` por `data-theme` já usado em
`SideNav.module.css`) pra formar uma coluna visualmente contínua, sem costura.
`NavBar` no topo, com o título "🏠 Início" no slot `brand` (slot livre, não
usado como logo aqui — é conteúdo agnóstico, mesma filosofia de
Card/Modal) e notificações+conta no slot `actions`. Área de conteúdo é um
card branco vazio (`fundo-superficie`, `raio-p`), sem nada dentro — é
literalmente uma página vazia, ponto de partida pra qualquer tela nova.

Não usei `Breadcrumb` pro título "Início" porque o contrato do Breadcrumb
proíbe explicitamente menos de 2 items ("sem hierarquia real") — um título
de página com 1 nível só não é uma trilha, então virou um `<span>` livre
(ícone + texto) direto no slot `brand` do NavBar.

Ícone novo no registro fechado do Icon: `bell` (Phosphor `Bell`), pro sino
de notificação — sob demanda real deste template (nenhum ícone de sino
equivalente já existia), registrado em `icon.contract.json` (decisions).
Menu de conta reaproveita `Popover` + botão de texto/chevron, mesmo padrão
já usado no "User Card" do SideNav (`SideNavDemo.tsx`), mas duplicado aqui
em vez de extraído — é conteúdo livre de duas demos diferentes, não parte de
contrato nenhum (mesma régua de "sem dedup prematuro" já usada no resto do
harness).

Testado no navegador nos dois temas: logo+trilho formam uma coluna contínua
(mesma cor top a baixo) tanto no claro (branco) quanto no escuro
(fundo-secundario); hover no trilho abre o painel completo com os 3 itens
(Relatórios com destaque verde); clique no menu de conta abre o Popover com
"Meu perfil"/"Configurações da conta"/"Sair". Registrado no Playground
(`registry.ts`, grupo Templates) com `BackofficeTemplateDemo`. Build limpo.

### BackofficeTemplate — 4 ajustes (header em vez de NavBar, identificação de volta pro SideNav, página mais escura que o SideNav, chevron só no hover) (2026-08-31)

Pedido do usuário, 4 ajustes na primeira versão do template:

**1. Header, não NavBar.** A barra superior deixou de usar o componente
`NavBar` (que sempre vem com `fundo-superficie` + borda inferior fixos,
comportamento do próprio contrato do NavBar, não configurável por fora) e
virou um `<header>` simples do template, sem borda nenhuma, com a MESMA cor
de fundo da página ao redor (par de regras por tema idêntico ao de `.page`)
— o header "some" visualmente dentro da página, só o título e o sino de
notificação ficam por cima.

**2. Identificação do usuário de volta pro SideNav.** O menu de conta saiu
do header e voltou a ser o rodapé do próprio SideNav (`footer`/
`footerCollapsed`, exatamente como o contrato já previa) — o header agora só
tem título da página + notificações. `ProfileFooter` (Avatar+StackedText+
Popover, sem borda, fundo igual ao fundo da página) reaproveita a mesma
composição já validada em `SideNavDemo.tsx`, `footerCollapsed` mostra só o
Avatar no trilho recolhido.

**3. Página sempre mais escura que o SideNav.** Bug real: `.page`/
`.pageEmbedded` usavam `fundo-secundario` fixo (sem variar por tema),
enquanto `.railColumn` já tinha o par condicional por tema — no modo ESCURO
os dois acabavam com a MESMA cor (`fundo-secundario`), sem contraste nenhum
entre SideNav e página. Corrigido: `.page`/`.pageEmbedded`/`.topBar`/
`.userCard` agora usam o par INVERSO do `.railColumn` (`fundo-secundario` no
claro, `fundo-superficie` no escuro) — confirmado nos dois temas via
`getComputedStyle`: claro = trilho branco (255,255,255) / página cinza
(243,244,246); escuro = trilho (32,32,31) / página (22,22,22), sempre mais
escura.

**4. Chevron só aparece no hover.** AJUSTE NO PRÓPRIO SideNav (não só no
template, ver `SideNav.tsx`/`side-nav.contract.json`): o botão de recolher/
expandir deixou de aparecer fixo no topo do trilho recolhido em repouso —
agora só existe dentro do painel completo que abre no hover/foco (mesmo
`headerRow` já usado no painel expandido). Antes o mesmo botão aparecia
redundante nos dois lugares (fixo no trilho E dentro do painel no hover);
agora a única forma de fixar o SideNav aberto é passar o mouse por cima
primeiro pra revelar o painel, e então clicar no chevron que aparece nele.

Testado no navegador nos dois temas: trilho sem chevron em repouso,
chevron aparece junto com o painel completo no hover; rodapé do trilho com
Avatar (colapsado) e cartão completo (Nome do Operador + e-mail, no
overlay); header sem nenhuma borda visível, mesma cor de fundo da página em
ambos os temas; cores de fundo confirmadas via `getComputedStyle` (página
sempre mais escura que o trilho). Contrato do SideNav atualizado
(decisions). Build limpo.

### SideNav ganha headerCollapsed + BackofficeTemplate: logo no trilho, SideNav empurra conteúdo, Breadcrumb no header, card mais claro em dark (2026-08-31)

Pedido do usuário, 4 ajustes:

**1. Logo visível também no trilho recolhido — nova prop `headerCollapsed`
no SideNav.** Mesmo racional de `footerCollapsed` (que já existia), só que
pro TOPO do trilho em vez do rodapé: slot livre opcional, sem efeito quando
`collapsed` não está ativo, o header normal (slot `header`) continua sem
aparecer no trilho — `headerCollapsed` é um slot SEPARADO porque o SideNav
não tem como recortar automaticamente o que cabe reduzido a 64px a partir de
um ReactNode livre qualquer. No BackofficeTemplate: `header` recebe o logo
completo (ícone + "LVXFR"), `headerCollapsed` recebe só o ícone — os dois
agora são passados DIRETO pro SideNav (o wrapper externo `.railColumn`/
`.logoBox` do template, criado na rodada anterior só pra simular isso por
fora, foi removido — o SideNav resolve isso nativamente agora).

**2. Abrir o SideNav empurra o conteúdo — já era o comportamento real,
confirmado.** Não foi bug: clicar no chevron (dentro do painel de hover)
chama `onCollapsedChange(false)`, e o SideNav troca do branch "trilho
recolhido" pro branch normal (`<nav>` de largura real, dentro do fluxo do
layout) — deixa de ser overlay, passa a ocupar espaço e empurra o conteúdo
ao lado. Testado no navegador: clicar no chevron durante o hover realmente
empurra o header/card pra direita. Documentado explicitamente na anatomy do
contrato (antes só dizia que o painel "não empurra layout", sem deixar claro
que isso muda ao sair do modo recolhido).

**3. Breadcrumb no lugar do título solto.** O "🏠 Início" no canto esquerdo
do header virou de fato um `Breadcrumb` (antes era um `<span>` livre com
Icon+texto). O contrato do Breadcrumb proíbe menos de 2 items ("sem
hierarquia real"), então ficou `firstItemIcon="house"` + 2 items (`Início` →
`Visão geral`, o último sem href, current da trilha) — um título de 1 nível
só não dava pra virar Breadcrumb sem violar esse forbidden.

**4. Card de conteúdo mais claro que o fundo, nos dois temas — bug real.**
`.emptyCard` usava `fundo-superficie` fixo; no modo escuro isso batia
EXATAMENTE com o fundo da página (que também usa `fundo-superficie` no
escuro, ver rodada anterior) — card e página ficavam com a mesma cor, sem
contraste nenhum. Corrigido com o mesmo par de regras por tema já usado no
SideNav: `fundo-superficie` no claro, `fundo-secundario` no escuro — sempre
mais claro que a página (que usa o par oposto). Confirmado via
`getComputedStyle` nos dois temas: claro = página 243,244,246 / card branco;
escuro = página 22,22,22 / card 32,32,31 (mais claro).

Testado no navegador nos dois temas: ícone da marca aparece no trilho
recolhido em repouso; hover revela o painel com logo completo; clicar no
chevron pina o SideNav aberto e empurra o header+card; Breadcrumb
"Início > Visão geral" renderiza corretamente; card sempre mais claro que a
página nos dois temas (cores confirmadas via `getComputedStyle`). Sem
regressão no SideNav "solto" (SideNavDemo, que não usa headerCollapsed).
Contrato do SideNav atualizado (props, anatomy, decisions — inclui correção
de uma frase da anatomy que ainda descrevia o chevron como sempre visível no
trilho, desatualizada desde a rodada anterior). Build limpo.

### SideNavDemo — logo também no trilho recolhido, mesmo bug do BackofficeTemplate (2026-08-31)

Pedido do usuário: "o logo deve estar sempre visível no componente SideNav"
(completo quando aberto, só o ícone quando fechado). O BackofficeTemplate já
fazia isso certo (rodada anterior, via `headerCollapsed`), mas a própria demo
do SideNav (`SideNavDemo.tsx`, seção "Recolhido") não passava essa prop — o
logo (`WorkspaceHeader`) simplesmente sumia no trilho recolhido, mesmo bug
que o template teve antes de `headerCollapsed` existir. Corrigido: extraído
o ícone do `WorkspaceHeader` numa função própria `WorkspaceLogoIcon`
(reaproveitada dentro do próprio `WorkspaceHeader` também, sem duplicar
markup), passada como `headerCollapsed` na seção "Recolhido". Testado no
navegador — ícone do logo aparece no topo do trilho em repouso. Contrato do
SideNav atualizado (decisions, documentando como boa prática pra qualquer
consumidor: sempre passar `headerCollapsed` junto de `header` quando
`collapsed`/`onCollapsedChange` está em uso). Build limpo.

### Novo componente — UserCard, extraído do "User Card" do SideNav + bug real de fonte no Popover corrigido (2026-08-31)

Pedido do usuário: transformar o "User Card" (Avatar+StackedText+caret,
gatilho de um Popover com menu de conta) que já vinha duplicado como função
local `ProfileFooter` em `SideNavDemo.tsx` E `BackofficeTemplate.tsx` num
componente próprio, contratado (`contratos/user-card.contract.json`,
`src/components/UserCard/UserCard.tsx`).

**Decisões de design:** UserCard é só o CARTÃO/gatilho — não envolve Popover
internamente, o `content` (menu de conta) continua 100% livre e por fora,
mesmo racional já estabelecido em `action-card.contract.json` pra onInfo/
onSettings ("só expõe o gatilho, o que abre é responsabilidade de quem
consome"). O fundo (par de tokens da PÁGINA — fundo-secundario no claro/
fundo-superficie no escuro, sempre o oposto do painel/SideNav que o contém)
ficou fixado DENTRO do componente — antes essa mesma regra estava duplicada
em CSS module por consumidor (`Demo.module.css`/`.pageArea`,
`BackofficeTemplate.module.css`/`.userCard`, ambos removidos agora). Ícone
sempre 'caret-up', sem prop de direção — os dois consumidores reais sempre
usam o cartão no rodapé de um painel, abrindo o menu pra cima; sem um
terceiro caso real precisando abrir pra baixo, uma prop `caretDirection`
seria especulativa. `UserCard` usa `forwardRef` — primeiro componente
customizado do harness a servir de children direto de `Popover` (que faz
`cloneElement` injetando `ref`+`onClick`; até aqui só elementos nativos como
`<button>` eram usados nesse lugar).

**Bug real de fonte corrigido, na raiz.** O usuário notou que os itens do
Popover (menu de conta) não pegavam a mesma fonte do resto da interface.
Causa: `Popover` renderiza o painel via `FloatingPortal`, um nó solto fora
da árvore de DOM estilizada do app (fim do `<body>`) — `html`/`body` não
define `font-family` nenhuma no harness (cada componente declara a própria,
ver `base.css`), então conteúdo livre que dependesse de herança normal
(`font: inherit` nos botões de menu) caía pra fonte padrão do navegador.
Corrigido definindo `font-family`/`font-size` (texto-p) direto no
`.popover` (`Popover.module.css`) — mesmo racional do fix de cor já
existente em `base.css` pra Drawer/Modal, agora aplicado à fonte: dá um
valor padrão sensato pra QUALQUER conteúdo livre dentro de qualquer
Popover do harness (CallControlBar, TicketCard, KanbanTemplate, etc.), não
só o do UserCard. Confirmado via `getComputedStyle`: fonte do menu batendo
exatamente com a fonte do resto do app (`Roboto, sans-serif`) — antes caía
pra serif/sans padrão do navegador.

`SideNavDemo.tsx` e `BackofficeTemplate.tsx` refatorados pra usar
`<UserCard>` no lugar do `ProfileFooter` duplicado (o Popover ao redor
continua no consumidor, com o menu de cada um). Novo componente registrado
no Playground (`registry.ts`, grupo Moléculas, `UserCardDemo`) com um
exemplo sozinho e um exemplo real dentro de Popover. Testado no navegador
nos dois temas — SideNavDemo e BackofficeTemplate sem regressão visual,
menu de conta abrindo/fechando normalmente, fonte correta em ambos. Build
limpo.

### Novo componente — NotificationCenter, vinculado ao header do BackofficeTemplate (2026-08-31)

Pedido do usuário: um elemento de alerta de mensagens no header do
BackofficeTemplate — botão tipo link, só ícone (sino), contador de não
lidas, abrindo um popover ou drawer na direita com a lista completa
(lidas/não lidas), filtro "apenas não lidas", marcar como não lida de volta,
exclusão individual/em lote/total, sempre com confirmação antes de excluir.
Pedido explícito: "Isso deve ser criado como um componente à parte, com
contrato específico e depois vinculado a esta página" — novo componente
`NotificationCenter` (`src/components/NotificationCenter/NotificationCenter.tsx`,
`contratos/notification-center.contract.json`), registrado no Playground
(grupo Organismos) e plugado no header do `BackofficeTemplate` no lugar do
sino estático que só existia como placeholder visual até agora.

**Decisões de design:**
- **Drawer, não Popover** — decisão do agente diante da escolha deixada em
  aberto pelo usuário. A lista tem filtro, seleção em lote e várias ações
  por item — rico demais pro espaço apertado de um Popover. O Drawer padrão
  do harness já abre ancorado na borda DIREITA por padrão, batendo exatamente
  com "na direita" sem precisar de nenhuma prop nova.
- **100% auto-contido quanto a estado de UI** — drawer aberto/fechado, filtro
  "apenas não lidas", seleção e qual exclusão está pendente de confirmação
  são todos internos. Só os DADOS (`notifications`) e as MUTAÇÕES
  (`onMarkAsRead`/`onMarkAsUnread`/`onDelete`/`onDeleteMany`/`onDeleteAll`)
  são controlados de fora — mesmo racional de Datatable (sort/filtro/
  paginação internos, dados sempre do consumidor).
- **Ícone de envelope como indicador E botão de ação ao mesmo tempo** —
  fechado (verde) = não lida, aberto (cinza) = lida; clicar alterna. Evita um
  dot de status separado do botão de alternar. Dois ícones novos no registro
  fechado do Icon: "envelope"/"envelope-open" (Phosphor EnvelopeSimple/
  EnvelopeOpen), sob demanda real (documentado em icon.contract.json).
  Badge de contagem também reaproveitado sem mudança — só aparece quando
  unreadCount > 0.
- **Toda exclusão passa por ConfirmDialog** (componente já existente,
  reaproveitado) — pedido explícito do usuário, "esta ação não poderá ser
  desfeita" aparece nas 3 variações (individual/selecionadas/todas),
  confirmVariant="destructive".
- **"Apagar todas" sempre apaga TUDO**, mesmo com o filtro "apenas não
  lidas" ativo — um filtro de visualização não deveria mudar silenciosamente
  o escopo de uma ação destrutiva tão ampla. Exclusão em lote, por outro
  lado, só pode incluir itens selecionados entre os VISÍVEIS no momento
  (não dá pra selecionar o que o filtro esconde).
- Reaproveita só componentes já existentes e contratados: Button (gatilho
  iconOnly variant='link'), Badge, Icon, Drawer, Switch (filtro), Checkbox
  (seleção), EmptyState (lista vazia) e ConfirmDialog — nenhum componente
  foi reimplementado.

Testado no navegador, fluxo completo: marcar uma notificação como lida
(badge do gatilho atualiza em tempo real, item some do filtro "apenas não
lidas"), excluir 1 notificação (confirmação → exclusão → EmptyState quando
filtro fica vazio), selecionar 2 e excluir em lote (confirmação com
contagem certa), "Apagar todas" (confirmação, lista fica vazia, botão
'Apagar todas' some junto). Testado nos dois temas — sem regressão visual.
`BackofficeTemplate` atualizado pra usar `NotificationCenter` com estado
real de notificações (useState local, como o "banco de dados" de exemplo do
template) no lugar do sino estático anterior. Build limpo.

### NotificationCenter — 7 ajustes de acabamento (2026-08-31)

Pedido do usuário, 7 ajustes na primeira versão do componente:

**1. Área de clique do gatilho.** Bug real: `Button variant='link'` colapsa
pro tamanho exato do glifo do ícone (`padding:0`, comportamento do próprio
`button.contract.json`, usado por outros textos-link do harness — não
alterado ali pra não quebrar esses outros casos), e o Badge de contagem é
IRMÃO do Button (não filho) — clicar exatamente em cima do número do Badge
não acionava nada. Corrigido só no wrapper do NotificationCenter: `.trigger`
ganhou tamanho fixo 40x40 (mesma escala de outros botões-ícone do harness,
ex. hamburger/collapseToggle do SideNav) com `onClick` próprio, cobrindo
ícone E o canto do Badge. Testado no navegador clicando EXATAMENTE em cima
do número "2" do Badge — abre o Drawer normalmente.

**2. Checkbox em vez de Switch** pro filtro "Apenas não lidas" — sem
justificativa técnica pro Switch original além de preferência inicial;
Checkbox é o controle mais comum do harness pra esse tipo de filtro binário
em lista.

**3. Nova linha de ações em lote.** "Marcar todas como lidas" (nova prop
`onMarkAllAsRead`, só aparece com `unreadCount > 0`, sem confirmação — não é
destrutivo) + "Apagar todas", os dois na linha logo abaixo do checkbox de
filtro.

**4. Sem ícone nenhum nos itens.** O par 'envelope'/'envelope-open'
(adicionado na rodada anterior) foi REMOVIDO do registro do Icon por falta
de consumidor real (ver icon.contract.json) — status de leitura agora é só
o peso da fonte do título (negrito=não lida).

**5. Barra de seleção com um botão só.** "Apagar N selecionada(s)" (N
embutido no label) — sem o texto de contagem isolado ao lado que existia
antes.

**6. Sem botão de exclusão individual por item.** A prop `onDelete` (1 id
só) saiu do contrato — exclusão de 1 item agora é: selecionar esse item só
e usar a mesma barra de seleção/`onDeleteMany` (array de 1 elemento), sem
duplicar caminho de exclusão. "Apagar uma a uma" (pedido original) continua
possível, só que pelo mesmo mecanismo de seleção em lote.

**7. Drawer size='medium'** (era 'small') — confirmado via
`getComputedStyle` (440px, batendo com a escala medium do próprio
`drawer.contract.json`).

Testado no navegador, fluxo completo pós-ajustes: clique no Badge abre o
Drawer; checkbox de filtro funciona; "Marcar todas como lidas" marca tudo e
some sozinho quando não sobra nada não lido; selecionar 1 item mostra
"Apagar 1 selecionada" (singular correto); ConfirmDialog aparece antes de
qualquer exclusão, sem exceção; nenhum ícone visível em nenhum item da
lista. Sem regressão no `BackofficeTemplate` (dois temas). Contrato do
NotificationCenter reescrito (props, anatomy, forbidden, decisions) e
`icon.contract.json` atualizado documentando a remoção dos dois ícones.
Build limpo.

### Drawer — bug real de altura corrigido (afeta o componente inteiro) + NotificationCenter, mais 4 ajustes (2026-08-31)

Pedido do usuário, 4 itens — o 2º pedia investigação explícita ("verifique
se é um erro do drawer no componente NotificationCenter ou se é do drawer
como um todo"):

**1. Badge sobreposto ao sino.** O Badge de contagem ficava ancorado no
canto da área de clique AMPLIADA (40x40, criada na rodada anterior pra
melhorar a hit-box), não no canto do ÍCONE em si — sobrava um vão visível
entre o sino e o número. Corrigido com um wrapper interno novo (`.iconBox`,
do tamanho exato do ícone) que vira o contexto de posicionamento do Badge —
a hit-box maior (`.trigger`) continua por fora, só não é mais quem ancora o
Badge.

**2. BUG REAL DE ALTURA — confirmado como bug do Drawer INTEIRO, não do
NotificationCenter.** Investigado no navegador: o stylesheet nativo do
`<dialog>` (`dialog:modal`, UA stylesheet do próprio navegador) define um
`max-height` próprio (`calc(100% - 38px)` no navegador de teste) que VENCIA
sobre o `height: 100vh` já declarado em `Drawer.module.css` — o CSS nunca
redeclarava `max-height`, só `height`, então a UA ganhava. Corrigido
adicionando `max-height: 100vh` explícito ao lado de `height: 100vh`, no
componente Drawer — testado abrindo o próprio Drawer de demonstração (fora
do NotificationCenter) e confirmando `getBoundingClientRect().height`
batendo exatamente com `window.innerHeight` nos dois casos. Mesma classe de
bug (propriedade da UA vencendo por falta de redeclaração) já documentada
antes pro left/right do mesmo componente.

**3. Conteúdo do Drawer reduzido ao pedido explícito.** Switch (não mais
Checkbox — "o checkbox ficou ruim") pequeno, label "Exibir apenas não
lidas", sempre visível. Sem seleção: só "Marcar todas como lidas" (quando
há não lidas). Com 1+ selecionadas: troca pra "Selecionar todos"/"Desmarcar
todos" (toggle) + "Marcar como lidas" (só as selecionadas) + "Apagar N
selecionada(s)" (só aparece com seleção — confirmado, não existe mais
nenhum caminho que mostre o botão de apagar sem nada selecionado). O botão
"Apagar todas" (existia antes) foi removido — apagar tudo continua possível
via "Selecionar todos" + apagar. Esclarecido com o usuário via pergunta
direta que "Marcar como não lidas" nas duas menções do pedido era repetição
da palavra do Switch acima ("não lidas"), não uma troca de sentido — o
botão continua marcando como LIDAS.

**4. Sem botões link por item.** "Marcar como lida"/"Marcar como não lida"
(existiam na linha de cada notificação) foram removidos — toda ação
individual passa a ser feita via seleção (Checkbox) + os botões de linha
2/barra de seleção, sem duplicar caminho de ação por item.

Props do componente simplificadas: `onMarkAsUnread`, `onDelete` e
`onDeleteAll` saíram do contrato (sem nenhum gatilho de UI que os
chamasse mais); `onMarkAsRead` passou a ser usado em loop pela ação
"Marcar como lidas" da seleção. Testado no navegador nos dois temas —
overlap do Badge, altura cheia do Drawer (NotificationCenter E Drawer
solto), fluxo completo de seleção ("Selecionar todos"/"Desmarcar todos",
"Marcar como lidas" atualizando o Badge do gatilho em tempo real). Sem
regressão no `BackofficeTemplate`. Contratos do Drawer e do
NotificationCenter atualizados. Build limpo.

### SideNav ganha mobileOpen/onMobileOpenChange — BackofficeTemplate: hambúrguer no header + padding responsivo corrigido (2026-08-31)

Pedido do usuário, 2 ajustes na versão responsiva (mobile) do
BackofficeTemplate — os dois vieram da MESMA causa raiz.

**Causa raiz encontrada:** o botão de hambúrguer embutido do SideNav sempre
renderizava como IRMÃO do `<nav>`/trilho no DOM (dentro do próprio
fragmento retornado por `SideNav`) — como o BackofficeTemplate renderiza
`<SideNav>` direto como filho do flex row `.page`, o hambúrguer virava mais
um item desse flex row, sem nenhuma forma de reposicioná-lo pra dentro do
`<header>`. Resultado: no mobile, o hambúrguer aparecia solto no canto
superior esquerdo, ACIMA do header (fora da linha do Breadcrumb+
NotificationCenter) — e, como efeito colateral, ocupava espaço extra no
flex row, empurrando o conteúdo e deixando o padding esquerdo do card maior
que o direito (medido no navegador: 60px vs 24px antes do fix).

**Fix — novo par controlado no SideNav: `mobileOpen`/`onMobileOpenChange`**
(mesmo racional já usado em `collapsed`/`onCollapsedChange`: presença ativa
o modo controlado). Quando ausente, comportamento 100% igual a antes
(hambúrguer embutido, estado interno) — confirmado sem regressão no
SideNavDemo (que não usa a prop nova). Quando presente, o hambúrguer
embutido PARA de renderizar e o consumidor assume o gatilho — o Drawer/
árvore de navegação em si continuam sendo renderizados pelo SideNav, só o
botão muda de dono.

BackofficeTemplate passou a usar o par controlado, com um botão de
hambúrguer PRÓPRIO dentro do `<header>`, depois do NotificationCenter (só
visível abaixo de 768px, mesmo breakpoint do SideNav). Testado no navegador
em viewport mobile (375px): hambúrguer agora aparece dentro do header, à
direita do sino; padding do card confirmado simétrico via
`getBoundingClientRect` (24px dos dois lados); clique no novo hambúrguer
abre o mesmo Drawer de navegação (logo, árvore, User Card) normalmente.
Contrato do SideNav atualizado (props, anatomy, decisions). Build limpo.

### BackofficeTemplate — header e Drawer mobile reorganizados (2026-08-31)

Pedido do usuário, 2 ajustes só no mobile (desktop intocado nos dois):

**1. Logo no header mobile, Breadcrumb numa linha própria.** Header virou
duas linhas no mobile (uma só no desktop): linha 1 = logo (mesmo `<Logo/>`
já usado no SideNav, reaproveitado) à esquerda + notificações/hambúrguer à
direita; linha 2 = Breadcrumb sozinho, alinhado à esquerda. Implementado só
com CSS (duas instâncias de `Breadcrumb` + uma de `Logo`, cada uma visível
só num dos dois breakpoints via `display:none`/`@media`) — sem lógica de
detecção de viewport em JS, mesma técnica já usada nos outros toggles
responsivos do harness.

**2. Drawer mobile reorganizado: menos padding, sem logo, User Card no
topo como collapse.** Como o Drawer mobile é 100% renderizado por DENTRO do
SideNav (o consumidor não tem acesso ao DOM interno pra reordenar
conteúdo), foi preciso estender o contrato do SideNav com um slot NOVO:
`footerMobile` — quando presente, substitui header+footer só no Drawer
mobile (o painel expandido/overlay do desktop continua 100% intocado,
usando header/footer normais). `footerMobile` renderiza no TOPO (antes da
árvore de itens), não embaixo. Padding do Drawer mobile também reduzido
(`padding='small'`, era o 'large' padrão do próprio Drawer).

BackofficeTemplate passou `footerMobile={<ProfileFooterMobile/>}` — uma
versão do rodapé que reaproveita o próprio `UserCard` como gatilho, mas SEM
Popover: o menu de conta abre como collapse inline logo abaixo (mesmo
padrão de disclosure do groupHeader do SideNav), controlado por um `useState`
local. Isso expôs uma limitação real do `UserCard`: o caret vinha sempre
fixo 'pra cima' (decisão da rodada em que o componente foi criado, únicos
2 consumidores até então abriam pra cima) — com o novo caso abrindo pra
BAIXO, uma seta fixa pra cima ficaria semanticamente errada. Adicionada
`caretDirection` ('up'/'down') ao UserCard, sob demanda desse segundo
consumidor real (mesma régua "cresce sob demanda", agora também pra props,
não só ícones). `ProfileFooterMobile` passa `caretDirection={open ? "up" :
"down"}`, espelhando o mesmo flip de seta já usado no caret do groupHeader.

Testado no navegador nos dois temas e nos dois breakpoints: mobile mostra
logo+ações numa linha, Breadcrumb sozinho embaixo; abrir o menu mobile
mostra User Card no topo (sem logo, padding visivelmente menor), clicar
nele expande o menu de conta pra baixo, inline, empurrando a árvore de
itens — sem nenhum Popover flutuante. Desktop confirmado sem regressão:
User Card continua no rodapé do painel, caret pra cima, Popover normal.
Contratos do SideNav e do UserCard atualizados. Build limpo.

### AppShell extraído do BackofficeTemplate — SettingsTemplate/DashboardTemplate/KanbanTemplate migrados + novo CrudTemplate (2026-08-31)

Pedido do usuário: "use o BackofficeTemplate para atualizar o
SettingsTemplate, DashboardTemplate e KanbanTemplate" + "crie um template de
tela de CRUD padrão, com um Datatable do tipo mais completo e um botão para
'Novo registro'".

**AppShell — nova infraestrutura de página compartilhada**
(`interface/screens/shared/AppShell.tsx`/`.module.css`). Não é um
componente do design system (sem contrato próprio, mesma régua de qualquer
outro arquivo em `interface/screens` — templates não são contratados).
Extraído do `BackofficeTemplate` original (SideNav + logo/identificação do
usuário + header responsivo com Breadcrumb/NotificationCenter + hambúrguer
mobile, tudo que as últimas rodadas de ajuste já tinham resolvido) — virou o
ÚNICO lugar que define essa casca, em vez de 5 cópias divergentes. Decisão
do agente: diferente da régua geral do harness contra dedup prematuro
(que vale pra ÁTOMOS/MOLÉCULAS/ORGANISMOS contratados), aqui havia 5
consumidores REAIS e imediatos pedindo a MESMA casca ao mesmo tempo — não é
abstração especulativa.

API do AppShell: `activeNavKey` (qual item do SideNav fica marcado ativo —
novo menu com 5 destinos: Início/Dashboard/Kanban/Registros/Configurações,
cobrindo os 5 templates), `breadcrumbItems` (trilha do Breadcrumb do
header) e `layout` ('scroll', padrão — página cresce com o conteúdo; ou
'fixed' — altura trava em 100dvh, sem scroll externo, pro caso do Kanban).
`children` é o conteúdo livre da página.

**BackofficeTemplate** virou só `<AppShell>` + o card vazio (a página em si
não mudou visualmente, só o código parou de duplicar a casca).

**SettingsTemplate e DashboardTemplate** trocaram `NavBar` solto por
`AppShell` (`layout='scroll'`, padrão) — conteúdo interno (seções de
configuração / FilterBar+StatCard+Datatable) intocado, só a casca ao redor
mudou. `.page`/`.pageEmbedded`/padding duplicado removidos dos CSS modules
de cada um (o AppShell já resolve).

**KanbanTemplate** trocou a ausência de casca alguma (não tinha nem NavBar)
por `AppShell` com `layout='fixed'` — preserva exatamente o comportamento
já documentado ("100% da altura do dispositivo, sem scroll vertical
externo") mas agora dentro da mesma casca com SideNav/header dos outros
templates. Header PRÓPRIO do Kanban (título + 'Novo card' + 'Filtrar')
continua intacto, é conteúdo do `children`, não do AppShell.

**Novo template — CrudTemplate**
(`interface/screens/CrudTemplate/CrudTemplate.tsx`). AppShell + Datatable
configurado no tipo MAIS COMPLETO já estabelecido no harness — mesma
receita da 'CompleteExample' de `DatatableDemo` (toolbar com título/
densidade/colunas/exportação, filtro oculto por coluna, sort, seleção com
ações em lote — excluir/ativar/desativar, sempre com Modal de confirmação —,
paginação, edição de linha inline e habilitar/desabilitar registro, os dois
últimos com confirmação própria do Datatable). Domínio de exemplo:
"Clientes" (ID/nome+e-mail/plano/data de cadastro). Botão 'Novo registro'
na toolbar (pedido explícito do usuário) abre um Modal de criação real —
nome+e-mail+plano, valida os dois primeiros antes de habilitar 'Criar
cliente', e o registro criado aparece de fato na tabela (testado no
navegador: criei "Julia Prado", contagem foi de 8 pro 9, item apareceu na
página 2). `onDelete`(1 id)/`onDeleteAll` não foram replicados como props
separadas — a mesma barra de seleção em lote já criada pro NotificationCenter
resolve exclusão de 1 ou várias sem duplicar caminho.

Testado no navegador, os 5 templates: nav ativo correto em cada um
(Início/Dashboard/Kanban/Registros/Configurações), Breadcrumb contextual,
NotificationCenter funcional em todos, sem regressão visual em nenhum
conteúdo interno pré-existente. Responsivo confirmado no CrudTemplate
(375px: logo+ações no header, Breadcrumb numa linha própria, mesmo padrão
já validado no BackofficeTemplate). Dois temas confirmados no CrudTemplate.
Registry atualizado (5 descriptions/dependencies revisadas + novo
`crud-template` registrado, grupo Templates). Build limpo.

### Correção — SettingsTemplate/DashboardTemplate/KanbanTemplate revertidos; BackofficeTemplate/CrudTemplate movidos pro grupo Páginas (2026-08-31)

Pedido do usuário: "eu acho que cometi um equívoco, as telas que eu te pedi
como template, deveriam estar em Páginas e os templates de Settings,
Dashboard e Kanban deviam continuar como estavam" — corrigindo a
classificação da rodada anterior.

**SettingsTemplate, DashboardTemplate e KanbanTemplate revertidos pro
estado anterior à rodada passada** — de volta a `NavBar` solto (Settings/
Dashboard) e sem casca nenhuma (Kanban), exatamente como estavam antes do
AppShell existir. `.tsx`/`.module.css` dos 3 restaurados byte a byte pro
conteúdo de antes da extração do AppShell; entradas do registry
(`dependencies`/`description`) revertidas junto (`NavBar` de volta na lista
de dependências dos dois primeiros).

**BackofficeTemplate e CrudTemplate movidos do grupo "Templates" pro grupo
"Páginas"** no registry (`group: "Páginas"`, `contractFile: "sem contrato —
página, não componente"`, mesmo texto padrão já usado por LoginScreen/
SignUpScreen/etc.) — são páginas concretas de exemplo (com conteúdo real,
não um esqueleto de layout abstrato), não templates estruturais como os
outros 3. Nomes dos componentes/arquivos NÃO foram alterados (continuam
`BackofficeTemplate`/`CrudTemplate`, sem renomear pra `*Screen`) — o pedido
foi especificamente sobre a categoria/grupo no Playground, não sobre
renomear a API.

`AppShell` (`interface/screens/shared/AppShell.tsx`) foi MANTIDO — continua
sendo a casca real de `BackofficeTemplate` e `CrudTemplate`, os únicos dois
consumidores agora. Testado no navegador: os 3 templates revertidos
renderizam exatamente como antes (NavBar "Minha Empresa" em Settings/
Dashboard, Kanban sem casca); BackofficeTemplate e CrudTemplate aparecem
agora sob "PÁGINAS" na barra lateral do Playground, não mais em
"TEMPLATES", e continuam funcionando normalmente. Build limpo.

### SettingsTemplate — sem NavBar, navegação lateral virou Tabs (2026-08-31)

Pedido do usuário, 2 ajustes: "não precisa do header que tem escrito 'minha
empresa'" e "a navegação lateral da esquerda pode ser substituída por uma
navbar ou tabs no topo do card de Perfil".

**1. NavBar removida por completo.** A página deixou de ter qualquer barra
superior — agora é só o Card centralizado direto na página (fundo
fundo-secundario ao redor, igual antes).

**2. Navegação lateral (coluna de botões Perfil/Segurança/Notificações)
virou Tabs**, dentro do próprio Card, logo acima do conteúdo de cada seção
— decisão do agente entre as duas opções que o usuário deixou em aberto
("navbar ou tabs"): `Tabs` é o átomo do harness pensado exatamente pra
alternar entre seções de UM MESMO bloco de conteúdo (já usado em outros
lugares do harness com esse propósito); `NavBar` é navegação de topo de
PÁGINA (brand+links+ações), não faria sentido aninhada dentro de um Card.
Cada seção usa `TabPanel` (hidden, não desmonta — mesmo padrão de qualquer
outro consumidor de Tabs do harness) no lugar da renderização condicional
anterior.

Layout do corpo da página simplificado: sem mais duas colunas (sidebar +
conteúdo), só o Card centralizado (`justify-content: center`, max-width
560px, igual à largura de conteúdo de antes).

Testado no navegador nos dois temas: sem NavBar visível, Tabs no topo do
Card trocando entre Perfil/Segurança/Notificações corretamente (título de
cada seção, formulário correspondente, Alert de sucesso ao salvar).
Registry atualizado (dependencies — `NavBar` saiu, `Tabs` entrou —
description revisada). Build limpo.

### SettingsTemplate — Avatar maior + upload de foto, mais espaço entre Tabs e conteúdo (2026-08-31)

Pedido do usuário: "aumente a imagem de avatar e adicione um botão para
upload da foto de avatar. E aumente o espaçamento (gap) entre o menu de
topo e o conteúdo, dentro do card".

**Avatar aumentado.** `xlarge` (64px) já é o maior tamanho da escala do
próprio átomo (avatar.contract.json) — usar um valor de pixel solto ali
violaria o forbidden do contrato ("tamanho... fora da escala definida... não
usar valor de pixel solto"). Em vez de estender o enum de size do Avatar
por causa de um único consumidor, o aumento (96px efetivos) fica só aqui,
via `transform: scale(1.5)` aplicado de FORA do átomo (`.avatarScale`) —
Avatar continua declarando `size="xlarge"` normalmente, contrato intocado.

**Botão de upload de foto.** Ícone `upload-simple` (já existia no registro
do Icon) num Button `iconOnly` ancorado no canto inferior direito do
Avatar (`.avatarWrapper`, position:relative + `.avatarUploadButton`,
position:absolute). Funcional de verdade: aciona um `<input type="file"
accept="image/*" hidden>` por ref, lê o arquivo escolhido via FileReader e
atualiza o `src` do Avatar com o preview real — testado no navegador
simulando a seleção de um arquivo (PNG vermelho gerado via canvas): o
Avatar passou a mostrar a imagem enviada.

**Mais espaço entre Tabs e conteúdo.** O `padding-top` que separa o
`tablist` do conteúdo vem do próprio `TabPanel` (`Tabs.module.css`,
`.panel`, `espaco-m`/16px) — COMPARTILHADO por qualquer consumidor de Tabs
no harness. Em vez de alterar isso globalmente, cada seção do
SettingsTemplate ganhou um wrapper próprio (`.panelContent`) com mais
`espaco-m` por cima, dobrando o espaçamento total (32px, confirmado via
`getBoundingClientRect` no navegador) só aqui.

Testado nos dois temas. Registry atualizado (description). Build limpo.

### Correção — botão de upload do SettingsTemplate passou a usar o átomo FileUpload de verdade (2026-08-31)

Pedido do usuário: confirmar se o botão de upload de foto da rodada
anterior reaproveitava o componente FileUpload já existente no harness —
e a resposta era NÃO: a implementação anterior montava um `<input
type="file" hidden>` + `Button` iconOnly à mão, sem checar antes se um
átomo já resolvia isso. Corrigido, com o lembrete explícito do usuário
registrado como regra: "sempre verifique antes nos componentes existentes,
antes de criar um novo componente."

**Trigger de upload trocado pro FileUpload de verdade**
(`contratos/file-upload.contract.json`, `variant='button'`) — `value`/
`onChange` controlados com `File[]`, `accept='image/*'`. O preview do
Avatar continua sendo montado com `FileReader` (ler o primeiro arquivo do
array e virar data URL), já que FileUpload deliberadamente não faz upload
de verdade nem devolve um preview pronto — só entrega `File[]` (ver
`whenToUse`/forbidden do próprio contrato).

**Pedido adicional do usuário nesta mesma rodada: gatilho no estilo "botão
link"** (ícone + texto "Enviar sua foto", sem fundo/borda), **exatamente
embaixo do Avatar** — substituindo o badge circular flutuante que existia
antes (redundante ter os dois gatilhos pro mesmo upload). Bug real
descoberto ao tentar isso: `FileUpload` `variant='button'` tinha o Button
interno com `variant`/`outlined` FIXOS em `'neutral'`/`true`, sem nenhuma
prop pra configurar — não dava pra pedir um gatilho estilo link sem mexer
no componente. Corrigido com a mesma régua já usada várias vezes nesta
sessão ("cresce sob demanda de um consumidor real"): duas props novas,
`buttonVariant`/`buttonOutlined` (só `variant='button'`), reaproveitando o
enum `ButtonVariant` já existente — default `'neutral'`/`true` preserva
100% o visual original pra todo mundo que já usava o componente (conferido
no navegador: a demo do FileUpload, variant="button", continua idêntica).

Layout do Avatar+gatilho reorganizado numa coluna só (`.avatarRow`,
`flex-direction: column`), botão diretamente abaixo — `.avatarWrapper`
(96px, reserva o espaço da escala visual) + `.avatarScale` (o transform em
si) continuam do jeito que já estavam.

Testado no navegador nos dois temas: seleção de arquivo simulada (PNG azul
gerado via canvas) atualiza o Avatar com o preview real E aparece como
Chip removível logo abaixo do gatilho (comportamento padrão do próprio
FileUpload, não suprimido) — confirma que é o átomo de verdade rodando,
não uma reimplementação. Contrato do FileUpload atualizado (props,
decisions). Registry do FileUpload e do SettingsTemplate atualizados.
Build limpo.

### SettingsTemplate — BUG REAL corrigido: área de clique do "Enviar sua foto" invadida pelo Avatar (2026-08-31)

Pedido do usuário: "a área de click do botão 'enviar sua foto' não está
funcionando corretamente".

**Causa raiz, confirmada no navegador via `getBoundingClientRect`:**
`.avatarWrapper` é um flex container (`display:inline-flex`, `row`) com
`align-items` no padrão (`stretch`) — sem override, `.avatarScale` (o
elemento com o `transform: scale(1.5)` que aumenta o Avatar, ver rodada
anterior) esticava no eixo cruzado pra preencher os 96px de ALTURA do
wrapper ANTES do transform rodar, virando uma caixa real de 64×96 (não
64×64). Escalado por 1.5x, isso virava 96×144 — 48px MAIS ALTO que o
wrapper que devia contê-lo. Como `transform` afeta a área de pintura E de
hit-test do elemento (não só a aparência), esses 48px extras cobriam
exatamente a área onde o botão "Enviar sua foto" ficava logo abaixo —
clicar ali na verdade clicava no Avatar (elemento transparente/sem
handler), não no botão.

**Corrigido** com `align-self: flex-start` em `.avatarScale` — mantém o
tamanho de conteúdo real (64×64) antes do transform, que passa a escalar
certinho pra 96×96, sem sobrar nada por cima do botão. Confirmado no
navegador via `getBoundingClientRect`: `.avatarScale` agora mede
exatamente 96×96 (igual ao wrapper), e o botão começa 4px abaixo do fim do
Avatar, sem overlap. Clique testado (via `ref`, coordenada real da
ferramenta de navegador) confirma foco no próprio botão "Enviar sua foto"
— não mais no Avatar por cima. Fluxo completo de upload (seleção → preview
no Avatar → Chip do arquivo) testado de novo, sem regressão. Build limpo.

### StatCard — sem seta de tendência, rodapé reestruturado inspirado em referências visuais (2026-08-31)

Pedido do usuário, com 2 imagens de referência anexadas (linha de 4
StatCard e um dashboard completo com os mesmos cards):

**1. Sem seta pra cima/baixo.** O indicador de tendência (`trendValue`, ex.
"+12%") deixou de vir com `caret-up`/`caret-down`/`minus` ao lado — "o + ou
- já indica se aumentou ou diminuiu". `trendDirection` continua existindo
como prop (ainda decide a COR/tone do indicador — verde/vermelho), só
parou de desenhar ícone.

**2. trendValue + helperText na mesma linha.** Antes, `trendValue` ficava
colado no valor grande (mesma linha do `value`) e `helperText` ficava
solto numa linha própria embaixo. Agora os dois dividem uma linha só, no
RODAPÉ do card — `trendValue` (colorido) primeiro/à esquerda, `helperText`
(cinza) logo em seguida — exatamente como nas referências ("+$2,156 [pos.]
from last month [neutro]").

**3. Reestruturação geral, inspirada nas referências (item 2 do pedido).**
Rodapé separado do valor grande por uma linha divisória (`border-top:
1px solid borda-base`) + seta decorativa (`arrow-right`) alinhada à
direita, fechando a linha — mesmo affordance "ver mais" das referências.
A seta é SEMPRE neutra (`icone-secundario`), nunca colorida pelo tone —
não é parte do indicador de tendência, só um elemento visual, StatCard
continua sem `onClick` (mesmo racional do Card).

Testado no navegador nos dois temas: DashboardTemplate com os 4 StatCards
originais (Receita/Pedidos/Ticket médio/Cancelamentos) e a demo isolada do
StatCard (incluindo os casos sem trend, com trendTone sobrescrito, e
`critical=true`) — todos renderizando sem seta, trendValue+helperText na
mesma linha com a divisória e a seta neutra à direita. Contrato do StatCard
atualizado (oneLiner, anatomy, props, a11y, forbidden, decisions). Registry
atualizado. Build limpo.

### StatCard — menos espaço entre rótulo e valor (2026-08-31)

Pedido do usuário: "diminua o espaço (gap) entre o texto menor do topo e o
texto principal (maior em negrito)". `margin-top` do `.valueRow` (que
separava o valor grande do rótulo acima) usava `espaco-xp` (4px) — já o
menor token da escala estrutural do harness, então "diminuir" só era
possível indo além da escala: zerado (`margin-top: 0`, não um valor de
pixel solto — é a ausência de espaçamento extra), sobrando só o
line-height natural das duas linhas de texto como respiro. Confirmado no
navegador via `getBoundingClientRect` (gap visualmente menor em todos os
cards da demo e do DashboardTemplate, nos dois temas). Contrato atualizado
(decisions). Build limpo.

### StatCard — BUG REAL corrigido: gap rótulo→valor inconsistente com/sem ícone (2026-08-31)

Pedido do usuário: "mesmo quando aparece o ícone da direita, o texto do
topo e o principal precisam estar com o mesmo gap menor" — a rodada
anterior zerou o gap, mas só quando o card não tinha `icon`.

**Causa raiz, confirmada no navegador via `getBoundingClientRect`:** o
cabeçalho (label + iconCircle) era um flex row com `align-items: center`.
Como o `iconCircle` (36px) é mais alto que o texto do label (~20px), o
label ficava CENTRALIZADO dentro de uma linha de 36px — sobrando ~8px de
espaço vazio embaixo do próprio texto do label antes do `valueRow`
começar. Sem ícone, a linha do cabeçalho tinha exatamente a altura do
label, sem sobra nenhuma. Resultado: gap medido em 8.75px com ícone vs. 0px
sem ícone — mesmo com `margin-top:0` já aplicado nos dois casos.

**Corrigido** tirando o `iconCircle` do fluxo flex — `position: absolute`,
ancorado no canto superior direito do `.header` (que virou
`position: relative`), sem mais participar do cálculo de altura do
cabeçalho. A altura do `.header` passa a ser SEMPRE só a do texto do label,
com ou sem ícone. `.header` ganha `padding-right` (44px) só quando `icon`
está presente (nova classe condicional `.headerWithIcon`, aplicada só
nesse caso — evita espaço vazio à toa nos cards sem ícone), reservando o
espaço do círculo pra não deixar o texto do label passar por baixo dele.

Confirmado no navegador via `getBoundingClientRect`: gap label→valor agora
mede o MESMO (~0.5px, arredondamento de line-height) com e sem ícone, em
todos os cards da demo do StatCard e do DashboardTemplate, nos dois temas
— ícones continuam visualmente no canto superior direito, sem regressão.
Contrato atualizado (props, decisions). Build limpo.

### Nova regra padrão — conteúdo de páginas AppShell sempre dentro de um card (2026-08-31)

Pedido do usuário (regra geral, não uma correção pontual): "Sobre o
BackofficeTemplate e todas as páginas que usam a mesma estrutura: Sempre
coloque os conteúdos da página, dentro do card que está no centro da tela,
exceto em casos que seja dada uma outra direção explícita."

Auditoria dos 2 consumidores atuais do AppShell (`BackofficeTemplate`,
`CrudTemplate` — únicos, confirmado via grep): os dois já seguem a regra.
`BackofficeTemplate` usa `.emptyCard` (superfície fundo-superficie/
borda-base/raio-p) explicitamente. `CrudTemplate` não envolve o `Datatable`
num `Card` à parte, mas o próprio `Datatable` já desenha essa MESMA
superfície de card sozinho (fundo-superficie/borda-base/raio-pp,
confirmado em `Datatable.module.css`) — envolvê-lo em outro `Card`
duplicaria a borda, então já está em conformidade sem mudança de código.

Regra documentada em dois lugares pra sobreviver além desta conversa: (1)
JSDoc da prop `children` em `AppShell.tsx` — qualquer autor de template
futuro vê a regra direto na fonte; (2) memória de projeto (tipo feedback,
`feedback_ds_alpha_backoffice_content_in_card.md`) — aplicada
automaticamente em sessões futuras, sem precisar ser repetida. Nenhuma
mudança de código necessária além da documentação, já que não havia
violação atual. Build limpo (só JSDoc alterado).

### Correção — CrudTemplate NÃO estava em conformidade, Datatable não cobre a própria toolbar (2026-09-01)

Pedido do usuário revisitando a entrada acima: "Aplique a lógica do
conteúdo dentro do card, para a página CrudTemplate" — cutucando a
conclusão anterior de "já está em conformidade, sem mudança de código".

Reexame de `Datatable.module.css`: `.container` (raiz, contém a toolbar
com título/densidade/colunas/exportação) NÃO tem borda nem background —
só `display:flex; flex-direction:column; gap`. Só o `.wrapper` interno
(que envolve exclusivamente a `<table>`) desenha
`border: 1px solid borda-base` + `border-radius`. Ou seja: a linha de
título + botão "Novo registro" + ícones da toolbar ficava solta
diretamente sobre o fundo da página (fundo-secundario/fundo-superficie),
fora de qualquer card — a conclusão anterior estava errada. `Card`
(átomo) foi descartado como wrapper porque `Card.module.css` sempre
aplica `border: 1px solid borda-base` sem prop pra remover — duplicaria a
borda do `.wrapper` do Datatable.

Mudança de código: `CrudTemplate.module.css` ganhou `.contentCard`, cópia
exata do padrão do `.emptyCard` do BackofficeTemplate (fundo-superficie
no claro/fundo-secundario no escuro, `raio-p`, sem borda, width 100%/
min-height 100%). `CrudTemplate.tsx` envolve o `<Datatable>` nesse
`<div className={styles.contentCard}>`, dentro do `.body` já existente.
Os dois `Modal` (confirmação em lote, "Novo cliente") continuam FORA do
`.contentCard`, como filhos diretos do `AppShell` — overlay não entra
nessa regra.

Verificado no navegador: título "Clientes", botão "Novo registro" e
ícones de densidade/colunas/exportação agora ficam dentro da mesma
superfície branca que envolve a tabela — sem mais salto visual entre
toolbar e tabela. Tema escuro conferido via `getComputedStyle`: card
`rgb(32,32,31)` mais claro que o fundo da página `rgb(22,22,22)`, mesmo
contraste do BackofficeTemplate. Modal "Novo cliente" testado (abre por
cima do card normalmente) e modal de confirmação em lote também segue
funcionando, sem regressão da reestruturação do JSX.

Documentação corrigida nos dois lugares que citavam a conclusão errada:
JSDoc de `children` em `AppShell.tsx` (agora explica que o `.wrapper` do
Datatable só cobre a `<table>`, não a toolbar) e a memória de projeto
`feedback_ds_alpha_backoffice_content_in_card.md` (seção "How to apply"
reescrita). Build limpo.

### Auditoria completa (contratos, Playground, A11y) + documentação estruturada + preparação para GitHub (2026-09-01)

Pedido do usuário: auditar e corrigir inconsistências entre contratos e
tokens, entre o Playground e os contratos, fazer um check de A11y
detalhado, documentar tudo o que foi decidido até agora, e preparar o
projeto (agora com o nome de marca LVXFR) pra ser enviado a testadores
externos via GitHub. Executado em 4 fases, cada uma com achados via
agentes Explore (read-only) antes de qualquer edição, e build limpo ao
final de cada fase que tocou código.

**Fase 1 — contratos vs tokens.** 23 contratos amostrados (todos os
recém-tocados + os maiores/mais complexos). Nenhuma prop documentada
divergia do TSX real, e nenhum token usado no CSS estava ausente de
`tokens/tokens.css` — o problema real, em 12 contratos, era
`tokensAllowed` SUBDECLARADO: o CSS já usava o token certo
(normalmente `raio-xp`, `foco-espessura`/`borda-foco` do anel de foco,
ou uma categoria inteira ausente como `focusRing`/`border`/`iconColor`/
`typography`), só o contrato não listava. Corrigido em: `select`,
`combobox`, `modal`, `toast`, `rating`, `call-control-bar`, `user-card`,
`file-upload`, `side-nav`, `navbar`, `drawer`, `date-time-picker` — cada
um com uma entrada `CORRIGIDO — auditoria de contratos (2026-09-01)` no
próprio array `decisions`, verificado por grep no CSS real antes de
editar (não por suposição).

**Fase 2 — Playground vs contrato.** Nenhum contrato órfão, nenhuma
entrada de registry sem contrato correspondente (67 contratos = 67
entradas), nenhum valor de prop usado em demo fora do enum do contrato.
O gap era o oposto: variante/estado documentado sem nenhum exemplo
visual no demo. Adicionados exemplos faltantes em 8 arquivos:
`BadgeDemo` (inverted, os 4 cantos de position), `StatCardDemo` (os 4
valores de elevation), `FileUploadDemo` (state=error/disabled,
buttonVariant=link, buttonOutlined, required, dropzoneLabel),
`SideNavDemo` (mobileOpen controlado, width=small), `NotificationCenterDemo`
(estados empty e filtered-empty), `KanbanBoardDemo` (board estático sem
onMoveTicket), `PopoverDemo` (tone=dark isolado), `ModalDemo`
(padding=medium explícito). Todos os 8 verificados visualmente no
navegador depois de um restart do dev server (o server antigo tinha
cache de módulo esbuild desatualizado de edições anteriores da sessão,
causando erros de referência tipo "footerMobile is not defined" que não
tinham nada a ver com este trabalho — resolvido com
`rm -rf node_modules/.vite` + restart).

**Fase 3 — A11y, 3 bugs reais confirmados e corrigidos:**
1. `Popover` nunca envolvia o painel em `FloatingFocusManager` (só
   useClick/useDismiss/useRole) — o contrato já prometia "Esc devolve o
   foco pro gatilho", mas sem FloatingFocusManager isso não era
   garantido de verdade. Mesmo padrão cru (sem o componente Popover)
   também existia em `NavBar` (NavBarDropdown) e `Datatable`
   (useDropdown, menus de coluna/exportação) — CallControlBar já usa o
   componente Popover internamente, então ganhou o fix de graça.
   Corrigido nos 3 lugares (`FloatingFocusManager context={context}
   modal={false}`, useDropdown do Datatable passou a expor `context`).
   Verificado no navegador: abrir o Popover, apertar Esc, foco volta
   pro botão "Editar apelido" (confirmado via `document.activeElement`).
2. `Wizard` não movia o foco pro conteúdo da nova etapa ao avançar,
   apesar do contrato prometer isso (`a11y.requiredAria`) — zero
   `useRef`/`.focus()` no componente. Corrigido com um `ref` + `tabIndex={-1}`
   no container do conteúdo e um `useEffect` que foca ao mudar
   `currentStep`. Verificado: avançar de "Dados pessoais" pra "Contato"
   move `document.activeElement` pro `<div class="_content_...">`.
3. `SideNav`, itens de grupo no trilho recolhido (collapsed=true)
   renderizavam como `<span aria-hidden="true">`, sem tabIndex nem
   aria-label — inalcançáveis e sem nome por teclado, contradizendo duas
   promessas do próprio contrato. Corrigido trocando por
   `<button type="button" aria-label={item.label}>` (foco nativo, sem
   handler extra — o onFocus que já existia no wrapper continua
   funcionando via bubbling). CSS reset adicionado em `.railItem` pro
   button não herdar estilo de botão nativo do navegador, mais
   `:focus-visible` com o mesmo anel de foco do resto do harness.
   Verificado: `document.querySelectorAll('[class*="railItem"]')`
   confirma tag BUTTON + aria-label "Documentos" + tabIndex 0; `.focus()`
   programático no botão abre o painel completo por cima do conteúdo.

**Fase 4 — documentação estruturada.**
`SKILL.md`: a seção "Estrutura de arquivos" enumerava manualmente ~30
dos 67 componentes e não mencionava `AppShell`/`CrudTemplate`/
`BackofficeTemplate` — reescrita pra não depender de manutenção manual
(aponta pra `ls contratos/*.contract.json` como fonte viva, em vez de
uma segunda lista fadada a desatualizar) e ganhou um parágrafo sobre a
estrutura de `interface/screens/` (Templates vs Páginas, AppShell, a
regra do card central). Novo `scripts/changelog.mjs` (+ `npm run
changelog`): varre todo `contratos/*.json`, extrai `decisions[]` de
cada um, e gera `CHANGELOG.md` consolidado (seção com data explícita
ordenada mais recente primeiro + seção completa por componente) — cobre
"documentar tudo o que foi decidido até agora" de um jeito que não fica
velho sozinho, porque a fonte real continua sendo os próprios
contratos. Novo `ARCHITECTURE.md`: visão de alto nível (o que é
contrato executável, como as 4 camadas — tokens/contratos/componentes/
interface — se encaixam, Templates vs Páginas, a regra do AppShell,
como criar um protótipo novo sem duplicar o projeto, por que não há
dedup prematuro, o que auditar periodicamente).

Build limpo ao final de cada fase (1, 2, 3). Próximo passo (fora desta
entrada): preparar `README.md`, `CONTRIBUTING.md`, workflow de GitHub
Actions e publicar o repositório privado — ver entrada seguinte quando
concluído.

### Repositório publicado + ícone da marca trocado pra sparkle (2026-09-01/02)

Publicado como privado primeiro (`gh repo create lvxfr --private`), depois trocado
pra público a pedido do usuário. `.claude/settings.local.json` deixado de fora do
commit (pessoal/local, convenção do Claude Code) via `.gitignore`. Ícone da marca
(LogoIcon em `AppShell.tsx`, `LoginScreen.tsx`, `SideNavDemo.tsx`) trocado de `leaf`
pra `sparkle` — `leaf` removido do registro fechado do Icon por não ter mais consumidor
real, mesmo padrão já usado quando envelope/envelope-open foram removidos. O primeiro
push do workflow de CI falhou por o token do `gh` não ter o escopo `workflow`
(rejeitado pelo GitHub); publicado o resto sem ele, usuário reautorizou o escopo
(`gh auth refresh -s workflow`) e o workflow foi enviado num commit separado.

### ProtoTable — índice de protótipos separado do Playground + auto-sync de git (2026-09-02)

Pedido do usuário: como dono do repositório (agora público), ver todos os protótipos
criados/atualizados por qualquer testador, com autoria/data/histórico de versão — sem
misturar essa visão com o DS Playground (vitrine de componentes, não de produtos). Como
o uso é interno a uma única empresa (vários produtos, todo mundo vendo tudo, sem
preocupação de privacidade), o usuário topou automatizar commit+push dos protótipos por
padrão, não só lembrar. Nome confirmado: **ProtoTable** (existe um produto homônimo,
prototable.gg, prototipagem de jogos de cartas físicos — domínio sem relação, sem risco
real de confusão).

Peça central de design: como cada testador roda o projeto localmente sem backend, a
única fonte de verdade sem duplicação é o próprio histórico git de cada pasta — mesma
filosofia já usada em `scripts/changelog.mjs` (ler o que já existe, não manter um
registro paralelo).

Implementado:
- `src/interface/prototable/registry.ts` — registro de protótipos PRÓPRIO, separado de
  `stories/registry.ts` do Playground (mesmo que aponte pras mesmas pastas de
  `src/interface/screens/` hoje) — registrar um protótipo aqui é um passo a mais,
  documentado em CONTRIBUTING.md.
- `scripts/prototable-manifest.mjs` — roda `git log --follow` em cada `screenPath`
  registrado e monta criadoPor/criadoEm/atualizadoPor/atualizadoEm/histórico completo.
  Exporta `buildManifest()` (reaproveitado pelo plugin do Vite, sem duplicar lógica) e
  funciona também como CLI (`--out <path>` grava JSON estático).
- `vite.config.ts` — plugin `prototableManifestPlugin` serve `GET
  /__prototable-manifest` em dev, rodando o manifesto sob demanda a cada request (sem
  precisar reiniciar o servidor pra refletir novos commits). Fora de dev, `npm run
  build` roda `prebuild` gerando `src/interface/prototable/manifest.json` estático,
  usado como fallback.
- `src/interface/prototable/ProtoTablePage.tsx` — reaproveita o **Datatable** já
  existente (não criou uma tabela do zero) pra listar os protótipos, com Drawer pro
  histórico de commits de cada um. Ação "Abrir" linka pro `?standalone=<id>` já
  existente no Playground (sem duplicar a rota).
- `src/interface/App.tsx` — toggle de topo (2 abas, "DS Playground"/"ProtoTable") que
  troca a árvore inteira renderizada — as duas telas não compartilham Sidebar/dados,
  satisfazendo o pedido de não misturar.
- `scripts/proto-autosync.mjs` — observa as pastas registradas (`fs.watch`, sem
  dependência nova), debounce de 20s (configurável via
  `PROTO_AUTOSYNC_DEBOUNCE_MS`), então `git add` escopado (nunca `-A`) + commit + push
  (com `-u origin <branch>` se ainda não houver upstream). NUNCA `--force` — se o push
  falhar (histórico divergente), só loga um aviso pra resolução manual. Log visível no
  terminal a cada ação, automação não é silenciosa.
- `scripts/dev-with-autosync.mjs` — orquestrador leve (só `child_process.spawn` da
  stdlib) que sobe `vite` + `proto-autosync.mjs` juntos; `package.json` `"dev"` passa a
  chamar esse orquestrador. Opt-out: `PROTO_AUTOSYNC=0 npm run dev` (só sobe o Vite).

Verificado ponta a ponta no navegador e via terminal: ProtoTable carrega o manifesto
real (autoria/data corretas pro histórico existente do repo), "Ver histórico" abre o
Drawer com a lista de commits, link standalone testado direto por URL. Autosync testado
de verdade: uma edição real em `LoginScreen.tsx` foi automaticamente commitada
(`72a7284 auto: sync protótipo src/interface/screens/LoginScreen (...)`) e enviada pro
`origin/main` do repositório público sem nenhuma ação manual — confirmado comparando
`git log` local com `git fetch origin main`. Opt-out (`PROTO_AUTOSYNC=0`) testado
separadamente, confirmando que só o Vite sobe nesse caso. Build limpo (`npm run build`,
que já roda o `prebuild` do manifesto) em cada etapa.

Limite documentado no README/CONTRIBUTING: o dono só vê o que foi de fato commitado E
enviado (push) — trabalho só local nunca aparece, mesmo com a automação ligada, se o
processo de dev nunca chegou a rodar (ex.: a pessoa só editou e nunca subiu `npm run
dev`).
