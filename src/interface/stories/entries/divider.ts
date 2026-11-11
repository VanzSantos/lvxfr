import type { StoryMeta } from "../types";
import { DividerDemo } from "../atoms/DividerDemo";

const story: StoryMeta = {
  id: "divider",
  order: 110,
  title: "Divider",
  group: "Átomos",
  status: "draft",
  category: "display",
  contractFile: "contratos/divider.contract.json",
  dependencies: [],
  tokensSummary: ["semantic.borda-base", "semantic.texto-secundario", "type-style.texto-p"],
  description: "Linha estrutural que separa seções (horizontal) ou itens lado a lado (vertical), com rótulo opcional no meio.",
  code: `<Divider />
<Divider label="ou" />
<Divider orientation="vertical" />`,
  Demo: DividerDemo,
};

export default story;
