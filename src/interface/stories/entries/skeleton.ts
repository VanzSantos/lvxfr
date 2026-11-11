import type { StoryMeta } from "../types";
import { SkeletonDemo } from "../atoms/SkeletonDemo";

const story: StoryMeta = {
  id: "skeleton",
  order: 60,
  title: "Skeleton",
  group: "Átomos",
  status: "draft",
  category: "display",
  contractFile: "contratos/skeleton.contract.json",
  dependencies: [],
  tokensSummary: ["semantic.acao-inativa", "structural.raio-xp/pp/circular"],
  description: "Silhueta do formato do conteúdo carregando — diferente do Spinner. Sempre aria-hidden; animação respeita prefers-reduced-motion.",
  code: `<Skeleton shape="circle" />
<Skeleton shape="text" width="60%" />
<Skeleton shape="rect" height="160px" />`,
  Demo: SkeletonDemo,
};

export default story;
