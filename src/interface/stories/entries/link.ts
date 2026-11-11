import type { StoryMeta } from "../types";
import { LinkDemo } from "../atoms/LinkDemo";

const story: StoryMeta = {
  id: "link",
  order: 470,
  title: "Link",
  group: "Átomos",
  status: "draft",
  category: "action",
  contractFile: "contratos/link.contract.json",
  dependencies: ["Icon"],
  tokensSummary: ["semantic.acao-link-texto", "semantic.acao-link-texto-sobreposto", "structural.icone-pequeno"],
  description: "Âncora semântica (<a href>) pra navegação real — diferente do Button variant='link', que é uma ação, não uma URL.",
  code: `<Link href="/termos" label="termos de uso" />
<Link href="/saiba-mais" label="Sempre sublinhado" underline />
<Link href="https://exemplo.com" label="Documentação" external />
<Link href="#" label="Indisponível" state="disabled" />`,
  Demo: LinkDemo,
};

export default story;
