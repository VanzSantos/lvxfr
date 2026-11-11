import type { StoryMeta } from "../types";
import { DashboardTemplateDemo } from "../pages/DashboardTemplateDemo";

const story: StoryMeta = {
  id: "dashboard-template",
  order: 680,
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
};

export default story;
