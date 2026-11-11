import type { StoryMeta } from "../types";
import { TooltipDemo } from "../atoms/TooltipDemo";

const story: StoryMeta = {
  id: "tooltip",
  order: 30,
  title: "Tooltip",
  group: "Átomos",
  status: "draft",
  category: "overlay",
  contractFile: "contratos/tooltip.contract.json",
  dependencies: [],
  tokensSummary: ["semantic.fundo-invertido", "semantic.texto-invertido", "structural.raio-pp"],
  description: "Sobreposição curta ancorada a um gatilho externo. Abre por hover, foco e toque.",
  code: `<Tooltip text="Dica curta e objetiva." placement="top">
  <button>gatilho</button>
</Tooltip>`,
  Demo: TooltipDemo,
};

export default story;
