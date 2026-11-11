import type { StoryMeta } from "../types";
import { AvatarDemo } from "../atoms/AvatarDemo";

const story: StoryMeta = {
  id: "avatar",
  order: 130,
  title: "Avatar",
  group: "Átomos",
  status: "draft",
  category: "display",
  contractFile: "contratos/avatar.contract.json",
  dependencies: ["Icon"],
  tokensSummary: ["semantic.fundo-secundario/texto-secundario", "semantic.borda-sucesso/aviso/inativo (status)", "structural.icone-grande/extra-grande/espaco-xg/xgg", "type-style.texto-p/m/m-forte/g-forte"],
  description: "Foto → iniciais → ícone genérico, nessa ordem de fallback. 4 tamanhos, circle ou square, indicador de presença opcional.",
  code: `<Avatar src="/foto.jpg" name="Ana Souza" />
<Avatar name="Ana Souza" size="large" status="online" />
<Avatar accessibleLabel="Usuário anônimo" shape="square" />`,
  Demo: AvatarDemo,
};

export default story;
