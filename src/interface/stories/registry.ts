import type { StoryMeta } from "./types";
import { IconDemo } from "./atoms/IconDemo";
import { HelperTextDemo } from "./atoms/HelperTextDemo";
import { TooltipDemo } from "./atoms/TooltipDemo";
import { SpinnerDemo } from "./atoms/SpinnerDemo";
import { ProgressBarDemo } from "./atoms/ProgressBarDemo";
import { SkeletonDemo } from "./atoms/SkeletonDemo";
import { CheckboxDemo } from "./atoms/CheckboxDemo";
import { RadioDemo } from "./atoms/RadioDemo";
import { RadioGroupDemo } from "./molecules/RadioGroupDemo";
import { SwitchDemo } from "./atoms/SwitchDemo";
import { DividerDemo } from "./atoms/DividerDemo";
import { BadgeDemo } from "./atoms/BadgeDemo";
import { AvatarDemo } from "./atoms/AvatarDemo";
import { StackedTextDemo } from "./atoms/StackedTextDemo";
import { DataFieldDemo } from "./atoms/DataFieldDemo";
import { QuantitySelectorDemo } from "./atoms/QuantitySelectorDemo";
import { ImageThumbnailDemo } from "./atoms/ImageThumbnailDemo";
import { OtpDemo } from "./atoms/OtpDemo";
import { AvatarGroupDemo } from "./atoms/AvatarGroupDemo";
import { PasswordStrengthMeterDemo } from "./atoms/PasswordStrengthMeterDemo";
import { CopyButtonDemo } from "./atoms/CopyButtonDemo";
import { ConfirmDialogDemo } from "./organisms/ConfirmDialogDemo";
import { WizardDemo } from "./organisms/WizardDemo";
import { RatingDemo } from "./atoms/RatingDemo";
import { ButtonDemo } from "./atoms/ButtonDemo";
import { ChipDemo } from "./atoms/ChipDemo";
import { AccordionDemo } from "./molecules/AccordionDemo";
import { CalendarDemo } from "./molecules/CalendarDemo";
import { DatePickerDemo } from "./molecules/DatePickerDemo";
import { TimePickerDemo } from "./molecules/TimePickerDemo";
import { DateTimePickerDemo } from "./molecules/DateTimePickerDemo";
import { FileUploadDemo } from "./molecules/FileUploadDemo";
import { PaginationDemo } from "./molecules/PaginationDemo";
import { SliderDemo } from "./molecules/SliderDemo";
import { SegmentedControlDemo } from "./molecules/SegmentedControlDemo";
import { PopoverDemo } from "./molecules/PopoverDemo";
import { TimelineDemo } from "./molecules/TimelineDemo";
import { StatCardDemo } from "./molecules/StatCardDemo";
import { ProgressListDemo } from "./molecules/ProgressListDemo";
import { SelectableCardDemo } from "./molecules/SelectableCardDemo";
import { ActionCardDemo } from "./molecules/ActionCardDemo";
import { CommentComposerDemo } from "./molecules/CommentComposerDemo";
import { CallControlBarDemo } from "./molecules/CallControlBarDemo";
import { TicketCardDemo } from "./molecules/TicketCardDemo";
import { UserCardDemo } from "./molecules/UserCardDemo";
import { NotificationCenterDemo } from "./organisms/NotificationCenterDemo";
import { FilterBarDemo } from "./molecules/FilterBarDemo";
import { StepperDemo } from "./molecules/StepperDemo";
import { TabsDemo } from "./molecules/TabsDemo";
import { LinkDemo } from "./atoms/LinkDemo";
import { BreadcrumbDemo } from "./molecules/BreadcrumbDemo";
import { FieldLabelDemo } from "./molecules/FieldLabelDemo";
import { TextFieldDemo } from "./molecules/TextFieldDemo";
import { TextareaDemo } from "./molecules/TextareaDemo";
import { CardDemo } from "./molecules/CardDemo";
import { EmptyStateDemo } from "./molecules/EmptyStateDemo";
import { AlertDemo } from "./molecules/AlertDemo";
import { ToastDemo } from "./molecules/ToastDemo";
import { SelectDemo } from "./molecules/SelectDemo";
import { ComboBoxDemo } from "./molecules/ComboBoxDemo";
import { SettingsTemplateDemo } from "./pages/SettingsTemplateDemo";
import { DashboardTemplateDemo } from "./pages/DashboardTemplateDemo";
import { KanbanTemplateDemo } from "./pages/KanbanTemplateDemo";
import { BackofficeTemplateDemo } from "./pages/BackofficeTemplateDemo";
import { CrudTemplateDemo } from "./pages/CrudTemplateDemo";
import { LoginScreenDemo } from "./pages/LoginScreenDemo";
import { ForgotPasswordScreenDemo } from "./pages/ForgotPasswordScreenDemo";
import { ResetPasswordScreenDemo } from "./pages/ResetPasswordScreenDemo";
import { SignUpScreenDemo } from "./pages/SignUpScreenDemo";
import { TwoFactorScreenDemo } from "./pages/TwoFactorScreenDemo";
import { OnboardingScreenDemo } from "./pages/OnboardingScreenDemo";
import { ErrorScreenDemo } from "./pages/ErrorScreenDemo";
import { SuccessScreenDemo } from "./pages/SuccessScreenDemo";
import { ConnectionErrorScreenDemo } from "./pages/ConnectionErrorScreenDemo";
import { FullPageLoadingDemo } from "./pages/FullPageLoadingDemo";
import { ModalDemo } from "./organisms/ModalDemo";
import { DrawerDemo } from "./organisms/DrawerDemo";
import { NavBarDemo } from "./organisms/NavBarDemo";
import { SideNavDemo } from "./organisms/SideNavDemo";
import { DatatableDemo } from "./organisms/DatatableDemo";
import { KanbanBoardDemo } from "./organisms/KanbanBoardDemo";

