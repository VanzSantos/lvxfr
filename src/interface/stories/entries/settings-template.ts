import type { StoryMeta } from "../types";
import { SettingsTemplateDemo } from "../pages/SettingsTemplateDemo";

const story: StoryMeta = {
  id: "settings-template",
  order: 670,
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
};

export default story;
