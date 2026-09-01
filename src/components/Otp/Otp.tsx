import { useId, useRef } from "react";
import { FieldLabel } from "../FieldLabel/FieldLabel";
import { HelperText } from "../HelperText/HelperText";
import styles from "./Otp.module.css";

export type OtpState = "default" | "error" | "disabled";

export interface OtpProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  label?: string;
  state?: OtpState;
  helperText?: string;
  accessibleLabel?: string;
  name?: string;
}

export function Otp({
  length = 6,
  value,
  onChange,
  onComplete,
  label,
  state = "default",
  helperText,
  accessibleLabel = "Código de verificação",
  name,
}: OtpProps) {
  const fieldId = useId();
  const disabled = state === "disabled";
  const error = state === "error";
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  function applyValue(next: string) {
    const digitsOnly = next.replace(/\D/g, "").slice(0, length);
    onChange(digitsOnly);
    if (digitsOnly.length === length) onComplete?.(digitsOnly);
  }

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const chars = value.split("");
    chars[index] = digit;
    const next = chars.join("").slice(0, length);
    applyValue(next);
    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      event.preventDefault();
      const chars = value.split("");
      chars[index - 1] = "";
      applyValue(chars.join(""));
      inputsRef.current[index - 1]?.focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handlePaste(index: number, event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    const chars = value.split("");
    for (let i = 0; i < pasted.length && index + i < length; i++) {
      chars[index + i] = pasted[i];
    }
    const next = chars.join("").slice(0, length);
    applyValue(next);
    const lastFilledIndex = Math.min(index + pasted.length, length) - 1;
    inputsRef.current[Math.max(lastFilledIndex, 0)]?.focus();
  }

  return (
    <div className={styles.field}>
      {label && <FieldLabel text={label} fieldId={fieldId} />}

      <div
        className={styles.group}
        role="group"
        aria-label={label ? undefined : accessibleLabel}
        aria-labelledby={label ? fieldId : undefined}
      >
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(node) => {
              inputsRef.current[index] = node;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            className={`${styles.box} ${styles[state]}`}
            value={value[index] ?? ""}
            disabled={disabled}
            aria-label={`Dígito ${index + 1} de ${length}`}
            aria-invalid={error || undefined}
            aria-describedby={helperText ? `${fieldId}-message` : undefined}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
          />
        ))}
      </div>

      {name && <input type="hidden" name={name} value={value} />}

      {helperText && <HelperText text={helperText} intent={error ? "error" : "default"} fieldId={fieldId} />}
    </div>
  );
}
