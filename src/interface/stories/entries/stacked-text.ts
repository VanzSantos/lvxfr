import type { StoryMeta } from "../types";
import { StackedTextDemo } from "../atoms/StackedTextDemo";

const story: StoryMeta = {
  id: "stacked-text",
  order: 150,
  title: "StackedText",
  group: "Átomos",
  status: "draft",
  category: "display",
  contractFile: "contratos/stacked-text.contract.json",
  dependencies: [],
  tokensSummary: ["semantic.texto-primario/secundario", "structural.espaco-xp", "type-style.texto-p/texto-micro"],
  description: "Duas linhas de texto na mesma célula — principal em cima, secundário embaixo. Nasceu da célula 'Nome + E-mail' da Datatable, ganhou contrato próprio.",
  code: `<StackedText primaryText="Ana Souza" secondaryText="ana@exemplo.com" />`,
  Demo: StackedTextDemo,
};

export default story;
