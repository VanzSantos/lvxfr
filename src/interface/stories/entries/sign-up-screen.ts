import type { StoryMeta } from "../types";
import { SignUpScreenDemo } from "../pages/SignUpScreenDemo";

const story: StoryMeta = {
  id: "sign-up-screen",
  order: 750,
  title: "SignUpScreen",
  group: "Páginas",
  status: "draft",
  category: "page",
  contractFile: "sem contrato — página, não componente",
  dependencies: ["TextField", "Button", "Alert", "Checkbox", "PasswordStrengthMeter", "Wizard"],
  tokensSummary: ["semantic.acao-primaria/acao-secundaria (gradiente decorativo)", "semantic.fundo-superficie", "structural.espaco-m/g/gg"],
  description: "Split-screen edge-to-edge, mesma estrutura do LoginScreen — botão 'Voltar' no topo. Cadastro em 2 passos via Wizard: (1) nome, e-mail e CPF (com máscara); (2) senha com medidor de força + confirmação + aceite de termos obrigatório. Validação por passo antes de avançar.",
  code: `import { SignUpScreen } from "./interface/screens/SignUpScreen/SignUpScreen";

<SignUpScreen />`,
  Demo: SignUpScreenDemo,
};

export default story;
