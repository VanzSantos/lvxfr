import type { StoryMeta } from "../types";
import { TimelineDemo } from "../molecules/TimelineDemo";

const story: StoryMeta = {
  id: "timeline",
  order: 350,
  title: "Timeline",
  group: "Moléculas",
  status: "draft",
  category: "display",
  contractFile: "contratos/timeline.contract.json",
  dependencies: ["Icon", "Link"],
  tokensSummary: ["semantic.icone-sucesso/aviso/erro/info/secundario", "semantic.fundo-sucesso/aviso/erro/info/secundario (caixa de valor)", "semantic.borda-base (conector)", "structural.raio-circular/raio-xp"],
  description: "Lista vertical de eventos ordenados cronologicamente — marcador colorido por tone, título, descrição opcional, timestamp, caixa de valor destacada opcional (value) e lista de anexos opcional (attachments, via Link). Puramente informativo (histórico), diferente de Stepper (progresso em andamento).",
  code: `<Timeline
  items={[
    { title: "Pedido criado", timestamp: "18/08 09:12" },
    { title: "Pagamento aprovado", icon: "check-circle", tone: "success", timestamp: "18/08 09:14" },
    { title: "Registro de alta", tone: "success", value: "Registro alta: 02/08/2024", attachments: [{ label: "Ver arquivo em anexo", href: "/arquivos/alta.pdf" }] },
  ]}
/>`,
  Demo: TimelineDemo,
};

export default story;
