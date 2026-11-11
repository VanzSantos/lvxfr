import type { StoryMeta } from "../types";
import { NotificationCenterDemo } from "../organisms/NotificationCenterDemo";

const story: StoryMeta = {
  id: "notification-center",
  order: 660,
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
};

export default story;
