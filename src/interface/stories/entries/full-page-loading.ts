import type { StoryMeta } from "../types";
import { FullPageLoadingDemo } from "../pages/FullPageLoadingDemo";

const story: StoryMeta = {
  id: "full-page-loading",
  order: 810,
  title: "FullPageLoading",
  group: "Páginas",
  status: "draft",
  category: "page",
  contractFile: "sem contrato — página, não componente",
  dependencies: ["Spinner"],
  tokensSummary: ["semantic.fundo-superficie", "semantic.acao-primaria", "type-style.texto-p"],
  description: "Tela cheia de carregamento (diferente do Spinner solto) — usada enquanto uma navegação/operação inteira ainda não tem conteúdo pra mostrar.",
  code: `import { FullPageLoading } from "./interface/screens/FullPageLoading/FullPageLoading";

<FullPageLoading message="Carregando seus dados..." />`,
  Demo: FullPageLoadingDemo,
};

export default story;
