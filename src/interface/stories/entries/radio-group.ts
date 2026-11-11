import type { StoryMeta } from "../types";
import { RadioGroupDemo } from "../molecules/RadioGroupDemo";

const story: StoryMeta = {
  id: "radio-group",
  order: 90,
  title: "RadioGroup",
  group: "Moléculas",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/radio-group.contract.json",
  dependencies: ["Radio", "HelperText"],
  tokensSummary: ["semantic.texto-primario/obrigatorio", "type-style.texto-rotulo-campo"],
  description: "Formaliza o agrupamento de Radios — name automático, legend, erro/helper compartilhado por todo o grupo.",
  code: `<RadioGroup
  label="Plano"
  options={[{ value: "mensal", label: "Mensal" }, { value: "anual", label: "Anual" }]}
  value={plano}
  onChange={setPlano}
/>`,
  Demo: RadioGroupDemo,
};

export default story;
