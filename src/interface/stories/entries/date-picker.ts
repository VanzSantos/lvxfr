import type { StoryMeta } from "../types";
import { DatePickerDemo } from "../molecules/DatePickerDemo";

const story: StoryMeta = {
  id: "date-picker",
  order: 270,
  title: "DatePicker",
  group: "Moléculas",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/date-picker.contract.json",
  dependencies: ["Calendar", "FieldLabel", "HelperText", "Icon"],
  tokensSummary: ["semantic.borda-base/erro/inativo", "structural.raio-pp", "type-style.texto-m"],
  description: "Campo de texto que abre o Calendar num popover ancorado — data única ou intervalo (dois campos independentes, Início/Fim). Ícone de calendário à esquerda do trigger (showIcon=false esconde). hideLabel omite o FieldLabel visível sem perder o nome acessível (vira aria-label).",
  code: `<DatePicker label="Data de entrega" value={data} onChange={setData} />
<DatePicker label="Período" range value={intervalo} onChange={setIntervalo} />`,
  Demo: DatePickerDemo,
};

export default story;
