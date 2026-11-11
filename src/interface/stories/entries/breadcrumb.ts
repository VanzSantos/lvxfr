import type { StoryMeta } from "../types";
import { BreadcrumbDemo } from "../molecules/BreadcrumbDemo";

const story: StoryMeta = {
  id: "breadcrumb",
  order: 480,
  title: "Breadcrumb",
  group: "Moléculas",
  status: "draft",
  category: "action",
  contractFile: "contratos/breadcrumb.contract.json",
  dependencies: ["Link", "Icon"],
  tokensSummary: ["semantic.acao-link-texto (itens)", "semantic.texto-primario (atual)", "semantic.icone-secundario (separador)"],
  description: "Trilha hierárquica de navegação. O último item é sempre a página atual, nunca um link, mesmo que venha com href.",
  code: `<Breadcrumb items={[
  { label: "Início", href: "/" },
  { label: "Configurações", href: "/config" },
  { label: "Perfil" },
]} />`,
  Demo: BreadcrumbDemo,
};

export default story;