export const STORIES: StoryMeta[] = [
  {
    id: "icon",
    title: "Icon",
    group: "Átomos",
    status: "draft",
    category: "display",
    contractFile: "contratos/icon.contract.json",
    dependencies: [],
    tokensSummary: ["semantic.icone-*", "semantic.acao-*-texto", "structural.icone-*"],
    description: "Única porta de entrada pra biblioteca Phosphor. Cor sempre explícita, nunca herdada.",
    code: `<Icon name="info" size="medium" color="var(--icone-secundario)" />
<Icon name="arrow-right" size="large" color="var(--acao-primaria)" />
<Icon name="eye" decorative={false} accessibleLabel="Mostrar senha" />`,
    Demo: IconDemo,
  },
  {
    id: "helper-text",
    title: "HelperText",
    group: "Átomos",
    status: "draft",
    category: "display",
    contractFile: "contratos/helper-text.contract.json",
    dependencies: [],
    tokensSummary: ["semantic.texto-secundario", "semantic.texto-erro", "type-style.texto-p"],
    description: "Texto auxiliar abaixo de um campo — ajuda neutra ou erro.",
    code: `<HelperText text="Mínimo de 8 caracteres." intent="default" />
<HelperText text="E-mail inválido." intent="error" />`,
    Demo: HelperTextDemo,
  },
  {
    id: "tooltip",
    title: "Tooltip",
    group: "Átomos",
    status: "draft",
    category: "overlay",
    contractFile: "contratos/tooltip.contract.json",
    dependencies: [],
    tokensSummary: ["semantic.fundo-invertido", "semantic.texto-invertido", "structural.raio-pp"],
    description: "Sobreposição curta ancorada a um gatilho externo. Abre por hover, foco e toque.",
    code: `<Tooltip text="Dica curta e objetiva." placement="top">
  <button>gatilho</button>
</Tooltip>`,
    Demo: TooltipDemo,
  },
  {
    id: "spinner",
    title: "Spinner",
    group: "Átomos",
    status: "draft",
    category: "display",
    contractFile: "contratos/spinner.contract.json",
    dependencies: [],
    tokensSummary: ["semantic.acao-*-texto / semantic.icone-*", "structural.icone-*"],
    description: "Indicador de carregamento em andamento. Cor sempre explícita, nunca herdada — mesma regra do Icon.",
    code: `<Spinner size="medium" color="var(--acao-primaria)" />
<Spinner color="var(--acao-destrutiva)" decorative={false} accessibleLabel="Carregando" />`,
    Demo: SpinnerDemo,
  },
  {
    id: "progress-bar",
    title: "Progress Bar",
    group: "Átomos",
    status: "draft",
    category: "display",
    contractFile: "contratos/progress-bar.contract.json",
    dependencies: [],
    tokensSummary: ["semantic.acao-primaria/borda-sucesso/borda-erro/borda-aviso/borda-inativo", "semantic.acao-destrutiva-pressionada (critical)", "semantic.fundo-secundario", "structural.raio-circular"],
    description: "Progresso mensurável (0-100%) — diferente do Spinner, que é indeterminado. accessibleLabel é sempre obrigatório. Variantes warning/critical/neutral pensadas pra listas de prioridade (ver ProgressList).",
    code: `<ProgressBar value={42} accessibleLabel="Enviando arquivo" showValue />
<ProgressBar value={100} variant="success" accessibleLabel="Envio concluído" />`,
    Demo: ProgressBarDemo,
  },
  {
    id: "skeleton",
    title: "Skeleton",
    group: "Átomos",
    status: "draft",
    category: "display",
    contractFile: "contratos/skeleton.contract.json",
    dependencies: [],
    tokensSummary: ["semantic.acao-inativa", "structural.raio-xp/pp/circular"],
    description: "Silhueta do formato do conteúdo carregando — diferente do Spinner. Sempre aria-hidden; animação respeita prefers-reduced-motion.",
    code: `<Skeleton shape="circle" />
<Skeleton shape="text" width="60%" />
<Skeleton shape="rect" height="160px" />`,
    Demo: SkeletonDemo,
  },
  {
    id: "checkbox",
    title: "Checkbox",
    group: "Átomos",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/checkbox.contract.json",
    dependencies: ["Icon", "HelperText"],
    tokensSummary: ["semantic.acao-primaria", "semantic.borda-*", "structural.raio-xp"],
    description: "Controle booleano — marcado, desmarcado ou indeterminado. Todo o <label> é clicável, não só a caixa.",
    code: `<Checkbox label="Lembrar-me" checked={lembrar} onChange={setLembrar} />
<Checkbox label="Selecionar tudo" checked={false} indeterminate />
<Checkbox label="Aceito os termos" required checked={ok} state={ok ? "default" : "error"} helperText="..." />`,
    Demo: CheckboxDemo,
  },
  {
    id: "radio",
    title: "Radio",
    group: "Átomos",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/radio.contract.json",
    dependencies: [],
    tokensSummary: ["semantic.acao-primaria", "semantic.borda-*", "structural.raio-circular"],
    description: "Escolher exatamente 1 entre N opções — radios com o mesmo name viram um grupo nativamente. Pra name automático + legend + erro compartilhado, ver RadioGroup.",
    code: `<Radio label="Mensal" name="plano" value="mensal" checked={plano === "mensal"} onChange={setPlano} />
<Radio label="Anual" name="plano" value="anual" checked={plano === "anual"} onChange={setPlano} />`,
    Demo: RadioDemo,
  },
  {
    id: "radio-group",
    title: "RadioGroup",
    group: "Moléculas",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/radio-group.contract.json",
    dependencies: ["Radio", "HelperText"],
    tokensSummary: ["semantic.texto-primario/obrigatorio", "type-style.texto-rotulo-campo"],
    description: "Formaliza o agrupamento de Radios — name automático, legend, erro/helper compartilhado por todo o grupo.",
    code: `<RadioGroup
  label="Plano"
  options={[{ value: "mensal", label: "Mensal" }, { value: "anual", label: "Anual" }]}
  value={plano}
  onChange={setPlano}
/>`,
    Demo: RadioGroupDemo,
  },
  {
    id: "switch",
    title: "Switch",
    group: "Átomos",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/switch.contract.json",
    dependencies: [],
    tokensSummary: ["semantic.acao-primaria", "semantic.fundo-secundario", "structural.raio-circular"],
    description: "Liga/desliga com efeito instantâneo, sem submit. Label opcional — use accessibleLabel quando o rótulo já existe fora do componente.",
    code: `<Switch label="Notificações por e-mail" checked={notificacoes} onChange={setNotificacoes} />
<Switch accessibleLabel="Modo escuro" checked={modoEscuro} onChange={setModoEscuro} />`,
    Demo: SwitchDemo,
  },
  {
    id: "divider",
    title: "Divider",
    group: "Átomos",
    status: "draft",
    category: "display",
    contractFile: "contratos/divider.contract.json",
    dependencies: [],
    tokensSummary: ["semantic.borda-base", "semantic.texto-secundario", "type-style.texto-p"],
    description: "Linha estrutural que separa seções (horizontal) ou itens lado a lado (vertical), com rótulo opcional no meio.",
    code: `<Divider />
<Divider label="ou" />
<Divider orientation="vertical" />`,
    Demo: DividerDemo,
  },
  {
    id: "badge",
    title: "Badge",
    group: "Átomos",
    status: "draft",
    category: "display",
    contractFile: "contratos/badge.contract.json",
    dependencies: ["Icon"],
    tokensSummary: ["semantic.texto-*/fundo-*-forte/borda-aviso (fundo sólido, Sinalização + Apoio)", "semantic.acao-destrutiva-pressionada (critical)", "semantic.fundo-superficie/secundario/invertido", "structural.raio-circular/icone-pequeno", "type-style.texto-micro-forte"],
    description: "Rótulo curto ou contador numérico, com ícone opcional (só com label). Fundo sólido + texto branco (ou preto, quando o fundo claro exige) em todas as variantes coloridas (status incluindo critical + accent1/2/3=kiwi/roxo/laranja); neutral/white/dark são as 3 variantes sem cor. label e count são mutuamente exclusivos; position ancora nos 4 cantos de um elemento pai (ex.: contador no Avatar). inverted=true troca pro par claro+colorido, pra usar sobre um fundo já da mesma cor sólida.",
    code: `<Badge variant="success" label="Ativo" />
<Badge variant="critical" label="Atrasado" icon="warning-circle" />
<Badge variant="accent1" label="Beta" />
<Badge variant="error" count={5} />
<Badge variant="dark" count={140} max={99} />`,
    Demo: BadgeDemo,
  },
  {
    id: "avatar",
    title: "Avatar",
    group: "Átomos",
    status: "draft",
    category: "display",
    contractFile: "contratos/avatar.contract.json",
    dependencies: ["Icon"],
    tokensSummary: ["semantic.fundo-secundario/texto-secundario", "semantic.borda-sucesso/aviso/inativo (status)", "structural.icone-grande/extra-grande/espaco-xg/xgg", "type-style.texto-p/m/m-forte/g-forte"],
    description: "Foto → iniciais → ícone genérico, nessa ordem de fallback. 4 tamanhos, circle ou square, indicador de presença opcional.",
    code: `<Avatar src="/foto.jpg" name="Ana Souza" />
<Avatar name="Ana Souza" size="large" status="online" />
<Avatar accessibleLabel="Usuário anônimo" shape="square" />`,
    Demo: AvatarDemo,
  },
  {
    id: "avatar-group",
    title: "AvatarGroup",
    group: "Átomos",
    status: "draft",
    category: "display",
    contractFile: "contratos/avatar-group.contract.json",
    dependencies: ["Avatar"],
    tokensSummary: ["semantic.fundo-secundario/superficie", "semantic.texto-secundario", "structural.raio-circular/espaco-pp"],
    description: "Pilha de Avatars sobrepostos (esquerda por cima), com indicador '+N' quando a lista excede max — ex.: responsáveis por um item.",
    code: `<AvatarGroup avatars={[{ name: "Ana" }, { name: "Carlos" }, { name: "Fernanda" }]} max={5} accessibleLabel="Responsáveis" />`,
    Demo: AvatarGroupDemo,
  },
  {
    id: "stacked-text",
    title: "StackedText",
    group: "Átomos",
    status: "draft",
    category: "display",
    contractFile: "contratos/stacked-text.contract.json",
    dependencies: [],
    tokensSummary: ["semantic.texto-primario/secundario", "structural.espaco-xp", "type-style.texto-p/texto-micro"],
    description: "Duas linhas de texto na mesma célula — principal em cima, secundário embaixo. Nasceu da célula 'Nome + E-mail' da Datatable, ganhou contrato próprio.",
    code: `<StackedText primaryText="Ana Souza" secondaryText="ana@exemplo.com" />`,
    Demo: StackedTextDemo,
  },
  {
    id: "data-field",
    title: "DataField",
    group: "Átomos",
    status: "draft",
    category: "display",
    contractFile: "contratos/data-field.contract.json",
    dependencies: ["Icon"],
    tokensSummary: ["semantic.fundo-superficie/borda-base", "semantic.texto-primario/secundario/icone-secundario", "structural.raio-pp/espaco-xp/pp/icone-pequeno", "type-style.texto-p/texto-m"],
    description: "Campo só-leitura rotulado — rótulo pequeno em cima, valor maior embaixo (com ícone opcional), dentro de uma caixa com borda leve. Padrão mais repetido nas telas de detalhe analisadas em sistemas legados (Visão 360, Credenciamento, Internações).",
    code: `<DataField label="Nome completo" value="Amélia Aparecida dos Santos" />
<DataField label="Contato celular" value="(27) 9 0000-0000" icon="user" />`,
    Demo: DataFieldDemo,
  },
  {
    id: "quantity-selector",
    title: "QuantitySelector",
    group: "Átomos",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/quantity-selector.contract.json",
    dependencies: ["Icon"],
    tokensSummary: ["semantic.fundo-superficie/secundario", "semantic.borda-base", "structural.raio-pp", "structural.icone-pequeno"],
    description: "Quantidade com botões +/-, sem digitação livre. Nasceu como tipo de célula pra Datatable. Renomeado de 'Stepper' pra liberar esse nome pro componente de passo-a-passo.",
    code: `<QuantitySelector value={quantidade} min={0} max={10} accessibleLabel="Quantidade" onChange={setQuantidade} />`,
    Demo: QuantitySelectorDemo,
  },
  {
    id: "image-thumbnail",
    title: "ImageThumbnail",
    group: "Átomos",
    status: "draft",
    category: "display",
    contractFile: "contratos/image-thumbnail.contract.json",
    dependencies: ["Modal", "Icon"],
    tokensSummary: ["semantic.fundo-secundario", "semantic.borda-base", "structural.raio-pp", "structural.icone-extra-grande/espaco-xg/espaco-xgg (tamanhos)"],
    description: "Miniatura de imagem, clicável opcional pra abrir ampliada num Modal. Nasceu como tipo de célula pra Datatable.",
    code: `<ImageThumbnail src="/produto.jpg" alt="Fone azul" clickable />`,
    Demo: ImageThumbnailDemo,
  },
  {
    id: "otp",
    title: "Otp",
    group: "Átomos",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/otp.contract.json",
    dependencies: ["FieldLabel", "HelperText"],
    tokensSummary: ["semantic.borda-base/erro/inativo", "structural.raio-pp", "type-style.texto-g-forte"],
    description: "Um campo por dígito pra código de verificação (2FA, SMS, e-mail) — foco avança sozinho, cola o código inteiro de uma vez, Backspace volta pra caixa anterior.",
    code: `<Otp label="Código de verificação" value={codigo} onChange={setCodigo} onComplete={() => verificar(codigo)} />`,
    Demo: OtpDemo,
  },
  {
    id: "rating",
    title: "Rating",
    group: "Átomos",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/rating.contract.json",
    dependencies: ["Icon"],
    tokensSummary: ["semantic.acao-primaria (preenchida)", "semantic.icone-secundario/inativo", "structural.icone-medio"],
    description: "Avaliação por estrelas — inteiro ou com meio-ponto (allowHalf), interativa (role=slider) ou readOnly (role=img, ex.: nota média de um produto).",
    code: `<Rating value={nota} onChange={setNota} allowHalf accessibleLabel="Avalie o atendimento" />
<Rating value={4.5} allowHalf state="readOnly" accessibleLabel="Nota média" />`,
    Demo: RatingDemo,
  },
  {
    id: "password-strength-meter",
    title: "PasswordStrengthMeter",
    group: "Átomos",
    status: "draft",
    category: "display",
    contractFile: "contratos/password-strength-meter.contract.json",
    dependencies: [],
    tokensSummary: ["semantic.acao-destrutiva/borda-aviso/info/sucesso", "structural.raio-circular"],
    description: "Barra segmentada + rótulo textual de força de senha, pareado com TextField type='password' — heurística simples e visual, não é cálculo de entropia criptográfica.",
    code: `<TextField label="Nova senha" type="password" value={senha} onChange={setSenha} />
<PasswordStrengthMeter value={senha} />`,
    Demo: PasswordStrengthMeterDemo,
  },
  {
    id: "copy-button",
    title: "CopyButton",
    group: "Átomos",
    status: "draft",
    category: "action",
    contractFile: "contratos/copy-button.contract.json",
    dependencies: ["Icon"],
    tokensSummary: ["semantic.icone-secundario/sucesso/inativo", "structural.raio-pp"],
    description: "Botão iconOnly que copia um texto pra área de transferência — confirmação visual transiente (ícone vira check por ~2s) e aria-label muda pra 'Copiado!' durante esse tempo.",
    code: `<CopyButton value="sk_live_51H8x9F2aB3f" accessibleLabel="Copiar chave de API" />`,
    Demo: CopyButtonDemo,
  },
  {
    id: "button",
    title: "Button",
    group: "Átomos",
    status: "draft",
    category: "action",
    contractFile: "contratos/button.contract.json",
    dependencies: ["Icon", "Spinner"],
    tokensSummary: ["semantic.acao-* (variantTokenMap)", "structural.raio-pp", "type-style.texto-rotulo-botao"],
    description: "Dispara uma ação. Hierarquia visual definida pela variante; loading nunca usa disabled nativo.",
    code: `<Button variant="primary" label="Salvar" />
<Button variant="primary" leftIcon="info" label="Detalhes" />
<Button variant="primary" rightIcon="arrow-right" label="Avançar" />
<Button variant="primary" leftIcon="info" rightIcon="arrow-right" label="Ambos" />
<Button variant="primary" iconOnly leftIcon="eye" accessibleLabel="Mostrar senha" />`,
    Demo: ButtonDemo,
  },
  {
    id: "chip",
    title: "Chip",
    group: "Átomos",
    status: "draft",
    category: "action",
    contractFile: "contratos/chip.contract.json",
    dependencies: ["Icon"],
    tokensSummary: ["semantic.acao-primaria (selected)", "semantic.texto-* (variantes, sólido)", "structural.raio-circular"],
    description: "Selecionável (toggle) e/ou removível (X) — diferente do Badge, que nunca é interativo.",
    code: `<Chip label="Ativos" selected={ativo} onToggle={setAtivo} />
<Chip label="React" removable onRemove={() => removerTag("React")} />
<Chip label="Erro" variant="error" />`,
    Demo: ChipDemo,
  },
  {
    id: "accordion",
    title: "Accordion",
    group: "Moléculas",
    status: "draft",
    category: "display",
    contractFile: "contratos/accordion.contract.json",
    dependencies: ["Icon"],
    tokensSummary: ["semantic.fundo-superficie", "semantic.borda-base", "structural.raio-pp", "type-style.texto-p"],
    description: "Cabeçalho clicável que expande/colapsa um painel — item único ou vários agrupados (mode='single'|'multiple'), 100% controlado via openKeys/onChange.",
    code: `<Accordion
  items={[
    { key: "faq-1", label: "Como funciona o frete grátis?", content: <p>...</p> },
    { key: "faq-2", label: "Posso trocar um produto?", content: <p>...</p> },
  ]}
  openKeys={openKeys}
  onChange={setOpenKeys}
  mode="single"
/>`,
    Demo: AccordionDemo,
  },
  {
    id: "calendar",
    title: "Calendar",
    group: "Moléculas",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/calendar.contract.json",
    dependencies: ["Icon"],
    tokensSummary: ["semantic.acao-primaria (selecionado)", "semantic.fundo-secundario (hover)", "structural.raio-circular", "type-style.texto-p"],
    description: "Grade de mês com seleção de uma data — setas de mês sempre visíveis, e o rótulo 'Mês de Ano' abre um seletor rápido pra pular direto pra outro mês/ano.",
    code: `<Calendar
  value={data}
  onChange={setData}
  minDate="2026-01-01"
  maxDate="2026-12-31"
  accessibleLabel="Data do evento"
/>`,
    Demo: CalendarDemo,
  },
  {
    id: "date-picker",
    title: "DatePicker",
    group: "Moléculas",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/date-picker.contract.json",
    dependencies: ["Calendar", "FieldLabel", "HelperText", "Icon"],
    tokensSummary: ["semantic.borda-base/erro/inativo", "structural.raio-pp", "type-style.texto-m"],
    description: "Campo de texto que abre o Calendar num popover ancorado — data única ou intervalo (dois campos independentes, Início/Fim). Ícone de calendário à esquerda do trigger (showIcon=false esconde). hideLabel omite o FieldLabel visível sem perder o nome acessível (vira aria-label).",
    code: `<DatePicker label="Data de entrega" value={data} onChange={setData} />
<DatePicker label="Período" range value={intervalo} onChange={setIntervalo} />`,
    Demo: DatePickerDemo,
  },
  {
    id: "time-picker",
    title: "TimePicker",
    group: "Moléculas",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/time-picker.contract.json",
    dependencies: ["FieldLabel", "HelperText", "Icon"],
    tokensSummary: ["semantic.acao-primaria (selecionado)", "semantic.borda-base/erro/inativo", "structural.raio-pp"],
    description: "Campo de texto que abre um popover com duas colunas roláveis (Hora/Minuto) — horário único ou intervalo (dois campos independentes, Início/Fim). Ícone de relógio à esquerda do trigger (showIcon=false esconde).",
    code: `<TimePicker label="Horário do compromisso" value={horario} onChange={setHorario} />
<TimePicker label="Janela" range value={intervalo} onChange={setIntervalo} />`,
    Demo: TimePickerDemo,
  },
  {
    id: "date-time-picker",
    title: "DateTimePicker",
    group: "Moléculas",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/date-time-picker.contract.json",
    dependencies: ["Calendar", "FieldLabel", "HelperText", "Icon"],
    tokensSummary: ["semantic.acao-primaria (selecionado)", "semantic.borda-base/erro/inativo", "structural.raio-pp"],
    description: "Campo de texto único que abre UM popover com Calendar + colunas de Hora/Minuto juntos — data e horário combinados num só valor, ou intervalo (dois campos independentes). Ícone de calendário à esquerda do trigger (showIcon=false esconde).",
    code: `<DateTimePicker label="Início do evento" value={dataHora} onChange={setDataHora} />
<DateTimePicker label="Janela" range value={intervalo} onChange={setIntervalo} />`,
    Demo: DateTimePickerDemo,
  },
  {
    id: "file-upload",
    title: "FileUpload",
    group: "Moléculas",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/file-upload.contract.json",
    dependencies: ["Chip", "Icon", "FieldLabel", "HelperText", "Button"],
    tokensSummary: ["semantic.borda-base/erro/inativo", "semantic.acao-primaria (dragOver)", "structural.raio-pp"],
    description: "Seleção de arquivo(s) local(is) — três variantes visuais (field/button/dropzone) sobre o mesmo comportamento. Lista os arquivos selecionados via Chip removível; não faz upload de verdade, só entrega File[]. variant='button' aceita buttonVariant/buttonOutlined (reaproveita o enum do Button) pra mudar o estilo do gatilho — ex.: buttonVariant='link' pra um gatilho de texto+ícone sem fundo/borda.",
    code: `<FileUpload variant="dropzone" value={arquivos} onChange={setArquivos} multiple accept="image/*" maxSizeMB={5} />`,
    Demo: FileUploadDemo,
  },
  {
    id: "pagination",
    title: "Pagination",
    group: "Moléculas",
    status: "draft",
    category: "action",
    contractFile: "contratos/pagination.contract.json",
    dependencies: ["Button", "Icon"],
    tokensSummary: ["semantic.texto-secundario/primario", "semantic.borda-base", "structural.raio-pp"],
    description: "Navegação entre páginas de uma lista/coleção qualquer (fora de uma Datatable, que já tem paginação própria embutida) — resumo, seletor opcional de itens por página, anterior/próxima.",
    code: `<Pagination page={page} onPageChange={setPage} totalItems={237} pageSize={10} onPageSizeChange={setPageSize} />`,
    Demo: PaginationDemo,
  },
  {
    id: "slider",
    title: "Slider",
    group: "Moléculas",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/slider.contract.json",
    dependencies: [],
    tokensSummary: ["semantic.acao-primaria (preenchimento/thumb)", "semantic.borda-base (trilha)", "structural.raio-circular"],
    description: "Seleção numérica por arraste sobre input[type=range] nativo — valor único ou intervalo (dois cabos empilhados, técnica padrão de dual-range slider).",
    code: `<Slider label="Volume" value={volume} onChange={setVolume} />
<Slider label="Faixa de preço" range value={faixa} onChange={setFaixa} min={0} max={1000} />`,
    Demo: SliderDemo,
  },
  {
    id: "segmented-control",
    title: "SegmentedControl",
    group: "Moléculas",
    status: "draft",
    category: "action",
    contractFile: "contratos/segmented-control.contract.json",
    dependencies: ["Icon"],
    tokensSummary: ["semantic.fundo-secundario/superficie", "semantic.borda-base", "structural.raio-pp"],
    description: "Grupo de botões de seleção única (role=radiogroup), lado a lado, pra alternar filtro/visualização — diferente de Tabs (navegação entre painéis).",
    code: `<SegmentedControl
  items={[{ value: "lista", label: "Lista" }, { value: "grade", label: "Grade" }]}
  value={visualizacao}
  onChange={setVisualizacao}
/>`,
    Demo: SegmentedControlDemo,
  },
  {
    id: "popover",
    title: "Popover",
    group: "Moléculas",
    status: "draft",
    category: "overlay",
    contractFile: "contratos/popover.contract.json",
    dependencies: [],
    tokensSummary: ["semantic.fundo-superficie/fundo-invertido", "semantic.borda-base", "structural.raio-pp/sombra-p"],
    description: "Painel flutuante genérico ancorado a um gatilho clicável (@floating-ui) — a peça de posicionamento/dismiss reaproveitável pra componentes NOVOS; não substitui a integração já existente em Select/Tooltip/Datatable/Breadcrumb/DatePicker/TimePicker. tone='dark' troca o painel pra fundo-invertido (usado pelo CallControlBar).",
    code: `<Popover content={<div>...</div>} accessibleLabel="Editar">
  <Button label="Abrir" />
</Popover>`,
    Demo: PopoverDemo,
  },
  {
    id: "timeline",
    title: "Timeline",
    group: "Moléculas",
    status: "draft",
    category: "display",
    contractFile: "contratos/timeline.contract.json",
    dependencies: ["Icon", "Link"],
    tokensSummary: ["semantic.icone-sucesso/aviso/erro/info/secundario", "semantic.fundo-sucesso/aviso/erro/info/secundario (caixa de valor)", "semantic.borda-base (conector)", "structural.raio-circular/raio-xp"],
    description: "Lista vertical de eventos ordenados cronologicamente — marcador colorido por tone, título, descrição opcional, timestamp, caixa de valor destacada opcional (value) e lista de anexos opcional (attachments, via Link). Puramente informativo (histórico), diferente de Stepper (progresso em andamento).",
    code: `<Timeline
  items={[
    { title: "Pedido criado", timestamp: "18/08 09:12" },
    { title: "Pagamento aprovado", icon: "check-circle", tone: "success", timestamp: "18/08 09:14" },
    { title: "Registro de alta", tone: "success", value: "Registro alta: 02/08/2024", attachments: [{ label: "Ver arquivo em anexo", href: "/arquivos/alta.pdf" }] },
  ]}
/>`,
    Demo: TimelineDemo,
  },
  {
    id: "stat-card",
    title: "StatCard",
    group: "Moléculas",
    status: "draft",
    category: "display",
    contractFile: "contratos/stat-card.contract.json",
    dependencies: ["Card", "Icon"],
    tokensSummary: ["semantic.texto-sucesso/erro/secundario (tendência e ícone, sempre a mesma cor)", "semantic.texto-primario/secundario", "semantic.acao-primaria-transparente/acao-destrutiva-transparente/fundo-secundario (fundo do círculo)", "semantic.borda-erro (borda quando critical)", "structural.raio-circular", "type-style.texto-g-forte"],
    description: "Número grande + rótulo + indicador de tendência opcional, dentro de um Card reaproveitado. tone da tendência derivado da direção (up→verde, down→vermelho), sobrescrevível quando 'subir' é notícia ruim — sem seta/ícone de direção, só o sinal +/- do próprio texto. Rodapé com trendValue + helperText na mesma linha, separado do valor por uma linha divisória, com seta decorativa (sempre neutra) à direita. icon (opcional) renderiza dentro de um círculo colorido, com o próprio ícone SEMPRE na mesma cor do indicador de tendência (sem override). critical (opcional) deixa a borda do card vermelha, decisão explícita de quem consome.",
    code: `<StatCard icon="currency-circle-dollar" label="Receita mensal" value="R$ 42.300" trendDirection="up" trendValue="+12%" helperText="vs. mês anterior" critical={false} />`,
    Demo: StatCardDemo,
  },
  {
    id: "progress-list",
    title: "ProgressList",
    group: "Moléculas",
    status: "draft",
    category: "display",
    contractFile: "contratos/progress-list.contract.json",
    dependencies: ["ProgressBar"],
    tokensSummary: ["semantic.texto-secundario/primario", "structural.espaco-xp/pp/p", "type-style.texto-p"],
    description: "Lista de barras de progresso rotuladas — rótulo em cima, barra + contagem embaixo. Pensada pra blocos de prioridade/status num dashboard (ex.: No prazo/Atenção/Urgente/Atrasado).",
    code: `<ProgressList items={[
  { label: "No prazo", value: 50, count: "50 Qt", variant: "neutral" },
  { label: "Atrasado", value: 25, count: "25 Qt", variant: "critical" },
]} />`,
    Demo: ProgressListDemo,
  },
  {
    id: "selectable-card",
    title: "SelectableCard",
    group: "Moléculas",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/selectable-card.contract.json",
    dependencies: ["Badge"],
    tokensSummary: ["semantic.fundo-superficie/invertido/acao-primaria/apoio-1/2/3-forte/texto-info", "semantic.borda-base/acao-primaria", "semantic.texto-primario/secundario/invertido/acao-primaria-texto", "structural.raio-pp/circular/espaco-p", "type-style.texto-m-forte/texto-p/texto-g-forte"],
    description: "Cartão radio-selecionável rico — título, descrição, preço e Badge de destaque opcionais. O cartão inteiro é o alvo de clique (mesma técnica de input nativo sr-only do Radio). selectedTone escolhe a cor do fundo selecionado (preto/verde/kiwi/roxo/laranja/azul); se o Badge tiver a mesma cor da seleção, ele inverte automaticamente pra fundo claro + texto colorido.",
    code: `<SelectableCard name="plano" value="black" title="MedSênior Black" price="R$ 000,00" badgeLabel="Black" selectedTone="dark" checked={plano === "black"} onChange={setPlano} />`,
    Demo: SelectableCardDemo,
  },
  {
    id: "action-card",
    title: "ActionCard",
    group: "Moléculas",
    status: "draft",
    category: "display",
    contractFile: "contratos/action-card.contract.json",
    dependencies: ["Card", "Icon", "Button"],
    tokensSummary: ["semantic.acao-primaria/acao-destrutiva (+ variantes -transparente pro círculo do ícone)", "semantic.texto-primario/secundario/icone-secundario/icone-inativo", "structural.raio-xp/circular/espaco-xp/p/m", "type-style.texto-m-forte/texto-p"],
    description: "Cartão de ação administrativa — ícone dentro de um círculo de fundo translúcido na mesma cor, título, descrição, status opcional e botão(ões) de ação sempre ancorados no fim do card. secondaryVariant permite um rodapé com 2 botões reais em vez de botão+link.",
    code: `<ActionCard icon="user" title="Contatos de suporte" description="Gerencie os contatos regionais." primaryLabel="Gerenciar contatos" onPrimaryAction={fn} />`,
    Demo: ActionCardDemo,
  },
  {
    id: "user-card",
    title: "UserCard",
    group: "Moléculas",
    status: "draft",
    category: "action",
    contractFile: "contratos/user-card.contract.json",
    dependencies: ["Avatar", "StackedText", "Icon"],
    tokensSummary: ["semantic.fundo-secundario/superficie", "structural.raio-p/espaco-pp/foco-espessura"],
    description: "Gatilho de identificação do usuário — Avatar + nome/e-mail (StackedText) + caret-up, sem borda, fundo igual ao fundo da página. Extraído do 'User Card' que já existia duplicado em SideNavDemo/BackofficeTemplate. Não envolve Popover — é só o cartão, o consumidor decide o que abre (mesmo racional de onInfo/onSettings em ActionCard). Usa forwardRef pra funcionar como children direto de Popover.",
    code: `<Popover placement="top-start" accessibleLabel="Menu da conta" content={<MenuContent />}>
  <UserCard name="Ana Souza" secondaryText="ana.souza@lvxfr.com" />
</Popover>`,
    Demo: UserCardDemo,
  },
  {
    id: "comment-composer",
    title: "CommentComposer",
    group: "Moléculas",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/comment-composer.contract.json",
    dependencies: ["Textarea", "Button", "Icon"],
    tokensSummary: ["semantic.icone-secundario", "structural.raio-xp/foco-espessura/espaco-xp/pp/p"],
    description: "Textarea (sem label) + barra de utilitários opcionais (anexar imagem, marcar importante) + botão Publicar, desabilitado até haver texto. 100% controlado — não limpa o campo sozinho após onSubmit. maxLength/showCharacterCount/limitMode controlam contador e limite (bloquear digitação ou avisar+bloquear o botão).",
    code: `<CommentComposer value={texto} onChange={setTexto} onSubmit={(v) => { salvar(v); setTexto(""); }} maxLength={280} showCharacterCount limitMode="warn" />`,
    Demo: CommentComposerDemo,
  },
  {
    id: "call-control-bar",
    title: "CallControlBar",
    group: "Moléculas",
    status: "draft",
    category: "action",
    contractFile: "contratos/call-control-bar.contract.json",
    dependencies: ["Icon", "Popover", "Switch"],
    tokensSummary: ["semantic.fundo-invertido/acao-destrutiva/acao-destrutiva-sobreposta/texto-invertido/acao-secundaria", "structural.raio-circular/raio-xp/foco-espessura/espaco-pp/p/xp/icone-medio/pequeno"],
    description: "Fileira de botões circulares pra controlar videochamada — encerrar (sempre vermelho, sem toggle), microfone e câmera (troca de ícone conforme ligado/mudo + chevron adjacente opcional, formando uma cápsula única, pra escolher dispositivo via Popover tone='dark') e configurações (Popover tone='dark' com alto-falante + desfoque de fundo, opcional). 100% controlado, sem confirmação embutida no onHangUp.",
    code: `<CallControlBar
  micOn={micOn} onToggleMic={() => setMicOn(v => !v)} micDevices={mics} selectedMicDeviceId={micId} onSelectMicDevice={setMicId}
  cameraOn={cameraOn} onToggleCamera={() => setCameraOn(v => !v)} cameraDevices={cams} selectedCameraDeviceId={camId} onSelectCameraDevice={setCamId}
  onHangUp={encerrarChamada}
  speakerDevices={speakers} selectedSpeakerDeviceId={spkId} onSelectSpeakerDevice={setSpkId}
  backgroundBlurEnabled={blur} onToggleBackgroundBlur={() => setBlur(v => !v)}
/>`,
    Demo: CallControlBarDemo,
  },
  {
    id: "ticket-card",
    title: "TicketCard",
    group: "Moléculas",
    status: "draft",
    category: "display",
    contractFile: "contratos/ticket-card.contract.json",
    dependencies: ["Card", "Badge", "Avatar", "Icon", "Popover"],
    tokensSummary: ["semantic.fundo-superficie/fundo-secundario/texto-primario/texto-secundario/texto-erro/icone-secundario", "structural.raio-pp/xp/espaco-xp/p", "type-style.texto-m-forte/texto-p/texto-micro"],
    description: "Cartão de ticket/chamado com SLA — Badge de prioridade (bandeira, 4 tons fixos: atrasado/urgente/atenção/no prazo), prazo (ampulheta + texto livre), linhas de metadado (rótulo+valor), responsável (avatar+nome) e menu de ações (···) com até 5 itens fixos (Duplicar/Habilitar-Desabilitar/Editar/Ver detalhes/Apagar), cada um só aparece se o callback correspondente for passado.",
    code: `<TicketCard title="Protocolo #33561420" priority="urgente" deadlineLabel="Vence hoje" metadata={[{ label: "Solicitante", value: "João Silva" }]} assignee={{ name: "Maria Souza" }} enabled={ativo} onDuplicate={fn} onToggleEnabled={fn} onEdit={fn} onViewDetails={fn} onDelete={fn} />`,
    Demo: TicketCardDemo,
  },
  {
    id: "filter-bar",
    title: "FilterBar",
    group: "Moléculas",
    status: "draft",
    category: "action",
    contractFile: "contratos/filter-bar.contract.json",
    dependencies: ["TextField", "Chip"],
    tokensSummary: ["semantic.acao-link-texto ('Limpar tudo')", "semantic.borda-base", "structural.espaco-p/m"],
    description: "Busca opcional + slot livre de filtros (Select, DatePicker, SegmentedControl, etc.) + resumo dos filtros ativos via Chip removível. Só apresentação — não filtra dados sozinha.",
    code: `<FilterBar
  searchValue={busca} onSearchChange={setBusca}
  activeFilters={[{ key: "status", label: "Status: Ativo" }]}
  onRemoveFilter={removeFilter} onClearAll={limparTudo}
  filters={<Select options={opcoes} value={status} onChange={setStatus} />}
/>`,
    Demo: FilterBarDemo,
  },
  {
    id: "stepper",
    title: "Stepper",
    group: "Moléculas",
    status: "draft",
    category: "display",
    contractFile: "contratos/stepper.contract.json",
    dependencies: ["Icon"],
    tokensSummary: ["semantic.acao-primaria (etapa atual/concluída)", "semantic.borda-base (pendente)", "structural.raio-circular", "type-style.texto-p/texto-micro"],
    description: "Indicador horizontal de progresso por etapas nomeadas — número ou ícone por etapa, texto principal + secundário. Só mostra o progresso; a navegação real entre telas é do organismo Wizard.",
    code: `<Stepper
  items={[
    { label: "Dados pessoais", description: "Nome e e-mail" },
    { label: "Endereço" },
    { label: "Pagamento", icon: "check-circle" },
  ]}
  currentStep={1}
  accessibleLabel="Etapas do cadastro"
/>`,
    Demo: StepperDemo,
  },
  {
    id: "tabs",
    title: "Tabs",
    group: "Moléculas",
    status: "draft",
    category: "action",
    contractFile: "contratos/tabs.contract.json",
    dependencies: ["Badge"],
    tokensSummary: ["semantic.acao-primaria (ativo)", "semantic.texto-secundario/inativo", "type-style.texto-rotulo-botao"],
    description: "Navegação entre painéis mutuamente exclusivos. Ativação automática (seta já seleciona), Home/End, pula abas desabilitadas.",
    code: `<Tabs items={[{value:"a",label:"Detalhes"},{value:"b",label:"Histórico"}]} value={aba} onChange={setAba} />
<TabPanel value="a" hidden={aba !== "a"}>Conteúdo A</TabPanel>
<TabPanel value="b" hidden={aba !== "b"}>Conteúdo B</TabPanel>`,
    Demo: TabsDemo,
  },
  {
    id: "link",
    title: "Link",
    group: "Átomos",
    status: "draft",
    category: "action",
    contractFile: "contratos/link.contract.json",
    dependencies: ["Icon"],
    tokensSummary: ["semantic.acao-link-texto", "semantic.acao-link-texto-sobreposto", "structural.icone-pequeno"],
    description: "Âncora semântica (<a href>) pra navegação real — diferente do Button variant='link', que é uma ação, não uma URL.",
    code: `<Link href="/termos" label="termos de uso" />
<Link href="/saiba-mais" label="Sempre sublinhado" underline />
<Link href="https://exemplo.com" label="Documentação" external />
<Link href="#" label="Indisponível" state="disabled" />`,
    Demo: LinkDemo,
  },
  {
    id: "breadcrumb",
    title: "Breadcrumb",
    group: "Moléculas",
    status: "draft",
    category: "action",
    contractFile: "contratos/breadcrumb.contract.json",
    dependencies: ["Link", "Icon"],
    tokensSummary: ["semantic.acao-link-texto (itens)", "semantic.texto-primario (atual)", "semantic.icone-secundario (separador)"],
    description: "Trilha hierárquica de navegação. O último item é sempre a página atual, nunca um link, mesmo que venha com href.",
    code: `<Breadcrumb items={[
  { label: "Início", href: "/" },
  { label: "Configurações", href: "/config" },
  { label: "Perfil" },
]} />`,
    Demo: BreadcrumbDemo,
  },
  {
    id: "field-label",
    title: "FieldLabel",
    group: "Moléculas",
    status: "draft",
    category: "display",
    contractFile: "contratos/field-label.contract.json",
    dependencies: ["Icon", "Tooltip"],
    tokensSummary: ["semantic.texto-primario", "semantic.texto-obrigatorio", "type-style.texto-rotulo-campo"],
    description: "Nomeia um campo de formulário. Asterisco é decorativo — obrigatoriedade real é do input.",
    code: `<FieldLabel text="Login" required />
<FieldLabel text="Senha" required withInfo infoText="..." />`,
    Demo: FieldLabelDemo,
  },
  {
    id: "text-field",
    title: "TextField",
    group: "Moléculas",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/text-field.contract.json",
    dependencies: ["FieldLabel", "HelperText", "Icon", "Tooltip (indireto)"],
    tokensSummary: ["semantic.borda-*", "semantic.fundo-superficie", "type-style.texto-m"],
    description: "Campo de texto com rótulo, mensagem de apoio e ícones internos. type=password embute toggle de mostrar/ocultar.",
    code: `<TextField label="Sem ícone" value={texto} onChange={setTexto} />
<TextField label="Ícone à esquerda" leftIcon="info" value={v} onChange={setV} />
<TextField label="Ícone à direita" rightIcon="arrow-right" value={v} onChange={setV} />
<TextField label="Ícone nos dois lados" leftIcon="info" rightIcon="arrow-right" value={v} onChange={setV} />
<TextField label="Senha" type="password" value={senha} onChange={setSenha} />`,
    Demo: TextFieldDemo,
  },
  {
    id: "textarea",
    title: "Textarea",
    group: "Moléculas",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/textarea.contract.json",
    dependencies: ["FieldLabel", "HelperText", "Icon (indireto)", "Tooltip (indireto)"],
    tokensSummary: ["semantic.borda-*", "semantic.fundo-superficie", "semantic.texto-erro", "type-style.texto-m/texto-micro"],
    description: "Igual ao TextField, mas multi-linha. Sem leftIcon/rightIcon — não há espaço natural pra ícone num campo que quebra linha. showCharacterCount mostra 'N/max'; enforceMaxLength=false permite digitar além do limite (pra quem quer avisar em vez de bloquear).",
    code: `<Textarea label="Descrição" value={v} onChange={setV} maxLength={280} showCharacterCount />
<Textarea label="Comentário" required state="error" helperText="Obrigatório." />
<Textarea label="Sem bloqueio físico" maxLength={100} enforceMaxLength={false} showCharacterCount />`,
    Demo: TextareaDemo,
  },
  {
    id: "card",
    title: "Card",
    group: "Moléculas",
    status: "draft",
    category: "display",
    contractFile: "contratos/card.contract.json",
    dependencies: [],
    tokensSummary: ["semantic.fundo-superficie", "semantic.borda-base", "structural.espaco-p/g/gg", "structural.sombra-pp/p/m"],
    description: "Superfície genérica que agrupa conteúdo — sem slots fixos. elevation opcional (none=só borda, o padrão; low/medium sutis; high mais perceptível).",
    code: `<Card padding="large">
  <form onSubmit={...}>...</form>
</Card>
<Card elevation="high">Card destacado</Card>`,
    Demo: CardDemo,
  },
  {
    id: "empty-state",
    title: "Empty State",
    group: "Moléculas",
    status: "draft",
    category: "display",
    contractFile: "contratos/empty-state.contract.json",
    dependencies: ["Icon", "Button"],
    tokensSummary: ["semantic.texto-primario/secundario", "semantic.icone-secundario", "structural.icone-extra-grande"],
    description: "Lista/busca sem conteúdo, com ação opcional pra sair do estado. Diferente do Skeleton (carregando) e do Alert (erro real).",
    code: `<EmptyState
  icon="info"
  title="Nenhum resultado encontrado"
  description="Tente ajustar os filtros de busca."
  actionLabel="Limpar filtros"
  onAction={limparFiltros}
/>`,
    Demo: EmptyStateDemo,
  },
  {
    id: "alert",
    title: "Alert",
    group: "Moléculas",
    status: "draft",
    category: "display",
    contractFile: "contratos/alert.contract.json",
    dependencies: ["Icon"],
    tokensSummary: ["semantic.fundo-*/borda-*/texto-*/icone-* (Sinalização)", "type-style.texto-m-forte"],
    description: "Mensagem de status de formulário/página — diferente do HelperText, que é por campo. Ícone nunca é opcional.",
    code: `<Alert intent="error" description="Usuário ou senha inválidos." />
<Alert intent="success" title="Tudo certo" description="Cadastro salvo." />
<Alert intent="info" description="..." dismissible onDismiss={() => setVisivel(false)} />`,
    Demo: AlertDemo,
  },
  {
    id: "toast",
    title: "Toast",
    group: "Moléculas",
    status: "draft",
    category: "overlay",
    contractFile: "contratos/toast.contract.json",
    dependencies: ["Icon"],
    tokensSummary: ["semantic.fundo-*-forte (novo, um tom mais claro que o Badge) + texto-aviso", "semantic.texto-invertido", "type-style.texto-m/texto-rotulo-botao"],
    description: "Sistema completo (ToastProvider + useToast()) — notificação transiente, empilha até 3, some sozinha com pausa em hover/foco. Fundo sólido (mais claro que o Badge, pela área maior). Diferente do Alert, que é persistente.",
    code: `const { toast } = useToast();
toast({ intent: "success", message: "Item salvo." });
toast({ intent: "error", message: "Falha ao salvar.", actionLabel: "Tentar de novo", onAction: retry });`,
    Demo: ToastDemo,
  },
  {
    id: "select",
    title: "Select",
    group: "Moléculas",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/select.contract.json",
    dependencies: ["FieldLabel", "HelperText", "Icon", "Tooltip (indireto)"],
    tokensSummary: ["semantic.borda-*", "semantic.fundo-superficie", "type-style.texto-m"],
    description: "Combobox customizado (não é <select> nativo), com navegação por teclado, typeahead e seleção única ou múltipla.",
    code: `<Select label="País" options={paises} value={pais} onChange={setPais} />
<Select label="Países visitados" multiple options={paises} value={arr} onChange={setArr} />`,
    Demo: SelectDemo,
  },
  {
    id: "combobox",
    title: "ComboBox",
    group: "Moléculas",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/combobox.contract.json",
    dependencies: ["FieldLabel", "HelperText", "Icon", "Tooltip (indireto)"],
    tokensSummary: ["semantic.borda-*", "semantic.fundo-superficie", "type-style.texto-m"],
    description: "Como o Select, mas o próprio campo aceita digitação pra filtrar em tempo real — pra listas longas (padrão 'Select2').",
    code: `<ComboBox label="País" options={paises} value={pais} onChange={setPais} />
<ComboBox label="Países visitados" multiple options={paises} value={arr} onChange={setArr} />`,
    Demo: ComboBoxDemo,
  },
  {
    id: "modal",
    title: "Modal",
    group: "Organismos",
    status: "draft",
    category: "overlay",
    contractFile: "contratos/modal.contract.json",
    dependencies: ["Icon"],
    tokensSummary: ["semantic.fundo-superficie/sobreposicao", "semantic.borda-base", "structural.espaco-p/g/gg (padding, igual Card)", "type-style.texto-m-forte"],
    description: "<dialog> nativo (showModal) — focus trap e Esc nativos. padding segue a mesma escala do Card. Cabeçalho sem divisória, com 4 variações (título/X, combinados ou nenhum).",
    code: `<Modal open={aberto} onClose={() => setAberto(false)} title="Confirmar exclusão" size="small" padding="medium">
  <p>Esta ação não pode ser desfeita.</p>
  <Button variant="destructive" label="Excluir" onPress={confirmar} />
</Modal>`,
    Demo: ModalDemo,
  },
  {
    id: "confirm-dialog",
    title: "ConfirmDialog",
    group: "Organismos",
    status: "draft",
    category: "overlay",
    contractFile: "contratos/confirm-dialog.contract.json",
    dependencies: ["Modal", "Button"],
    tokensSummary: ["semantic.fundo-superficie/sobreposicao", "type-style.texto-p"],
    description: "Formaliza o Modal pequeno de título+texto+Cancelar/Confirmar que Datatable já reimplementava ad hoc. Não fecha sozinho após onConfirm — quem consome decide quando (útil pra aguardar uma chamada assíncrona).",
    code: `<ConfirmDialog
  open={aberto} onCancel={() => setAberto(false)} onConfirm={excluir}
  title="Excluir conta?" description="Esta ação não pode ser desfeita."
  confirmLabel="Excluir" confirmVariant="destructive"
/>`,
    Demo: ConfirmDialogDemo,
  },
  {
    id: "wizard",
    title: "Wizard",
    group: "Organismos",
    status: "draft",
    category: "data-entry",
    contractFile: "contratos/wizard.contract.json",
    dependencies: ["Stepper", "Button"],
    tokensSummary: ["structural.espaco-m/g"],
    description: "Orquestra navegação (Anterior/Próxima/Concluir) e validação entre telas de um fluxo multi-etapa, reaproveitando o Stepper como indicador — Stepper nunca sabe o que está sendo validado, só Wizard.",
    code: `<Wizard
  steps={[{ label: "Dados", content: <Form1 /> }, { label: "Revisão", content: <Review /> }]}
  currentStep={passo} onStepChange={setPasso} onComplete={finalizar}
  validateStep={(i) => validar(i)}
/>`,
    Demo: WizardDemo,
  },
  {
    id: "drawer",
    title: "Drawer",
    group: "Organismos",
    status: "draft",
    category: "overlay",
    contractFile: "contratos/drawer.contract.json",
    dependencies: ["Icon"],
    tokensSummary: ["semantic.fundo-superficie/sobreposicao", "semantic.borda-base", "structural.espaco-p/g/gg (padding, igual Modal/Card)", "type-style.texto-m-forte"],
    description: "Painel deslizante da borda direita — reaproveita a base do Modal (<dialog>). modal=true bloqueia (showModal), modal=false fica persistente ao lado do conteúdo (show). Animação nativa via @starting-style.",
    code: `<Drawer open={aberto} onClose={() => setAberto(false)} title="Detalhes do item" size="medium">
  <p>Conteúdo do painel.</p>
</Drawer>
<Drawer open={aberto} onClose={() => setAberto(false)} title="Filtros" modal={false}>
  <p>Painel persistente — resto da página continua interativo.</p>
</Drawer>`,
    Demo: DrawerDemo,
  },
  {
    id: "navbar",
    title: "NavBar",
    group: "Organismos",
    status: "draft",
    category: "action",
    contractFile: "contratos/navbar.contract.json",
    dependencies: ["Link", "Icon", "Drawer"],
    tokensSummary: ["semantic.fundo-superficie", "semantic.borda-base", "structural.espaco-p/g/m", "semantic.acao-link-texto (via Link)", "structural.sombra-p (dropdown)"],
    description: "Barra de navegação de topo — marca, links de navegação primária (item ativo controlado de fora, agnóstico de roteador) e slot de ações livre à direita. Item com children vira dropdown em cascata (até 4 níveis); abaixo de 768px a lista de itens colapsa num Drawer (mesma árvore, formato expansível).",
    code: `<NavBar
  brand={<strong>Produto</strong>}
  items={[
    { label: "Início", href: "/", active: true },
    { label: "Pedidos", href: "/pedidos" },
  ]}
  actions={<Avatar name="Ana Souza" size="small" />}
/>`,
    Demo: NavBarDemo,
  },
  {
    id: "side-nav",
    title: "SideNav",
    group: "Organismos",
    status: "draft",
    category: "action",
    contractFile: "contratos/side-nav.contract.json",
    dependencies: ["Link", "Icon", "Drawer"],
    tokensSummary: ["semantic.fundo-superficie", "semantic.acao-primaria-transparente (item ativo)", "semantic.borda-base", "structural.espaco-p/m/g"],
    description: "Menu de navegação vertical, lateral — um nível só (flat) ou árvore de até 4 níveis (grupos expansíveis, indentados, mesmo padrão do Accordion). Abaixo de 768px o painel colapsa num Drawer com a mesma árvore. Componente novo — não existia menu lateral persistente no harness antes deste contrato.",
    code: `<SideNav
  items={[
    { key: "inicio", label: "Início", href: "/", icon: "house", active: true },
    {
      key: "documentos",
      label: "Documentos",
      children: [
        { key: "contratos", label: "Contratos", href: "/documentos/contratos" },
      ],
    },
  ]}
  openKeys={openKeys}
  onOpenKeysChange={setOpenKeys}
/>`,
    Demo: SideNavDemo,
  },
  {
    id: "datatable",
    title: "Datatable",
    group: "Organismos",
    status: "draft",
    category: "display",
    contractFile: "contratos/datatable.contract.json",
    dependencies: ["Icon", "Skeleton", "Button", "Checkbox", "Modal", "Select"],
    tokensSummary: ["semantic.fundo-superficie/secundario", "semantic.acao-primaria-transparente (linha selecionada)", "semantic.borda-base", "structural.espaco-p/pp (density)", "type-style.texto-p/texto-micro-forte"],
    description: "Um componente só, recursos opt-in por prop/coluna: ordenação (só pelo caret), filtro oculto por coluna (abre pelo nome ou ícone de funil, com chips de filtros ativos), seleção (átomo Checkbox), paginação, edição de linha inline (com Modal de confirmação), habilitar/desabilitar registro (ícone de olho + Modal de confirmação), colunas ocultas com Alert de aviso, loading e vazio.",
    code: `<Datatable
  columns={[
    { key: "cliente", header: "Cliente", sortable: true, filterable: true, editable: true, editControl: { type: "text" } },
    { key: "valor", header: "Valor", align: "right", render: (v) => \`R$ \${v}\` },
    { key: "acoes", header: "Ações", render: (_v, row, helpers) =>
        helpers.isEditing
          ? <><Button variant="link" iconOnly accessibleLabel="Salvar" leftIcon="check" onPress={helpers.requestSave} />
              <Button variant="link" iconOnly accessibleLabel="Cancelar" leftIcon="x" onPress={helpers.cancelEdit} /></>
          : <Button variant="link" iconOnly accessibleLabel="Editar" leftIcon="pencil-simple" onPress={helpers.startEdit} />
    },
  ]}
  data={pedidos}
  rowKey="id"
  accessibleLabel="Lista de pedidos"
  sortColumnKey={sortColumnKey}
  sortDirection={sortDirection}
  onSortChange={(key, dir) => { setSortColumnKey(key); setSortDirection(dir); }}
  filterValues={filterValues}
  onFilterChange={(key, value) => setFilterValues(...)}
  selectable
  selectedRowKeys={selectedRowKeys}
  onSelectionChange={setSelectedRowKeys}
  paginationEnabled
  page={page}
  pageSize={pageSize}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>`,
    Demo: DatatableDemo,
  },
  {
    id: "kanban-board",
    title: "KanbanBoard",
    group: "Organismos",
    status: "draft",
    category: "display",
    contractFile: "contratos/kanban-board.contract.json",
    dependencies: ["TicketCard", "Badge", "@dnd-kit/core", "@dnd-kit/sortable"],
    tokensSummary: ["semantic.fundo-secundario/texto-primario/texto-inativo", "structural.raio-pp/espaco-xp/p", "type-style.texto-m-forte/texto-p"],
    description: "Grade de colunas de mesma altura, com scroll horizontal no board e scroll vertical PRÓPRIO por coluna (cabeçalho fixo). Cada coluna tem título + Badge de contagem + lista de TicketCard, arrastável (dentro da coluna e entre colunas) via @dnd-kit quando onMoveTicket é fornecido — ausência do callback mantém o board estático. Colunas são definidas por quem consome (não é um enum do harness).",
    code: `<KanbanBoard
  columns={[
    { id: "novos", title: "Novos", tickets: [{ id: "t1", title: "Protocolo #33561420", priority: "urgente", deadlineLabel: "Vence hoje" }] },
    { id: "andamento", title: "Em andamento", tickets: [] },
  ]}
  onMoveTicket={({ ticketId, fromColumnId, toColumnId, toIndex }) => mover(ticketId, fromColumnId, toColumnId, toIndex)}
  onEdit={(id) => editar(id)}
  onDelete={(id) => apagar(id)}
/>`,
    Demo: KanbanBoardDemo,
  },
  {
    id: "notification-center",
    title: "NotificationCenter",
    group: "Organismos",
    status: "draft",
    category: "overlay",
    contractFile: "contratos/notification-center.contract.json",
    dependencies: ["Button", "Badge", "Drawer", "Switch", "Checkbox", "EmptyState", "ConfirmDialog"],
    tokensSummary: ["semantic.fundo-secundario/superficie", "structural.raio-pp/espaco-xp/pp/p/m"],
    description: "Botão-gatilho (Button variant='link' iconOnly, ícone 'bell', área de clique 40x40, Badge de contagem de não lidas SOBREPOSTO ao ícone) que abre um Drawer médio na direita — Switch pequeno 'exibir apenas não lidas' sempre visível; sem seleção, só 'Marcar todas como lidas'; com 1+ selecionadas, 'Selecionar todos'/'Desmarcar todos' + 'Marcar como lidas' + UM botão 'Apagar N selecionada(s)' (só aparece com seleção). Itens da lista sem ícone e sem botão de ação — status é só peso de fonte, seleção via Checkbox. Sempre com ConfirmDialog antes de excluir. Estado de UI é interno; dados e mutações são sempre controlados de fora via callback.",
    code: `<NotificationCenter
  notifications={notifications}
  onMarkAsRead={(id) => marcarComoLida(id)}
  onMarkAllAsRead={() => marcarTodasComoLidas()}
  onDeleteMany={(ids) => apagarVarias(ids)}
/>`,
    Demo: NotificationCenterDemo,
  },
  {
    id: "settings-template",
    title: "SettingsTemplate",
    group: "Templates",
    status: "draft",
    category: "page",
    contractFile: "sem contrato — template, não componente",
    dependencies: ["Card", "Tabs", "TextField", "Button", "Switch", "Avatar", "FileUpload", "PasswordStrengthMeter", "Alert"],
    tokensSummary: ["semantic.fundo-secundario/superficie", "semantic.acao-primaria (aba ativa)", "structural.espaco-g"],
    description: "Card centralizado na página (sem NavBar/header) com Tabs (Perfil/Segurança/Notificações) no topo, no lugar da navegação lateral, com mais espaço até o conteúdo de cada seção — layout reaproveitável pra qualquer tela de configurações com múltiplas seções. Seção Perfil com Avatar grande + FileUpload (variant='button', buttonVariant='link') como gatilho 'Enviar sua foto' logo abaixo do Avatar.",
    code: `import { SettingsTemplate } from "./interface/screens/SettingsTemplate/SettingsTemplate";

<SettingsTemplate />`,
    Demo: SettingsTemplateDemo,
  },
  {
    id: "dashboard-template",
    title: "DashboardTemplate",
    group: "Templates",
    status: "draft",
    category: "page",
    contractFile: "sem contrato — template, não componente",
    dependencies: ["NavBar", "FilterBar", "Select", "DatePicker", "StatCard", "Datatable", "Badge"],
    tokensSummary: ["semantic.fundo-secundario/superficie", "structural.espaco-g/m/p"],
    description: "NavBar + FilterBar (Select de status + DatePicker de período, com Chips de filtro ativo e 'Limpar tudo') + grid de StatCard + Datatable — layout reaproveitável pra qualquer painel de resumo com filtro. Sem gráficos (barra/linha/pizza), fora de escopo por pedido explícito do usuário.",
    code: `import { DashboardTemplate } from "./interface/screens/DashboardTemplate/DashboardTemplate";

<DashboardTemplate />`,
    Demo: DashboardTemplateDemo,
  },
  {
    id: "kanban-template",
    title: "KanbanTemplate",
    group: "Templates",
    status: "draft",
    category: "page",
    contractFile: "sem contrato — template, não componente",
    dependencies: ["KanbanBoard", "Button", "Popover", "Select", "Badge", "Chip", "Icon"],
    tokensSummary: ["semantic.fundo-secundario/superficie", "structural.espaco-g/m/p"],
    description: "Página de Kanban ocupando 100% da altura do dispositivo (sem scroll vertical externo — só o board rola horizontal, cada coluna rola vertical por dentro). Header com título à esquerda e 'Novo card' + 'Filtrar' (Popover com Select de status/prazo/responsável, badge de contagem de filtros ativos) à direita; filtros aplicados aparecem como Chips removíveis abaixo do header.",
    code: `import { KanbanTemplate } from "./interface/screens/KanbanTemplate/KanbanTemplate";

<KanbanTemplate />`,
    Demo: KanbanTemplateDemo,
  },
  {
    id: "backoffice-template",
    title: "BackofficeTemplate",
    group: "Páginas",
    status: "draft",
    category: "page",
    contractFile: "sem contrato — página, não componente",
    dependencies: ["SideNav", "Avatar", "UserCard", "Breadcrumb", "NotificationCenter", "Icon", "Popover"],
    tokensSummary: ["semantic.fundo-secundario/superficie", "semantic.acao-primaria", "structural.espaco-g/m/p"],
    description: "SideNav à esquerda — logo no header/headerCollapsed (ícone só quando recolhido, ícone+nome quando aberto/hover) e identificação do usuário no footer/footerCollapsed, tudo dentro do próprio contrato do SideNav, sem wrapper externo — abrir o SideNav (clicar no chevron dentro do painel de hover) empurra o conteúdo, não é overlay. Header simples no topo (Breadcrumb + NotificationCenter, mesma cor de fundo da página, sem borda — NÃO é NavBar) + card de conteúdo vazio, num tom mais claro que o fundo da página nos dois temas. Casca (AppShell, ver interface/screens/shared/AppShell.tsx) reaproveitada por CrudTemplate.",
    code: `import { BackofficeTemplate } from "./interface/screens/BackofficeTemplate/BackofficeTemplate";

<BackofficeTemplate />`,
    Demo: BackofficeTemplateDemo,
  },
  {
    id: "crud-template",
    title: "CrudTemplate",
    group: "Páginas",
    status: "draft",
    category: "page",
    contractFile: "sem contrato — página, não componente",
    dependencies: ["Datatable", "Badge", "Button", "StackedText", "Modal", "TextField", "Select"],
    tokensSummary: ["semantic.fundo-secundario/superficie", "structural.espaco-g/m/p"],
    description: "Casca compartilhada (AppShell — SideNav + header com Breadcrumb/NotificationCenter, mesma usada por BackofficeTemplate) + Datatable no tipo MAIS COMPLETO já estabelecido no harness (mesma configuração da 'CompleteExample' de DatatableDemo: toolbar com título/densidade/colunas/exportação, filtro oculto por coluna, sort, seleção com ações em lote — excluir/ativar/desativar, sempre com confirmação —, paginação, edição de linha inline e habilitar/desabilitar registro, ambos com confirmação própria do Datatable) + botão 'Novo registro' na toolbar, que abre um Modal de criação — ponto de partida reaproveitável pra qualquer tela nova de listagem/gestão de registros (CRUD).",
    code: `import { CrudTemplate } from "./interface/screens/CrudTemplate/CrudTemplate";

<CrudTemplate />`,
    Demo: CrudTemplateDemo,
  },
  {
    id: "login-screen",
    title: "LoginScreen",
    group: "Páginas",
    status: "draft",
    category: "page",
    contractFile: "sem contrato — página, não componente",
    dependencies: ["TextField", "Button", "Alert", "Icon"],
    tokensSummary: ["semantic.acao-primaria/acao-secundaria (gradiente decorativo)", "semantic.fundo-superficie/fundo-campo", "structural.espaco-m/g/gg"],
    description: "Split-screen edge-to-edge (imagem à esquerda + formulário à direita), sem margem entre a página e a borda da tela — replicando o padrão real dos produtos do usuário. No celular (viewport <768px) a imagem some e o formulário ocupa 100% da tela. CPF com máscara automática (TextField type='cpf'). Submit sempre mostra o Alert de erro (sem autenticação real).",
    code: `import { LoginScreen } from "./interface/screens/LoginScreen/LoginScreen";

<LoginScreen />`,
    Demo: LoginScreenDemo,
  },
  {
    id: "forgot-password-screen",
    title: "ForgotPasswordScreen",
    group: "Páginas",
    status: "draft",
    category: "page",
    contractFile: "sem contrato — página, não componente",
    dependencies: ["TextField", "Button", "Alert"],
    tokensSummary: ["semantic.acao-primaria/acao-secundaria (gradiente decorativo)", "semantic.fundo-superficie", "structural.espaco-m/g/gg"],
    description: "Split-screen edge-to-edge, mesma estrutura do LoginScreen — botão 'Voltar' (variant link, sem logo) no topo do formulário. Recuperação de senha por e-mail, submit sempre mostra o Alert de sucesso (sem envio real).",
    code: `import { ForgotPasswordScreen } from "./interface/screens/ForgotPasswordScreen/ForgotPasswordScreen";

<ForgotPasswordScreen />`,
    Demo: ForgotPasswordScreenDemo,
  },
  {
    id: "reset-password-screen",
    title: "ResetPasswordScreen",
    group: "Páginas",
    status: "draft",
    category: "page",
    contractFile: "sem contrato — página, não componente",
    dependencies: ["TextField", "Button", "Alert", "PasswordStrengthMeter"],
    tokensSummary: ["semantic.acao-primaria/acao-secundaria (gradiente decorativo)", "semantic.fundo-superficie", "structural.espaco-m/g/gg"],
    description: "Split-screen edge-to-edge, mesma estrutura do LoginScreen — botão 'Voltar' no topo. Nova senha + confirmação, com PasswordStrengthMeter pareado ao campo. Valida comprimento mínimo e coincidência antes de mostrar sucesso.",
    code: `import { ResetPasswordScreen } from "./interface/screens/ResetPasswordScreen/ResetPasswordScreen";

<ResetPasswordScreen />`,
    Demo: ResetPasswordScreenDemo,
  },
  {
    id: "sign-up-screen",
    title: "SignUpScreen",
    group: "Páginas",
    status: "draft",
    category: "page",
    contractFile: "sem contrato — página, não componente",
    dependencies: ["TextField", "Button", "Alert", "Checkbox", "PasswordStrengthMeter", "Wizard"],
    tokensSummary: ["semantic.acao-primaria/acao-secundaria (gradiente decorativo)", "semantic.fundo-superficie", "structural.espaco-m/g/gg"],
    description: "Split-screen edge-to-edge, mesma estrutura do LoginScreen — botão 'Voltar' no topo. Cadastro em 2 passos via Wizard: (1) nome, e-mail e CPF (com máscara); (2) senha com medidor de força + confirmação + aceite de termos obrigatório. Validação por passo antes de avançar.",
    code: `import { SignUpScreen } from "./interface/screens/SignUpScreen/SignUpScreen";

<SignUpScreen />`,
    Demo: SignUpScreenDemo,
  },
  {
    id: "two-factor-screen",
    title: "TwoFactorScreen",
    group: "Páginas",
    status: "draft",
    category: "page",
    contractFile: "sem contrato — página, não componente",
    dependencies: ["Otp", "Button", "Alert"],
    tokensSummary: ["semantic.acao-primaria/acao-secundaria (gradiente decorativo)", "semantic.fundo-superficie", "structural.espaco-m/g/gg"],
    description: "Split-screen edge-to-edge, mesma estrutura do LoginScreen — botão 'Voltar' no topo, alinhado à esquerda mesmo com o resto do conteúdo centralizado. Verificação em 2 fatores via Otp (código de teste: 123456) — onComplete do Otp já dispara a verificação automaticamente.",
    code: `import { TwoFactorScreen } from "./interface/screens/TwoFactorScreen/TwoFactorScreen";

<TwoFactorScreen />`,
    Demo: TwoFactorScreenDemo,
  },
  {
    id: "onboarding-screen",
    title: "OnboardingScreen",
    group: "Páginas",
    status: "draft",
    category: "page",
    contractFile: "sem contrato — página, não componente",
    dependencies: ["Wizard", "Icon"],
    tokensSummary: ["semantic.acao-primaria/acao-secundaria (gradiente decorativo)", "semantic.fundo-superficie", "structural.espaco-g/gg"],
    description: "Split-screen edge-to-edge, mesma estrutura do LoginScreen — sem logo (única página de Auth sem botão de voltar, por ser posterior ao login). Introdução em 3 passos reaproveitando o Wizard — sem validação entre etapas, só avanço livre até 'Começar a usar'.",
    code: `import { OnboardingScreen } from "./interface/screens/OnboardingScreen/OnboardingScreen";

<OnboardingScreen onFinish={() => navegarParaApp()} />`,
    Demo: OnboardingScreenDemo,
  },
  {
    id: "error-screen",
    title: "ErrorScreen",
    group: "Páginas",
    status: "draft",
    category: "page",
    contractFile: "sem contrato — página, não componente",
    dependencies: ["Button", "Icon"],
    tokensSummary: ["semantic.fundo-superficie", "semantic.icone-secundario", "structural.espaco-m"],
    description: "404/500 — troca de mensagem via prop code, mesmo layout pros dois casos.",
    code: `import { ErrorScreen } from "./interface/screens/ErrorScreen/ErrorScreen";

<ErrorScreen code={404} onGoHome={() => navegarParaInicio()} />`,
    Demo: ErrorScreenDemo,
  },
  {
    id: "success-screen",
    title: "SuccessScreen",
    group: "Páginas",
    status: "draft",
    category: "page",
    contractFile: "sem contrato — página, não componente",
    dependencies: ["Icon", "Button"],
    tokensSummary: ["semantic.acao-primaria/acao-secundaria (gradiente decorativo)", "semantic.icone-sucesso", "structural.espaco-m/g/gg"],
    description: "Mesma estrutura de split-screen do LoginScreen — mensagem de sucesso genérica (título, descrição e ação configuráveis via props) pra reaproveitar depois de qualquer fluxo concluído (ex.: fim de um cadastro, redefinição de senha).",
    code: `import { SuccessScreen } from "./interface/screens/SuccessScreen/SuccessScreen";

<SuccessScreen
  title="Conta criada!"
  description="Verifique seu e-mail pra confirmar o cadastro."
  actionLabel="Ir para o login"
  onAction={() => navegarParaLogin()}
/>`,
    Demo: SuccessScreenDemo,
  },
  {
    id: "connection-error-screen",
    title: "ConnectionErrorScreen",
    group: "Páginas",
    status: "draft",
    category: "page",
    contractFile: "sem contrato — página, não componente",
    dependencies: ["Icon", "Button"],
    tokensSummary: ["semantic.acao-primaria/acao-secundaria (gradiente decorativo)", "semantic.icone-erro", "structural.espaco-m/g/gg"],
    description: "Mesma estrutura de split-screen do LoginScreen — mensagem de erro de conexão (rede/servidor fora do ar) com botão 'Tentar novamente', que simula uma nova tentativa (~900ms de loading) antes de chamar onRetry. Diferente do ErrorScreen (404/500 — página não encontrada/erro de servidor, layout centralizado simples): esta é para falha transitória de conexão, no mesmo modelo visual das páginas de auth.",
    code: `import { ConnectionErrorScreen } from "./interface/screens/ConnectionErrorScreen/ConnectionErrorScreen";

<ConnectionErrorScreen onRetry={() => refazerRequisicao()} />`,
    Demo: ConnectionErrorScreenDemo,
  },
  {
    id: "full-page-loading",
    title: "FullPageLoading",
    group: "Páginas",
    status: "draft",
    category: "page",
    contractFile: "sem contrato — página, não componente",
    dependencies: ["Spinner"],
    tokensSummary: ["semantic.fundo-superficie", "semantic.acao-primaria", "type-style.texto-p"],
    description: "Tela cheia de carregamento (diferente do Spinner solto) — usada enquanto uma navegação/operação inteira ainda não tem conteúdo pra mostrar.",
    code: `import { FullPageLoading } from "./interface/screens/FullPageLoading/FullPageLoading";

<FullPageLoading message="Carregando seus dados..." />`,
    Demo: FullPageLoadingDemo,
  },
];

export const GROUP_ORDER = ["Átomos", "Moléculas", "Organismos", "Templates", "Páginas"] as const;
