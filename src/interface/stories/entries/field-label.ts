import type { StoryMeta } from "../types";
import { FieldLabelDemo } from "../molecules/FieldLabelDemo";

const story: StoryMeta = {
  id: "field-label",
  order: 490,
  title: "FieldLabel",
  group: "Moléculas",
  status: "draft",
  category: "display",
  contractFile: "contratos/field-label.contract.json",
  dependencies: ["Icon", "Tooltip"],
  tokensSummary: ["semantic.texto-primario", "semantic.texto-obrigatorio", "type-style.texto-rotulo-campo"],
  description: "Nomeia um campo de formulário. Asterisco é decorativo — obrigatoriedade real é do input.",
  code: `<FieldLabel text="Login" required />
<FieldLabel text="Senha" required withInfo infoText="..." />`,
  Demo: FieldLabelDemo,
};

export default story;
