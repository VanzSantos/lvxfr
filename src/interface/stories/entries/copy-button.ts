import type { StoryMeta } from "../types";
import { CopyButtonDemo } from "../atoms/CopyButtonDemo";

const story: StoryMeta = {
  id: "copy-button",
  order: 220,
  title: "CopyButton",
  group: "Átomos",
  status: "draft",
  category: "action",
  contractFile: "contratos/copy-button.contract.json",
  dependencies: ["Icon"],
  tokensSummary: ["semantic.icone-secundario/sucesso/inativo", "structural.raio-pp"],
  description: "Botão iconOnly que copia um texto pra área de transferência — confirmação visual transiente (ícone vira check por ~2s) e aria-label muda pra 'Copiado!' durante esse tempo.",
  code: `<CopyButton value="sk_live_51H8x9F2aB3f" accessibleLabel="Copiar chave de API" />`,
  Demo: CopyButtonDemo,
};

export default story;
