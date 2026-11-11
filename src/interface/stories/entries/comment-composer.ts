import type { StoryMeta } from "../types";
import { CommentComposerDemo } from "../molecules/CommentComposerDemo";

const story: StoryMeta = {
  id: "comment-composer",
  order: 410,
  title: "CommentComposer",
  group: "Moléculas",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/comment-composer.contract.json",
  dependencies: ["Textarea", "Button", "Icon"],
  tokensSummary: ["semantic.icone-secundario", "structural.raio-xp/foco-espessura/espaco-xp/pp/p"],
  description: "Textarea (sem label) + barra de utilitários opcionais (anexar imagem, marcar importante) + botão Publicar, desabilitado até haver texto. 100% controlado — não limpa o campo sozinho após onSubmit. maxLength/showCharacterCount/limitMode controlam contador e limite (bloquear digitação ou avisar+bloquear o botão).",
  code: `<CommentComposer value={texto} onChange={setTexto} onSubmit={(v) => { salvar(v); setTexto(""); }} maxLength={280} showCharacterCount limitMode="warn" />`,
  Demo: CommentComposerDemo,
};

export default story;
