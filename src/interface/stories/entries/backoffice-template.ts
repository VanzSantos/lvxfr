import type { StoryMeta } from "../types";
import { BackofficeTemplateDemo } from "../pages/BackofficeTemplateDemo";

const story: StoryMeta = {
  id: "backoffice-template",
  order: 700,
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
};

export default story;
