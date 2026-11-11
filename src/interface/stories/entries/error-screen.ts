import type { StoryMeta } from "../types";
import { ErrorScreenDemo } from "../pages/ErrorScreenDemo";

const story: StoryMeta = {
  id: "error-screen",
  order: 780,
  title: "ErrorScreen",
  group: "Páginas",
  status: "draft",
  category: "page",
  contractFile: "sem contrato — página, não componente",
  dependencies: ["Button", "Icon"],
  tokensSummary: ["semantic.fundo-superficie", "semantic.icone-secundario", "structural.espaco-m"],
  description: "404/500 — troca de mensagem via prop code, mesmo layout pros dois casos.",
  code: `import { ErrorScreen } from "./interface/screens/ErrorScreen/ErrorScreen";

<ErrorScreen code={404} onGoHome={() => navegarParaInicio()} />`,
  Demo: ErrorScreenDemo,
};

export default story;
