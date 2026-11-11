import type { StoryMeta } from "../types";
import { TwoFactorScreenDemo } from "../pages/TwoFactorScreenDemo";

const story: StoryMeta = {
  id: "two-factor-screen",
  order: 760,
  title: "TwoFactorScreen",
  group: "Páginas",
  status: "draft",
  category: "page",
  contractFile: "sem contrato — página, não componente",
  dependencies: ["Otp", "Button", "Alert"],
  tokensSummary: ["semantic.acao-primaria/acao-secundaria (gradiente decorativo)", "semantic.fundo-superficie", "structural.espaco-m/g/gg"],
  description: "Split-screen edge-to-edge, mesma estrutura do LoginScreen — botão 'Voltar' no topo, alinhado à esquerda mesmo com o resto do conteúdo centralizado. Verificação em 2 fatores via Otp (código de teste: 123456) — onComplete do Otp já dispara a verificação automaticamente.",
  code: `import { TwoFactorScreen } from "./interface/screens/TwoFactorScreen/TwoFactorScreen";

<TwoFactorScreen />`,
  Demo: TwoFactorScreenDemo,
};

export default story;
