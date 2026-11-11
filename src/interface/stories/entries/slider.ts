import type { StoryMeta } from "../types";
import { SliderDemo } from "../molecules/SliderDemo";

const story: StoryMeta = {
  id: "slider",
  order: 320,
  title: "Slider",
  group: "Moléculas",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/slider.contract.json",
  dependencies: [],
  tokensSummary: ["semantic.acao-primaria (preenchimento/thumb)", "semantic.borda-base (trilha)", "structural.raio-circular"],
  description: "Seleção numérica por arraste sobre input[type=range] nativo — valor único ou intervalo (dois cabos empilhados, técnica padrão de dual-range slider).",
  code: `<Slider label="Volume" value={volume} onChange={setVolume} />
<Slider label="Faixa de preço" range value={faixa} onChange={setFaixa} min={0} max={1000} />`,
  Demo: SliderDemo,
};

export default story;
