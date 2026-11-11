import type { StoryMeta } from "../types";
import { TicketCardDemo } from "../molecules/TicketCardDemo";

const story: StoryMeta = {
  id: "ticket-card",
  order: 430,
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
};

export default story;
