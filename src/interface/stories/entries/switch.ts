import type { StoryMeta } from "../types";
import { SwitchDemo } from "../atoms/SwitchDemo";

const story: StoryMeta = {
  id: "switch",
  order: 100,
  title: "Switch",
  group: "Átomos",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/switch.contract.json",
  dependencies: [],
  tokensSummary: ["semantic.acao-primaria", "semantic.fundo-secundario", "structural.raio-circular"],
  description: "Liga/desliga com efeito instantâneo, sem submit. Label opcional — use accessibleLabel quando o rótulo já existe fora do componente.",
  code: `<Switch label="Notificações por e-mail" checked={notificacoes} onChange={setNotificacoes} />
<Switch accessibleLabel="Modo escuro" checked={modoEscuro} onChange={setModoEscuro} />`,
  Demo: SwitchDemo,
};

export default story;
