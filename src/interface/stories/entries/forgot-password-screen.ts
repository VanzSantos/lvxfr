import type { StoryMeta } from "../types";
import { ForgotPasswordScreenDemo } from "../pages/ForgotPasswordScreenDemo";

const story: StoryMeta = {
  id: "forgot-password-screen",
  order: 730,
  title: "ForgotPasswordScreen",
  group: "Páginas",
  status: "draft",
  category: "page",
  contractFile: "sem contrato — página, não componente",
  dependencies: ["TextField", "Button", "Alert"],
  tokensSummary: ["semantic.acao-primaria/acao-secundaria (gradiente decorativo)", "semantic.fundo-superficie", "structural.espaco-m/g/gg"],
  description: "Split-screen edge-to-edge, mesma estrutura do LoginScreen — botão 'Voltar' (variant link, sem logo) no topo do formulário. Recuperação de senha por e-mail, submit sempre mostra o Alert de sucesso (sem envio real).",
  code: `import { ForgotPasswordScreen } from "./interface/screens/ForgotPasswordScreen/ForgotPasswordScreen";

<ForgotPasswordScreen />`,
  Demo: ForgotPasswordScreenDemo,
};

export default story;
