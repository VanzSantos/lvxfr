import type { StoryMeta } from "../types";
import { PasswordStrengthMeterDemo } from "../atoms/PasswordStrengthMeterDemo";

const story: StoryMeta = {
  id: "password-strength-meter",
  order: 210,
  title: "PasswordStrengthMeter",
  group: "Átomos",
  status: "draft",
  category: "display",
  contractFile: "contratos/password-strength-meter.contract.json",
  dependencies: [],
  tokensSummary: ["semantic.acao-destrutiva/borda-aviso/info/sucesso", "structural.raio-circular"],
  description: "Barra segmentada + rótulo textual de força de senha, pareado com TextField type='password' — heurística simples e visual, não é cálculo de entropia criptográfica.",
  code: `<TextField label="Nova senha" type="password" value={senha} onChange={setSenha} />
<PasswordStrengthMeter value={senha} />`,
  Demo: PasswordStrengthMeterDemo,
};

export default story;
