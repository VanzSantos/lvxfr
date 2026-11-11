import type { StoryMeta } from "../types";
import { TimePickerDemo } from "../molecules/TimePickerDemo";

const story: StoryMeta = {
  id: "time-picker",
  order: 280,
  title: "TimePicker",
  group: "Moléculas",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/time-picker.contract.json",
  dependencies: ["FieldLabel", "HelperText", "Icon"],
  tokensSummary: ["semantic.acao-primaria (selecionado)", "semantic.borda-base/erro/inativo", "structural.raio-pp"],
  description: "Campo de texto que abre um popover com duas colunas roláveis (Hora/Minuto) — horário único ou intervalo (dois campos independentes, Início/Fim). Ícone de relógio à esquerda do trigger (showIcon=false esconde).",
  code: `<TimePicker label="Horário do compromisso" value={horario} onChange={setHorario} />
<TimePicker label="Janela" range value={intervalo} onChange={setIntervalo} />`,
  Demo: TimePickerDemo,
};

export default story;
