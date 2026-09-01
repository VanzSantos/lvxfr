// Máscara compartilhada por DatePicker/TimePicker/DateTimePicker — só dígitos,
// separadores (/ e :) inseridos automaticamente conforme o usuário digita.
// Ver contratos/date-picker.contract.json, contratos/time-picker.contract.json,
// contratos/date-time-picker.contract.json (decisions) para o racional completo.

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function maskDateDigits(raw: string): string {
  const digits = onlyDigits(raw).slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return [day, month, year].filter(Boolean).join("/");
}

export function parseMaskedDate(masked: string): string | null {
  const digits = onlyDigits(masked);
  if (digits.length !== 8) return null;
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  if (month < 1 || month > 12) return null;
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return null;
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function maskTimeDigits(raw: string): string {
  const digits = onlyDigits(raw).slice(0, 4);
  const hour = digits.slice(0, 2);
  const minute = digits.slice(2, 4);
  return [hour, minute].filter(Boolean).join(":");
}

export function parseMaskedTime(masked: string): string | null {
  const digits = onlyDigits(masked);
  if (digits.length !== 4) return null;
  const hour = Number(digits.slice(0, 2));
  const minute = Number(digits.slice(2, 4));
  if (hour > 23 || minute > 59) return null;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function maskDateTimeDigits(raw: string): string {
  const digits = onlyDigits(raw).slice(0, 12);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  const hour = digits.slice(8, 10);
  const minute = digits.slice(10, 12);
  const datePart = [day, month, year].filter(Boolean).join("/");
  const timePart = [hour, minute].filter(Boolean).join(":");
  return timePart ? `${datePart} ${timePart}` : datePart;
}

export function parseMaskedDateTime(masked: string): string | null {
  const digits = onlyDigits(masked);
  if (digits.length !== 12) return null;
  const datePart = parseMaskedDate(digits.slice(0, 8));
  const timePart = parseMaskedTime(digits.slice(8, 12));
  if (!datePart || !timePart) return null;
  return `${datePart}T${timePart}`;
}
