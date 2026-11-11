import type { StoryMeta } from "../types";
import { ModalDemo } from "../organisms/ModalDemo";

const story: StoryMeta = {
  id: "modal",
  order: 580,
  title: "Modal",
  group: "Organismos",
  status: "draft",
  category: "overlay",
  contractFile: "contratos/modal.contract.json",
  dependencies: ["Icon"],
  tokensSummary: ["semantic.fundo-superficie/sobreposicao", "semantic.borda-base", "structural.espaco-p/g/gg (padding, igual Card)", "type-style.texto-m-forte"],
  description: "<dialog> nativo (showModal) — focus trap e Esc nativos. padding segue a mesma escala do Card. Cabeçalho sem divisória, com 4 variações (título/X, combinados ou nenhum).",
  code: `<Modal open={aberto} onClose={() => setAberto(false)} title="Confirmar exclusão" size="small" padding="medium">
  <p>Esta ação não pode ser desfeita.</p>
  <Button variant="destructive" label="Excluir" onPress={confirmar} />
</Modal>`,
  Demo: ModalDemo,
};

export default story;
