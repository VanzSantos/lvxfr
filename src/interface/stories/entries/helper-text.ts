import type { StoryMeta } from "../types";
import { HelperTextDemo } from "../atoms/HelperTextDemo";

const story: StoryMeta = {
  id: "helper-text",
  order: 20,
  title: "HelperText",
  group: "Átomos",
  status: "draft",
  category: "display",
  contractFile: "contratos/helper-text.contract.json",
  dependencies: [],
  tokensSummary: ["semantic.texto-secundario", "semantic.texto-erro", "type-style.texto-p"],
  description: "Texto auxiliar abaixo de um campo — ajuda neutra ou erro.",
  code: `<HelperText text="Mínimo de 8 caracteres." intent="default" />
<HelperText text="E-mail inválido." intent="error" />`,
  Demo: HelperTextDemo,
};

export default story;
