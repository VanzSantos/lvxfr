// Máscara de CPF (documento brasileiro) usada pelo TextField quando type="cpf".
// Mesmo padrão de phoneMask.ts — ver contratos/text-field.contract.json (decisions).

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function maskCpfDigits(raw: string): string {
  const digits = onlyDigits(raw).slice(0, 11);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6, 9);
  const part4 = digits.slice(9, 11);

  let out = part1;
  if (part2) out += `.${part2}`;
  if (part3) out += `.${part3}`;
  if (part4) out += `-${part4}`;
  return out;
}
