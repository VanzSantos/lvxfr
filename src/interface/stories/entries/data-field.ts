import type { StoryMeta } from "../types";
import { DataFieldDemo } from "../atoms/DataFieldDemo";

const story: StoryMeta = {
  id: "data-field",
  order: 160,
  title: "DataField",
  group: "Átomos",
  status: "draft",
  category: "display",
  contractFile: "contratos/data-field.contract.json",
  dependencies: ["Icon"],
  tokensSummary: ["semantic.fundo-superficie/borda-base", "semantic.texto-primario/secundario/icone-secundario", "structural.raio-pp/espaco-xp/pp/icone-pequeno", "type-style.texto-p/texto-m"],
  description: "Campo só-leitura rotulado — rótulo pequeno em cima, valor maior embaixo (com ícone opcional), dentro de uma caixa com borda leve. Padrão mais repetido nas telas de detalhe analisadas em sistemas legados (Visão 360, Credenciamento, Internações).",
  code: `<DataField label="Nome completo" value="Amélia Aparecida dos Santos" />
<DataField label="Contato celular" value="(27) 9 0000-0000" icon="user" />`,
  Demo: DataFieldDemo,
};

export default story;
