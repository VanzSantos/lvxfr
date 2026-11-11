import type { StoryMeta } from "../types";
import { NavBarDemo } from "../organisms/NavBarDemo";

const story: StoryMeta = {
  id: "navbar",
  order: 620,
  title: "NavBar",
  group: "Organismos",
  status: "draft",
  category: "action",
  contractFile: "contratos/navbar.contract.json",
  dependencies: ["Link", "Icon", "Drawer"],
  tokensSummary: ["semantic.fundo-superficie", "semantic.borda-base", "structural.espaco-p/g/m", "semantic.acao-link-texto (via Link)", "structural.sombra-p (dropdown)"],
  description: "Barra de navegação de topo — marca, links de navegação primária (item ativo controlado de fora, agnóstico de roteador) e slot de ações livre à direita. Item com children vira dropdown em cascata (até 4 níveis); abaixo de 768px a lista de itens colapsa num Drawer (mesma árvore, formato expansível).",
  code: `<NavBar
  brand={<strong>Produto</strong>}
  items={[
    { label: "Início", href: "/", active: true },
    { label: "Pedidos", href: "/pedidos" },
  ]}
  actions={<Avatar name="Ana Souza" size="small" />}
/>`,
  Demo: NavBarDemo,
};

export default story;
