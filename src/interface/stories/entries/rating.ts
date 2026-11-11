import type { StoryMeta } from "../types";
import { RatingDemo } from "../atoms/RatingDemo";

const story: StoryMeta = {
  id: "rating",
  order: 200,
  title: "Rating",
  group: "Átomos",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/rating.contract.json",
  dependencies: ["Icon"],
  tokensSummary: ["semantic.acao-primaria (preenchida)", "semantic.icone-secundario/inativo", "structural.icone-medio"],
  description: "Avaliação por estrelas — inteiro ou com meio-ponto (allowHalf), interativa (role=slider) ou readOnly (role=img, ex.: nota média de um produto).",
  code: `<Rating value={nota} onChange={setNota} allowHalf accessibleLabel="Avalie o atendimento" />
<Rating value={4.5} allowHalf state="readOnly" accessibleLabel="Nota média" />`,
  Demo: RatingDemo,
};

export default story;
