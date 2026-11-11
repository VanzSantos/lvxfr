import type { StoryMeta } from "../types";
import { AlertDemo } from "../molecules/AlertDemo";

const story: StoryMeta = {
  id: "alert",
  order: 540,
  title: "Alert",
  group: "Moléculas",
  status: "draft",
  category: "display",
  contractFile: "contratos/alert.contract.json",
  dependencies: ["Icon"],
  tokensSummary: ["semantic.fundo-*/borda-*/texto-*/icone-* (Sinalização)", "type-style.texto-m-forte"],
  description: "Mensagem de status de formulário/página — diferente do HelperText, que é por campo. Ícone nunca é opcional.",
  code: `<Alert intent="error" description="Usuário ou senha inválidos." />
<Alert intent="success" title="Tudo certo" description="Cadastro salvo." />
<Alert intent="info" description="..." dismissible onDismiss={() => setVisivel(false)} />`,
  Demo: AlertDemo,
};

export default story;
