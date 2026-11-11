import type { StoryMeta } from "../types";
import { AvatarGroupDemo } from "../atoms/AvatarGroupDemo";

const story: StoryMeta = {
  id: "avatar-group",
  order: 140,
  title: "AvatarGroup",
  group: "Átomos",
  status: "draft",
  category: "display",
  contractFile: "contratos/avatar-group.contract.json",
  dependencies: ["Avatar"],
  tokensSummary: ["semantic.fundo-secundario/superficie", "semantic.texto-secundario", "structural.raio-circular/espaco-pp"],
  description: "Pilha de Avatars sobrepostos (esquerda por cima), com indicador '+N' quando a lista excede max — ex.: responsáveis por um item.",
  code: `<AvatarGroup avatars={[{ name: "Ana" }, { name: "Carlos" }, { name: "Fernanda" }]} max={5} accessibleLabel="Responsáveis" />`,
  Demo: AvatarGroupDemo,
};

export default story;
