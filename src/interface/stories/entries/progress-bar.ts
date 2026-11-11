import type { StoryMeta } from "../types";
import { ProgressBarDemo } from "../atoms/ProgressBarDemo";

const story: StoryMeta = {
  id: "progress-bar",
  order: 50,
  title: "Progress Bar",
  group: "Átomos",
  status: "draft",
  category: "display",
  contractFile: "contratos/progress-bar.contract.json",
  dependencies: [],
  tokensSummary: ["semantic.acao-primaria/borda-sucesso/borda-erro/borda-aviso/borda-inativo", "semantic.acao-destrutiva-pressionada (critical)", "semantic.fundo-secundario", "structural.raio-circular"],
  description: "Progresso mensurável (0-100%) — diferente do Spinner, que é indeterminado. accessibleLabel é sempre obrigatório. Variantes warning/critical/neutral pensadas pra listas de prioridade (ver ProgressList).",
  code: `<ProgressBar value={42} accessibleLabel="Enviando arquivo" showValue />
<ProgressBar value={100} variant="success" accessibleLabel="Envio concluído" />`,
  Demo: ProgressBarDemo,
};

export default story;
