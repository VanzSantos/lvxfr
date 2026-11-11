import type { StoryMeta } from "../types";
import { SelectableCardDemo } from "../molecules/SelectableCardDemo";

const story: StoryMeta = {
  id: "selectable-card",
  order: 380,
  title: "SelectableCard",
  group: "Moléculas",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/selectable-card.contract.json",
  dependencies: ["Badge"],
  tokensSummary: ["semantic.fundo-superficie/invertido/acao-primaria/apoio-1/2/3-forte/texto-info", "semantic.borda-base/acao-primaria", "semantic.texto-primario/secundario/invertido/acao-primaria-texto", "structural.raio-pp/circular/espaco-p", "type-style.texto-m-forte/texto-p/texto-g-forte"],
  description: "Cartão radio-selecionável rico — título, descrição, preço e Badge de destaque opcionais. O cartão inteiro é o alvo de clique (mesma técnica de input nativo sr-only do Radio). selectedTone escolhe a cor do fundo selecionado (preto/verde/kiwi/roxo/laranja/azul); se o Badge tiver a mesma cor da seleção, ele inverte automaticamente pra fundo claro + texto colorido.",
  code: `<SelectableCard name="plano" value="black" title="MedSênior Black" price="R$ 000,00" badgeLabel="Black" selectedTone="dark" checked={plano === "black"} onChange={setPlano} />`,
  Demo: SelectableCardDemo,
};

export default story;
