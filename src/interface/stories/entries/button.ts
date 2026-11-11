import type { StoryMeta } from "../types";
import { ButtonDemo } from "../atoms/ButtonDemo";

const story: StoryMeta = {
  id: "button",
  order: 230,
  title: "Button",
  group: "Átomos",
  status: "draft",
  category: "action",
  contractFile: "contratos/button.contract.json",
  dependencies: ["Icon", "Spinner"],
  tokensSummary: ["semantic.acao-* (variantTokenMap)", "structural.raio-pp", "type-style.texto-rotulo-botao"],
  description: "Dispara uma ação. Hierarquia visual definida pela variante; loading nunca usa disabled nativo.",
  code: `<Button variant="primary" label="Salvar" />
<Button variant="primary" leftIcon="info" label="Detalhes" />
<Button variant="primary" rightIcon="arrow-right" label="Avançar" />
<Button variant="primary" leftIcon="info" rightIcon="arrow-right" label="Ambos" />
<Button variant="primary" iconOnly leftIcon="eye" accessibleLabel="Mostrar senha" />`,
  Demo: ButtonDemo,
};

export default story;
