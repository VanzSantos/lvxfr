import type { StoryMeta } from "../types";
import { KanbanTemplateDemo } from "../pages/KanbanTemplateDemo";

const story: StoryMeta = {
  id: "kanban-template",
  order: 690,
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
};

export default story;
