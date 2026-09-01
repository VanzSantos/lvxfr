// Máscara de telefone brasileiro (DDD + número) usada pelo TextField quando type="tel".
// Ver contratos/text-field.contract.json (decisions) para o racional completo.

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function maskPhoneDigits(raw: string): string {
  const digits = onlyDigits(raw).slice(0, 11);
  if (digits.length === 0) return "";
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  let out = digits.length <= 2 ? `(${ddd}` : `(${ddd}) `;
  const splitAt = rest.length > 8 ? 5 : 4;
  const part1 = rest.slice(0, splitAt);
  const part2 = rest.slice(splitAt);
  out += part1;
  if (part2) out += `-${part2}`;
  return out;
}
