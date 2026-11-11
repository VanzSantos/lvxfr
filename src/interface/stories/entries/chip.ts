import type { StoryMeta } from "../types";
import { ChipDemo } from "../atoms/ChipDemo";

const story: StoryMeta = {
  id: "chip",
  order: 240,
  title: "Chip",
  group: "Átomos",
  status: "draft",
  category: "action",
  contractFile: "contratos/chip.contract.json",
  dependencies: ["Icon"],
  tokensSummary: ["semantic.acao-primaria (selected)", "semantic.texto-* (variantes, sólido)", "structural.raio-circular"],
  description: "Selecionável (toggle) e/ou removível (X) — diferente do Badge, que nunca é interativo.",
  code: `<Chip label="Ativos" selected={ativo} onToggle={setAtivo} />
<Chip label="React" removable onRemove={() => removerTag("React")} />
<Chip label="Erro" variant="error" />`,
  Demo: ChipDemo,
};

export default story;
