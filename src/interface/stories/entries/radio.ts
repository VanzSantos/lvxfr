import type { StoryMeta } from "../types";
import { RadioDemo } from "../atoms/RadioDemo";

const story: StoryMeta = {
  id: "radio",
  order: 80,
  title: "Radio",
  group: "Átomos",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/radio.contract.json",
  dependencies: [],
  tokensSummary: ["semantic.acao-primaria", "semantic.borda-*", "structural.raio-circular"],
  description: "Escolher exatamente 1 entre N opções — radios com o mesmo name viram um grupo nativamente. Pra name automático + legend + erro compartilhado, ver RadioGroup.",
  code: `<Radio label="Mensal" name="plano" value="mensal" checked={plano === "mensal"} onChange={setPlano} />
<Radio label="Anual" name="plano" value="anual" checked={plano === "anual"} onChange={setPlano} />`,
  Demo: RadioDemo,
};

export default story;
