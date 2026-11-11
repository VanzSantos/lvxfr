import type { StoryMeta } from "../types";
import { OtpDemo } from "../atoms/OtpDemo";

const story: StoryMeta = {
  id: "otp",
  order: 190,
  title: "Otp",
  group: "Átomos",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/otp.contract.json",
  dependencies: ["FieldLabel", "HelperText"],
  tokensSummary: ["semantic.borda-base/erro/inativo", "structural.raio-pp", "type-style.texto-g-forte"],
  description: "Um campo por dígito pra código de verificação (2FA, SMS, e-mail) — foco avança sozinho, cola o código inteiro de uma vez, Backspace volta pra caixa anterior.",
  code: `<Otp label="Código de verificação" value={codigo} onChange={setCodigo} onComplete={() => verificar(codigo)} />`,
  Demo: OtpDemo,
};

export default story;
