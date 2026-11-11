import type { StoryMeta } from "../types";
import { KanbanBoardDemo } from "../organisms/KanbanBoardDemo";

const story: StoryMeta = {
  id: "kanban-board",
  order: 650,
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
};

export default story;
