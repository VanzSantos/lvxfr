import type { StoryMeta } from "../types";
import { SuccessScreenDemo } from "../pages/SuccessScreenDemo";

const story: StoryMeta = {
  id: "success-screen",
  order: 790,
  title: "SuccessScreen",
  group: "Páginas",
  status: "draft",
  category: "page",
  contractFile: "sem contrato — página, não componente",
  dependencies: ["Icon", "Button"],
  tokensSummary: ["semantic.acao-primaria/acao-secundaria (gradiente decorativo)", "semantic.icone-sucesso", "structural.espaco-m/g/gg"],
  description: "Mesma estrutura de split-screen do LoginScreen — mensagem de sucesso genérica (título, descrição e ação configuráveis via props) pra reaproveitar depois de qualquer fluxo concluído (ex.: fim de um cadastro, redefinição de senha).",
  code: `import { SuccessScreen } from "./interface/screens/SuccessScreen/SuccessScreen";

<SuccessScreen
  title="Conta criada!"
  description="Verifique seu e-mail pra confirmar o cadastro."
  actionLabel="Ir para o login"
  onAction={() => navegarParaLogin()}
/>`,
  Demo: SuccessScreenDemo,
};

export default story;
