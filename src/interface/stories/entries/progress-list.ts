import type { StoryMeta } from "../types";
import { ProgressListDemo } from "../molecules/ProgressListDemo";

const story: StoryMeta = {
  id: "progress-list",
  order: 370,
  title: "ProgressList",
  group: "Moléculas",
  status: "draft",
  category: "display",
  contractFile: "contratos/progress-list.contract.json",
  dependencies: ["ProgressBar"],
  tokensSummary: ["semantic.texto-secundario/primario", "structural.espaco-xp/pp/p", "type-style.texto-p"],
  description: "Lista de barras de progresso rotuladas — rótulo em cima, barra + contagem embaixo. Pensada pra blocos de prioridade/status num dashboard (ex.: No prazo/Atenção/Urgente/Atrasado).",
  code: `<ProgressList items={[
  { label: "No prazo", value: 50, count: "50 Qt", variant: "neutral" },
  { label: "Atrasado", value: 25, count: "25 Qt", variant: "critical" },
]} />`,
  Demo: ProgressListDemo,
};

export default story;
