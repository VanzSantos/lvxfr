import type { StoryMeta } from "../types";
import { WizardDemo } from "../organisms/WizardDemo";

const story: StoryMeta = {
  id: "wizard",
  order: 600,
  title: "Wizard",
  group: "Organismos",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/wizard.contract.json",
  dependencies: ["Stepper", "Button"],
  tokensSummary: ["structural.espaco-m/g"],
  description: "Orquestra navegação (Anterior/Próxima/Concluir) e validação entre telas de um fluxo multi-etapa, reaproveitando o Stepper como indicador — Stepper nunca sabe o que está sendo validado, só Wizard.",
  code: `<Wizard
  steps={[{ label: "Dados", content: <Form1 /> }, { label: "Revisão", content: <Review /> }]}
  currentStep={passo} onStepChange={setPasso} onComplete={finalizar}
  validateStep={(i) => validar(i)}
/>`,
  Demo: WizardDemo,
};

export default story;
