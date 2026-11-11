import type { StoryMeta } from "../types";
import { EmptyStateDemo } from "../molecules/EmptyStateDemo";

const story: StoryMeta = {
  id: "empty-state",
  order: 530,
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
};

export default story;
