import type { StoryMeta } from "../types";
import { DrawerDemo } from "../organisms/DrawerDemo";

const story: StoryMeta = {
  id: "drawer",
  order: 610,
  title: "Drawer",
  group: "Organismos",
  status: "draft",
  category: "overlay",
  contractFile: "contratos/drawer.contract.json",
  dependencies: ["Icon"],
  tokensSummary: ["semantic.fundo-superficie/sobreposicao", "semantic.borda-base", "structural.espaco-p/g/gg (padding, igual Modal/Card)", "type-style.texto-m-forte"],
  description: "Painel deslizante da borda direita — reaproveita a base do Modal (<dialog>). modal=true bloqueia (showModal), modal=false fica persistente ao lado do conteúdo (show). Animação nativa via @starting-style.",
  code: `<Drawer open={aberto} onClose={() => setAberto(false)} title="Detalhes do item" size="medium">
  <p>Conteúdo do painel.</p>
</Drawer>
<Drawer open={aberto} onClose={() => setAberto(false)} title="Filtros" modal={false}>
  <p>Painel persistente — resto da página continua interativo.</p>
</Drawer>`,
  Demo: DrawerDemo,
};

export default story;
