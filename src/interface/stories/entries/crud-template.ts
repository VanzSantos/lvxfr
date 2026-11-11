import type { StoryMeta } from "../types";
import { CrudTemplateDemo } from "../pages/CrudTemplateDemo";

const story: StoryMeta = {
  id: "crud-template",
  order: 710,
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
};

export default story;
