import type { StoryMeta } from "../types";
import { CalendarDemo } from "../molecules/CalendarDemo";

const story: StoryMeta = {
  id: "calendar",
  order: 260,
  title: "Calendar",
  group: "Moléculas",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/calendar.contract.json",
  dependencies: ["Icon"],
  tokensSummary: ["semantic.acao-primaria (selecionado)", "semantic.fundo-secundario (hover)", "structural.raio-circular", "type-style.texto-p"],
  description: "Grade de mês com seleção de uma data — setas de mês sempre visíveis, e o rótulo 'Mês de Ano' abre um seletor rápido pra pular direto pra outro mês/ano.",
  code: `<Calendar
  value={data}
  onChange={setData}
  minDate="2026-01-01"
  maxDate="2026-12-31"
  accessibleLabel="Data do evento"
/>`,
  Demo: CalendarDemo,
};

export default story;
