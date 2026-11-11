import type { StoryMeta } from "../types";
import { CardDemo } from "../molecules/CardDemo";

const story: StoryMeta = {
  id: "card",
  order: 520,
  title: "Card",
  group: "Moléculas",
  status: "draft",
  category: "display",
  contractFile: "contratos/card.contract.json",
  dependencies: [],
  tokensSummary: ["semantic.fundo-superficie", "semantic.borda-base", "structural.espaco-p/g/gg", "structural.sombra-pp/p/m"],
  description: "Superfície genérica que agrupa conteúdo — sem slots fixos. elevation opcional (none=só borda, o padrão; low/medium sutis; high mais perceptível).",
  code: `<Card padding="large">
  <form onSubmit={...}>...</form>
</Card>
<Card elevation="high">Card destacado</Card>`,
  Demo: CardDemo,
};

export default story;
