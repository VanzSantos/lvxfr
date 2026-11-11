import type { StoryMeta } from "../types";
import { QuantitySelectorDemo } from "../atoms/QuantitySelectorDemo";

const story: StoryMeta = {
  id: "quantity-selector",
  order: 170,
  title: "QuantitySelector",
  group: "Átomos",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/quantity-selector.contract.json",
  dependencies: ["Icon"],
  tokensSummary: ["semantic.fundo-superficie/secundario", "semantic.borda-base", "structural.raio-pp", "structural.icone-pequeno"],
  description: "Quantidade com botões +/-, sem digitação livre. Nasceu como tipo de célula pra Datatable. Renomeado de 'Stepper' pra liberar esse nome pro componente de passo-a-passo.",
  code: `<QuantitySelector value={quantidade} min={0} max={10} accessibleLabel="Quantidade" onChange={setQuantidade} />`,
  Demo: QuantitySelectorDemo,
};

export default story;
