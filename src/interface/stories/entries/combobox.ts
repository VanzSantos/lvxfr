import type { StoryMeta } from "../types";
import { ComboBoxDemo } from "../molecules/ComboBoxDemo";

const story: StoryMeta = {
  id: "combobox",
  order: 570,
  title: "ComboBox",
  group: "Moléculas",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/combobox.contract.json",
  dependencies: ["FieldLabel", "HelperText", "Icon", "Tooltip (indireto)"],
  tokensSummary: ["semantic.borda-*", "semantic.fundo-superficie", "type-style.texto-m"],
  description: "Como o Select, mas o próprio campo aceita digitação pra filtrar em tempo real — pra listas longas (padrão 'Select2').",
  code: `<ComboBox label="País" options={paises} value={pais} onChange={setPais} />
<ComboBox label="Países visitados" multiple options={paises} value={arr} onChange={setArr} />`,
  Demo: ComboBoxDemo,
};

export default story;
