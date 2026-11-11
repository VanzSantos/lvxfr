import type { StoryMeta } from "../types";
import { SegmentedControlDemo } from "../molecules/SegmentedControlDemo";

const story: StoryMeta = {
  id: "segmented-control",
  order: 330,
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
};

export default story;
