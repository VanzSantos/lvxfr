import type { StoryMeta } from "../types";
import { StepperDemo } from "../molecules/StepperDemo";

const story: StoryMeta = {
  id: "stepper",
  order: 450,
  title: "Stepper",
  group: "Moléculas",
  status: "draft",
  category: "display",
  contractFile: "contratos/stepper.contract.json",
  dependencies: ["Icon"],
  tokensSummary: ["semantic.acao-primaria (etapa atual/concluída)", "semantic.borda-base (pendente)", "structural.raio-circular", "type-style.texto-p/texto-micro"],
  description: "Indicador horizontal de progresso por etapas nomeadas — número ou ícone por etapa, texto principal + secundário. Só mostra o progresso; a navegação real entre telas é do organismo Wizard.",
  code: `<Stepper
  items={[
    { label: "Dados pessoais", description: "Nome e e-mail" },
    { label: "Endereço" },
    { label: "Pagamento", icon: "check-circle" },
  ]}
  currentStep={1}
  accessibleLabel="Etapas do cadastro"
/>`,
  Demo: StepperDemo,
};

export default story;
