# Análise de componentes — sistemas legados (Design System antigo)

Documento de análise pura, sem criação/alteração de contrato ou token. Baseado em prints
enviados pelo usuário de 5 sistemas internos (não voltados ao beneficiário 60+): Guia
Médico, Visão 360, Contas Médicas, SolicitaMed, Videochamada (Entrevista/Avaliação
qualificada), Fornecedores, Credenciamento, Corretor/Vendas, Internações, Prestadores.

Importante: essas telas refletem o DS antigo — não são referência estética, só inventário
funcional de padrões repetidos que ainda não têm equivalente no harness atual.

---

## 1. Componentes amplamente usados e ainda não planejados — construir

### 1.1 DataField / InfoField (átomo) — ⭐ maior prioridade
Par ícone + rótulo (linha fina, cinza) + valor (linha forte, texto-primário), dentro de
uma caixa com borda leve e cantos arredondados. É o padrão mais repetido de todos os
prints: aparece em Visão 360 (Dados do beneficiário, Contatos de saúde, Contatos gerais),
Detalhamento do ticket (Credenciamento), Detalhamento empresa, Abertura de Ticket
(identificação), Internações (dados gerais), proposta do corretor. Hoje o harness não tem
um átomo dedicado pra "campo somente-leitura rotulado" — cada tela reimplementaria isso na
mão. Forte candidato a virar átomo (ou molécula simples, se incluir estado "editável"
opcional) reaproveitado por HelperText/FieldLabel/Icon já existentes.

### 1.2 Cartão de seleção rico (Selectable Card) — molécula
Cartão radio-selecionável com título, descrição, preço/valor e uma tag/Badge no canto
(ex.: "Padrão", "Promocional", "Black", "Infinite"), estado selecionado com fundo escuro
sólido. Visto no fluxo de venda do corretor (planos disponíveis) — mas o padrão geral
(cartão com badge + preço + estado selecionado) é comum o bastante em fluxos de escolha de
plano/produto pra justificar um componente próprio, em vez de recriar Radio + Card + Badge
toda vez.

### 1.3 Timeline com "caixa de valor" destacada e anexos — extensão de Timeline
A Timeline já planejada (marcador colorido + linha + título/descrição/timestamp) aparece
nos prints, mas em 3 lugares (Visão 360 → Histórico do caso, Internações → Histórico,
Detalhe de solicitação SolicitaMed) cada item tem, ALÉM do título, uma caixinha colorida
com o "valor" do evento (ex.: "Registro alta: 02/08/2024" num box verde) e links de anexo
("Ver arquivo em anexo", "Ver formulário de alta"). É um padrão consistente o bastante
(3 sistemas diferentes) pra virar uma variante formal da Timeline, não general purpose
`content: node` livre.

### 1.4 Action Card (molécula) — cartão de ação administrativa
Cartão com: ícone colorido no topo-esquerdo, dois ícones utilitários no topo-direito
(info "i" e engrenagem de configuração), título, descrição, indicador de status (bolinha +
texto, ex. "Situação atual"/"Vendas ativas") e um ou dois botões de ação (principal +
secundária). Visto em grade 3×3 no "Painel de supervisão" (Corretor) — 9 cartões desse
mesmo formato. Também aparece de forma simplificada nas Ações principais do SolicitaMed
(ícone + título, sem descrição/status). Padrão amplo o bastante (grade de ações
administrativas) pra ser um componente, não Card genérico remontado.

### 1.5 Kanban Board (organismo) + Ticket Card (molécula)
Board com colunas fixas (Novos / Em andamento / Concluídos), contador no cabeçalho de
cada coluna, cartões arrastáveis(?) com: Badge de prioridade com ícone de bandeira
(Atrasado/Urgente/Atenção/No prazo — 4 variantes de cor), badge de prazo com ícone de
ampulheta + "N dias", título, linhas de metadado (rótulo + valor), avatar/menu de
overflow (···). Visto no módulo de Tickets do Credenciamento. Um board Kanban genérico
(colunas + cartões) é um padrão comum o bastante em sistemas internos de operação/suporte
pra merecer componentização — mesmo que o board em si vire um organismo, o Ticket Card é
reaproveitável isolado (ex. numa lista simples).

