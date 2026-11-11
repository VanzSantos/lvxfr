import type { StoryMeta } from "../types";
import { ToastDemo } from "../molecules/ToastDemo";

const story: StoryMeta = {
  id: "toast",
  order: 550,
  title: "Toast",
  group: "Moléculas",
  status: "draft",
  category: "overlay",
  contractFile: "contratos/toast.contract.json",
  dependencies: ["Icon"],
  tokensSummary: ["semantic.fundo-*-forte (novo, um tom mais claro que o Badge) + texto-aviso", "semantic.texto-invertido", "type-style.texto-m/texto-rotulo-botao"],
  description: "Sistema completo (ToastProvider + useToast()) — notificação transiente, empilha até 3, some sozinha com pausa em hover/foco. Fundo sólido (mais claro que o Badge, pela área maior). Diferente do Alert, que é persistente.",
  code: `const { toast } = useToast();
toast({ intent: "success", message: "Item salvo." });
toast({ intent: "error", message: "Falha ao salvar.", actionLabel: "Tentar de novo", onAction: retry });`,
  Demo: ToastDemo,
};

export default story;
