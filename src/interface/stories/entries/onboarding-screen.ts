import type { StoryMeta } from "../types";
import { OnboardingScreenDemo } from "../pages/OnboardingScreenDemo";

const story: StoryMeta = {
  id: "onboarding-screen",
  order: 770,
  title: "OnboardingScreen",
  group: "Páginas",
  status: "draft",
  category: "page",
  contractFile: "sem contrato — página, não componente",
  dependencies: ["Wizard", "Icon"],
  tokensSummary: ["semantic.acao-primaria/acao-secundaria (gradiente decorativo)", "semantic.fundo-superficie", "structural.espaco-g/gg"],
  description: "Split-screen edge-to-edge, mesma estrutura do LoginScreen — sem logo (única página de Auth sem botão de voltar, por ser posterior ao login). Introdução em 3 passos reaproveitando o Wizard — sem validação entre etapas, só avanço livre até 'Começar a usar'.",
  code: `import { OnboardingScreen } from "./interface/screens/OnboardingScreen/OnboardingScreen";

<OnboardingScreen onFinish={() => navegarParaApp()} />`,
  Demo: OnboardingScreenDemo,
};

export default story;
