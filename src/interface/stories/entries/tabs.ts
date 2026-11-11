import type { StoryMeta } from "../types";
import { TabsDemo } from "../molecules/TabsDemo";

const story: StoryMeta = {
  id: "tabs",
  order: 460,
  title: "Tabs",
  group: "Moléculas",
  status: "draft",
  category: "action",
  contractFile: "contratos/tabs.contract.json",
  dependencies: ["Badge"],
  tokensSummary: ["semantic.acao-primaria (ativo)", "semantic.texto-secundario/inativo", "type-style.texto-rotulo-botao"],
  description: "Navegação entre painéis mutuamente exclusivos. Ativação automática (seta já seleciona), Home/End, pula abas desabilitadas.",
  code: `<Tabs items={[{value:"a",label:"Detalhes"},{value:"b",label:"Histórico"}]} value={aba} onChange={setAba} />
<TabPanel value="a" hidden={aba !== "a"}>Conteúdo A</TabPanel>
<TabPanel value="b" hidden={aba !== "b"}>Conteúdo B</TabPanel>`,
  Demo: TabsDemo,
};

export default story;
