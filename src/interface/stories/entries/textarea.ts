import type { StoryMeta } from "../types";
import { TextareaDemo } from "../molecules/TextareaDemo";

const story: StoryMeta = {
  id: "textarea",
  order: 510,
  title: "Textarea",
  group: "Moléculas",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/textarea.contract.json",
  dependencies: ["FieldLabel", "HelperText", "Icon (indireto)", "Tooltip (indireto)"],
  tokensSummary: ["semantic.borda-*", "semantic.fundo-superficie", "semantic.texto-erro", "type-style.texto-m/texto-micro"],
  description: "Igual ao TextField, mas multi-linha. Sem leftIcon/rightIcon — não há espaço natural pra ícone num campo que quebra linha. showCharacterCount mostra 'N/max'; enforceMaxLength=false permite digitar além do limite (pra quem quer avisar em vez de bloquear).",
  code: `<Textarea label="Descrição" value={v} onChange={setV} maxLength={280} showCharacterCount />
<Textarea label="Comentário" required state="error" helperText="Obrigatório." />
<Textarea label="Sem bloqueio físico" maxLength={100} enforceMaxLength={false} showCharacterCount />`,
  Demo: TextareaDemo,
};

export default story;
