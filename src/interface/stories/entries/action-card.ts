import type { StoryMeta } from "../types";
import { ActionCardDemo } from "../molecules/ActionCardDemo";

const story: StoryMeta = {
  id: "action-card",
  order: 390,
  title: "ActionCard",
  group: "Moléculas",
  status: "draft",
  category: "display",
  contractFile: "contratos/action-card.contract.json",
  dependencies: ["Card", "Icon", "Button"],
  tokensSummary: ["semantic.acao-primaria/acao-destrutiva (+ variantes -transparente pro círculo do ícone)", "semantic.texto-primario/secundario/icone-secundario/icone-inativo", "structural.raio-xp/circular/espaco-xp/p/m", "type-style.texto-m-forte/texto-p"],
  description: "Cartão de ação administrativa — ícone dentro de um círculo de fundo translúcido na mesma cor, título, descrição, status opcional e botão(ões) de ação sempre ancorados no fim do card. secondaryVariant permite um rodapé com 2 botões reais em vez de botão+link.",
  code: `<ActionCard icon="user" title="Contatos de suporte" description="Gerencie os contatos regionais." primaryLabel="Gerenciar contatos" onPrimaryAction={fn} />`,
  Demo: ActionCardDemo,
};

export default story;
