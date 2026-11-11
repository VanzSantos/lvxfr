import type { StoryMeta } from "../types";
import { SpinnerDemo } from "../atoms/SpinnerDemo";

const story: StoryMeta = {
  id: "spinner",
  order: 40,
  title: "Spinner",
  group: "Átomos",
  status: "draft",
  category: "display",
  contractFile: "contratos/spinner.contract.json",
  dependencies: [],
  tokensSummary: ["semantic.acao-*-texto / semantic.icone-*", "structural.icone-*"],
  description: "Indicador de carregamento em andamento. Cor sempre explícita, nunca herdada — mesma regra do Icon.",
  code: `<Spinner size="medium" color="var(--acao-primaria)" />
<Spinner color="var(--acao-destrutiva)" decorative={false} accessibleLabel="Carregando" />`,
  Demo: SpinnerDemo,
};

export default story;
