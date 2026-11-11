import type { StoryMeta } from "../types";
import { BadgeDemo } from "../atoms/BadgeDemo";

const story: StoryMeta = {
  id: "badge",
  order: 120,
  title: "Badge",
  group: "Átomos",
  status: "draft",
  category: "display",
  contractFile: "contratos/badge.contract.json",
  dependencies: ["Icon"],
  tokensSummary: ["semantic.texto-*/fundo-*-forte/borda-aviso (fundo sólido, Sinalização + Apoio)", "semantic.acao-destrutiva-pressionada (critical)", "semantic.fundo-superficie/secundario/invertido", "structural.raio-circular/icone-pequeno", "type-style.texto-micro-forte"],
  description: "Rótulo curto ou contador numérico, com ícone opcional (só com label). Fundo sólido + texto branco (ou preto, quando o fundo claro exige) em todas as variantes coloridas (status incluindo critical + accent1/2/3=kiwi/roxo/laranja); neutral/white/dark são as 3 variantes sem cor. label e count são mutuamente exclusivos; position ancora nos 4 cantos de um elemento pai (ex.: contador no Avatar). inverted=true troca pro par claro+colorido, pra usar sobre um fundo já da mesma cor sólida.",
  code: `<Badge variant="success" label="Ativo" />
<Badge variant="critical" label="Atrasado" icon="warning-circle" />
<Badge variant="accent1" label="Beta" />
<Badge variant="error" count={5} />
<Badge variant="dark" count={140} max={99} />`,
  Demo: BadgeDemo,
};

export default story;
