import type { StoryMeta } from "../types";
import { ConfirmDialogDemo } from "../organisms/ConfirmDialogDemo";

const story: StoryMeta = {
  id: "confirm-dialog",
  order: 590,
  title: "ConfirmDialog",
  group: "Organismos",
  status: "draft",
  category: "overlay",
  contractFile: "contratos/confirm-dialog.contract.json",
  dependencies: ["Modal", "Button"],
  tokensSummary: ["semantic.fundo-superficie/sobreposicao", "type-style.texto-p"],
  description: "Formaliza o Modal pequeno de título+texto+Cancelar/Confirmar que Datatable já reimplementava ad hoc. Não fecha sozinho após onConfirm — quem consome decide quando (útil pra aguardar uma chamada assíncrona).",
  code: `<ConfirmDialog
  open={aberto} onCancel={() => setAberto(false)} onConfirm={excluir}
  title="Excluir conta?" description="Esta ação não pode ser desfeita."
  confirmLabel="Excluir" confirmVariant="destructive"
/>`,
  Demo: ConfirmDialogDemo,
};

export default story;
