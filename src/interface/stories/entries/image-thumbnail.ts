import type { StoryMeta } from "../types";
import { ImageThumbnailDemo } from "../atoms/ImageThumbnailDemo";

const story: StoryMeta = {
  id: "image-thumbnail",
  order: 180,
  title: "ImageThumbnail",
  group: "Átomos",
  status: "draft",
  category: "display",
  contractFile: "contratos/image-thumbnail.contract.json",
  dependencies: ["Modal", "Icon"],
  tokensSummary: ["semantic.fundo-secundario", "semantic.borda-base", "structural.raio-pp", "structural.icone-extra-grande/espaco-xg/espaco-xgg (tamanhos)"],
  description: "Miniatura de imagem, clicável opcional pra abrir ampliada num Modal. Nasceu como tipo de célula pra Datatable.",
  code: `<ImageThumbnail src="/produto.jpg" alt="Fone azul" clickable />`,
  Demo: ImageThumbnailDemo,
};

export default story;
