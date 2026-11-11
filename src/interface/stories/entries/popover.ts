import type { StoryMeta } from "../types";
import { PopoverDemo } from "../molecules/PopoverDemo";

const story: StoryMeta = {
  id: "popover",
  order: 340,
  title: "Popover",
  group: "Moléculas",
  status: "draft",
  category: "overlay",
  contractFile: "contratos/popover.contract.json",
  dependencies: [],
  tokensSummary: ["semantic.fundo-superficie/fundo-invertido", "semantic.borda-base", "structural.raio-pp/sombra-p"],
  description: "Painel flutuante genérico ancorado a um gatilho clicável (@floating-ui) — a peça de posicionamento/dismiss reaproveitável pra componentes NOVOS; não substitui a integração já existente em Select/Tooltip/Datatable/Breadcrumb/DatePicker/TimePicker. tone='dark' troca o painel pra fundo-invertido (usado pelo CallControlBar).",
  code: `<Popover content={<div>...</div>} accessibleLabel="Editar">
  <Button label="Abrir" />
</Popover>`,
  Demo: PopoverDemo,
};

export default story;