### 1.6 Painel de filtros + KPIs de dashboard (organismo/template)
Repetido em Credenciamento (Dashboard), Contas Médicas, SolicitaMed (Página inicial): uma
barra de filtros (vários Select + range de data com botão limpar "×") acima de uma grade
de indicadores numéricos (ícone + número grande + rótulo, às vezes com cor de status) —
isso já é essencialmente o StatCard planejado, mas o "grid de StatCards + barra de filtro
acima" como composição de template de dashboard se repete tantas vezes (4 sistemas) que
vale documentar como um padrão de Template ("DashboardFiltrosTemplate"), não só um
StatCard isolado.

### 1.7 Barra de progresso rotulada com contagem (molécula)
Linha "Rótulo — barra de progresso colorida — número/contagem" (ex.: "No prazo — barra
cinza — 50 Qt", "Atrasado — barra vermelha escura — 25 Qt"). Aparece no Dashboard do
Credenciamento (Prioridade, Tempo médio por status, Rede de atendimento, Regime de
atendimento) — 4 blocos desse padrão na mesma tela. Progress Bar já está planejada como
átomo; falta a composição "lista de N barras rotuladas com valor à direita", que se repete
o bastante pra ser uma molécula própria (ProgressList / StatBarList) em vez de cada tela
remontar o layout.

### 1.8 Compositor de nota/comentário (molécula)
Textarea com placeholder "Insira sua nota/observação aqui...", barra de ícones utilitários
embaixo (anexar imagem, marcar como importante/alerta, emoji) e botão "Publicar"
desabilitado até haver texto. Visto no painel de Notas & Observações da Avaliação
qualificada (videochamada) — e o padrão "campo de texto + toolbar de ícones + botão
enviar" é genérico o bastante pra reaparecer em qualquer tela de comentários/observações
(SAC, auditoria, etc.), então vale um componente dedicado em vez de TextField + Button
remontados a cada nova tela desse tipo.

### 1.9 Barra de controles de chamada (molécula) — específico de videochamada
Fileira de botões circulares (encerrar chamada em vermelho, microfone, câmera,
configurações) fixada na parte inferior da tela de vídeo. Aparece em pelo menos 4 telas
diferentes do fluxo de videochamada (Entrevista qualificada, Avaliação, Notas). Se o
harness for cobrir telas de telemedicina/videochamada no futuro, esse é o controle mais
repetido do fluxo e merece virar molécula própria — mas ver nota na seção 2 se o volume de
telas de vídeo no roadmap real for baixo.

---

## 2. Componentes pouco usados e não planejados — sugestão de substituição

### 2.1 Seletor numérico em escala (1 a 10) — baixo uso
Visto só uma vez: avaliação de "Classificação" do corpo clínico do prestador (10 círculos
numerados, um destacado em verde). Não recomendo um componente novo pra um uso isolado —
sugiro reaproveitar o próprio Rating (com `max=10`, `allowHalf=false`) trocando a estrela
por um estilo numérico, OU, se a semântica de "escolher 1 de 10 categorias numeradas" for
mais comum no futuro, tratar como uma variante nova do RadioGroup horizontal (já
planejado) em vez de um átomo à parte.

### 2.2 Indicador de passos em pontinhos (dots) — baixo uso, conflita com Stepper
Visto no formulário "Abertura de Ticket" (5 pontinhos no canto, um preenchido indicando a
etapa atual) e no carrossel de banners ("Boas vindas!", "Entrevista qualificada" da
Avaliação) como indicador de slide. São dois usos DIFERENTES do mesmo visual (progresso de
formulário vs. posição de carrossel) — nenhum dos dois justifica um átomo novo:
- Como indicador de etapa de formulário: já temos Stepper — sugiro reaproveitar Stepper
  numa variante compacta (só os marcadores, sem texto/linha) em vez de criar um
  "StepDots" paralelo.
- Como indicador de carrossel: se um Carousel vier a ser planejado (ver 2.4), os dots são
  parte do próprio componente, não um átomo isolado.

### 2.3 Cartão de seção colapsável com cabeçalho de ícone circular — baixo uso
Visto na tela de proposta do corretor (Indicadores, Cliente, Dados residenciais, Plano
contratado, Responsável contratual, Declaração de saúde — cada bloco com ícone circular +
título + chevron pra colapsar). É funcionalmente um Accordion (que já está planejado) só
que com estilo "card elevado" em vez de lista flat com divisórias internas. Não sugiro um
componente novo — sugiro que, quando o Accordion for usado em contexto de formulário longo
como este, cada item simplesmente venha envolto num Card por fora (Accordion dentro de
Card), sem precisar de uma variante visual nova no contrato do Accordion.

### 2.4 Carrossel/banner com setas de navegação — baixo uso
Visto 2 vezes (Dashboard "Boas vindas!" do Credenciamento e banner "Certificado digital
chegou!" do SolicitaMed) — ambos com o mesmo padrão (imagem/banner + setas esquerda/direita
+ dots). Uso baixo o bastante (2 telas, conteúdo puramente promocional/informativo) pra não
justificar um organismo Carousel dedicado agora — sugiro, se aparecer um terceiro caso
real, reavaliar; até lá, tratar como composição pontual de Card + Button iconOnly (setas) +
indicador de posição simples.

### 2.5 Visualizador de imagem com zoom/rotação — baixo uso
Visto uma vez, na tela de proposta do corretor (foto do cliente com controles de zoom %,
setas de navegação entre páginas, rotação). É uma funcionalidade rica e específica
(verificação de documento/selfie) — não recomendo generalizar num componente do harness
agora com um único caso de uso; sugiro tratar como funcionalidade de produto específica
(fora do design system) até que apareça um segundo contexto real de uso.

### 2.6 Lista de dois painéis com busca (transfer list) — baixo uso
Visto uma vez, no SolicitaMed (seleção de exames/procedimentos: painel esquerdo com abas
Todos/Favoritos/Cirurgias/Grupos + busca + paginação, painel direito "selecionados").
Padrão rico e específico o bastante pra não generalizar agora — sugiro compor com
ComboBox/Select + Datatable/lista já existentes nesse caso específico, em vez de criar um
"TransferList" novo com um único consumidor real até o momento.

### 2.7 Grupo horizontal de rótulos "checklist inline" separados por travessão — baixo uso
Visto uma vez, no rodapé dos cartões de beneficiário em "Detalhamento empresa"
("Termo de compra — Documentação — Avaliação saúde", cada item com uma bolinha de
estado). Sugiro não criar componente novo — isso é essencialmente um Stepper inline
compacto (mesma semântica de "etapas concluídas/pendentes" que o Stepper já cobre);
se o padrão se repetir em mais telas, reaproveitar Stepper variant="inline" (já planejado)
em vez de uma solução paralela.

---

## 3. Observações transversais (não são itens novos, são ajustes de cobertura)

- **Badge com mais variantes semânticas de status**: os prints mostram até 5 estados de
  aprovação num mesmo domínio (Autorizado, Autorização Parcial, Em Análise, Carência
  Contratual, Recusado — tela de detalhe de solicitação do SolicitaMed) e 4 variantes de
  prioridade com ícone de bandeira (Atrasado/Urgente/Atenção/No prazo — Kanban do
  Credenciamento). O Badge atual cobre bem status genérico (sucesso/aviso/erro/info) mas
  não cobre "Badge com ícone à esquerda do texto" nem esse volume de variantes
  específicas de domínio — vale registrar como necessidade futura de ajuste ao Badge (não
  requer componente novo, é ampliação de variante), quando entrarmos na fase de contrato.
- **Chip como filtro-de-categoria em linha** (ex.: tipo de serviço, rede de atendimento,
  tipo de demanda no "Detalhamento do ticket") já está bem coberto pelo Chip planejado —
  nenhum ajuste necessário.
- **Ícone de navegação por categoria (icon nav)** — fileira horizontal de ícone + rótulo
  abaixo, sem borda, clicável (Guia Médico: Pronto Socorro/Médicos/Hospitais/Clínicas/
  Laboratórios/Tele Consultas/Exames) — vale observar como possível variante do
  SegmentedControl ou um padrão de navegação secundária a considerar depois; não incluí
  como item novo porque não há um segundo domínio real usando esse padrão exato ainda
  (só o Guia Médico), mas é próximo o bastante do que já existe pra provavelmente não
  precisar de componente dedicado.

---

## Resumo executivo

**Construir (uso alto, 3+ sistemas cada):**
DataField/InfoField · Selectable Card (plano/produto) · Timeline com caixa-de-valor +
anexos (extensão) · Action Card · Kanban Board + Ticket Card · Painel filtro+KPIs
(template) · Progress List rotulada · Compositor de nota/comentário · Barra de controles
de chamada (se telemedicina entrar no roadmap)

**Não construir agora — reaproveitar o que já existe/está planejado:**
Seletor numérico 1-10 → Rating/RadioGroup · Dots de progresso → Stepper compacto ·
Cartão colapsável com ícone circular → Accordion dentro de Card · Carrossel → adiar até
3º caso real · Visualizador de imagem com zoom → fora do DS por ora · Transfer list →
compor com ComboBox/lista existente · Checklist inline com travessão → Stepper inline
