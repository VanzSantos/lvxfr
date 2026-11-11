import type { StoryMeta } from "../types";
import { IconDemo } from "../atoms/IconDemo";

const story: StoryMeta = {
  id: "icon",
  order: 10,
  title: "Icon",
  group: "Átomos",
  status: "draft",
  category: "display",
  contractFile: "contratos/icon.contract.json",
  dependencies: [],
  tokensSummary: ["semantic.icone-*", "semantic.acao-*-texto", "structural.icone-*"],
  description: "Única porta de entrada pra biblioteca Phosphor. Cor sempre explícita, nunca herdada.",
  code: `<Icon name="info" size="medium" color="var(--icone-secundario)" />
<Icon name="arrow-right" size="large" color="var(--acao-primaria)" />
<Icon name="eye" decorative={false} accessibleLabel="Mostrar senha" />`,
  Demo: IconDemo,
};

export default story;
