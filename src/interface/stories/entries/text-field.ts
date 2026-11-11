import type { StoryMeta } from "../types";
import { TextFieldDemo } from "../molecules/TextFieldDemo";

const story: StoryMeta = {
  id: "text-field",
  order: 500,
  title: "TextField",
  group: "Moléculas",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/text-field.contract.json",
  dependencies: ["FieldLabel", "HelperText", "Icon", "Tooltip (indireto)"],
  tokensSummary: ["semantic.borda-*", "semantic.fundo-superficie", "type-style.texto-m"],
  description: "Campo de texto com rótulo, mensagem de apoio e ícones internos. type=password embute toggle de mostrar/ocultar.",
  code: `<TextField label="Sem ícone" value={texto} onChange={setTexto} />
<TextField label="Ícone à esquerda" leftIcon="info" value={v} onChange={setV} />
<TextField label="Ícone à direita" rightIcon="arrow-right" value={v} onChange={setV} />
<TextField label="Ícone nos dois lados" leftIcon="info" rightIcon="arrow-right" value={v} onChange={setV} />
<TextField label="Senha" type="password" value={senha} onChange={setSenha} />`,
  Demo: TextFieldDemo,
};

export default story;
