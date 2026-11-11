import type { StoryMeta } from "../types";
import { ResetPasswordScreenDemo } from "../pages/ResetPasswordScreenDemo";

const story: StoryMeta = {
  id: "reset-password-screen",
  order: 740,
  title: "ResetPasswordScreen",
  group: "Páginas",
  status: "draft",
  category: "page",
  contractFile: "sem contrato — página, não componente",
  dependencies: ["TextField", "Button", "Alert", "PasswordStrengthMeter"],
  tokensSummary: ["semantic.acao-primaria/acao-secundaria (gradiente decorativo)", "semantic.fundo-superficie", "structural.espaco-m/g/gg"],
  description: "Split-screen edge-to-edge, mesma estrutura do LoginScreen — botão 'Voltar' no topo. Nova senha + confirmação, com PasswordStrengthMeter pareado ao campo. Valida comprimento mínimo e coincidência antes de mostrar sucesso.",
  code: `import { ResetPasswordScreen } from "./interface/screens/ResetPasswordScreen/ResetPasswordScreen";

<ResetPasswordScreen />`,
  Demo: ResetPasswordScreenDemo,
};

export default story;
