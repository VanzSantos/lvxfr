import type { StoryMeta } from "../types";
import { SideNavDemo } from "../organisms/SideNavDemo";

const story: StoryMeta = {
  id: "side-nav",
  order: 630,
  title: "SideNav",
  group: "Organismos",
  status: "draft",
  category: "action",
  contractFile: "contratos/side-nav.contract.json",
  dependencies: ["Link", "Icon", "Drawer"],
  tokensSummary: ["semantic.fundo-superficie", "semantic.acao-primaria-transparente (item ativo)", "semantic.borda-base", "structural.espaco-p/m/g"],
  description: "Menu de navegação vertical, lateral — um nível só (flat) ou árvore de até 4 níveis (grupos expansíveis, indentados, mesmo padrão do Accordion). Abaixo de 768px o painel colapsa num Drawer com a mesma árvore. Componente novo — não existia menu lateral persistente no harness antes deste contrato.",
  code: `<SideNav
  items={[
    { key: "inicio", label: "Início", href: "/", icon: "house", active: true },
    {
      key: "documentos",
      label: "Documentos",
      children: [
        { key: "contratos", label: "Contratos", href: "/documentos/contratos" },
      ],
    },
  ]}
  openKeys={openKeys}
  onOpenKeysChange={setOpenKeys}
/>`,
  Demo: SideNavDemo,
};

export default story;
