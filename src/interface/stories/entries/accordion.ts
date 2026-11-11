import type { StoryMeta } from "../types";
import { AccordionDemo } from "../molecules/AccordionDemo";

const story: StoryMeta = {
  id: "accordion",
  order: 250,
  title: "Accordion",
  group: "Moléculas",
  status: "draft",
  category: "display",
  contractFile: "contratos/accordion.contract.json",
  dependencies: ["Icon"],
  tokensSummary: ["semantic.fundo-superficie", "semantic.borda-base", "structural.raio-pp", "type-style.texto-p"],
  description: "Cabeçalho clicável que expande/colapsa um painel — item único ou vários agrupados (mode='single'|'multiple'), 100% controlado via openKeys/onChange.",
  code: `<Accordion
  items={[
    { key: "faq-1", label: "Como funciona o frete grátis?", content: <p>...</p> },
    { key: "faq-2", label: "Posso trocar um produto?", content: <p>...</p> },
  ]}
  openKeys={openKeys}
  onChange={setOpenKeys}
  mode="single"
/>`,
  Demo: AccordionDemo,
};

export default story;
