import type { StoryMeta } from "../types";
import { SelectDemo } from "../molecules/SelectDemo";

const story: StoryMeta = {
  id: "select",
  order: 560,
  title: "Select",
  group: "Moléculas",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/select.contract.json",
  dependencies: ["FieldLabel", "HelperText", "Icon", "Tooltip (indireto)"],
  tokensSummary: ["semantic.borda-*", "semantic.fundo-superficie", "type-style.texto-m"],
  description: "Combobox customizado (não é <select> nativo), com navegação por teclado, typeahead e seleção única ou múltipla.",
  code: `<Select label="País" options={paises} value={pais} onChange={setPais} />
<Select label="Países visitados" multiple options={paises} value={arr} onChange={setArr} />`,
  Demo: SelectDemo,
};

export default story;
