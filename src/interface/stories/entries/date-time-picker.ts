import type { StoryMeta } from "../types";
import { DateTimePickerDemo } from "../molecules/DateTimePickerDemo";

const story: StoryMeta = {
  id: "date-time-picker",
  order: 290,
  title: "DateTimePicker",
  group: "Moléculas",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/date-time-picker.contract.json",
  dependencies: ["Calendar", "FieldLabel", "HelperText", "Icon"],
  tokensSummary: ["semantic.acao-primaria (selecionado)", "semantic.borda-base/erro/inativo", "structural.raio-pp"],
  description: "Campo de texto único que abre UM popover com Calendar + colunas de Hora/Minuto juntos — data e horário combinados num só valor, ou intervalo (dois campos independentes). Ícone de calendário à esquerda do trigger (showIcon=false esconde).",
  code: `<DateTimePicker label="Início do evento" value={dataHora} onChange={setDataHora} />
<DateTimePicker label="Janela" range value={intervalo} onChange={setIntervalo} />`,
  Demo: DateTimePickerDemo,
};

export default story;
