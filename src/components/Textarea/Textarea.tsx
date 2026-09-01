import { useId } from "react";
import { FieldLabel } from "../FieldLabel/FieldLabel";
import { HelperText } from "../HelperText/HelperText";
import styles from "./Textarea.module.css";

export type TextareaState = "default" | "focus" | "error" | "disabled" | "readOnly";

export interface TextareaProps {
  label?: string;
  required?: boolean;
  withInfo?: boolean;
  infoText?: string;
  placeholder?: string;
  value?: string;
  state?: TextareaState;
  helperText?: string;
  onChange?: (value: string) => void;
  rows?: number;
  resizable?: boolean;
  maxLength?: number;
  enforceMaxLength?: boolean;
  showCharacterCount?: boolean;
  name?: string;
}

export function Textarea({
  label,
  required = false,
  withInfo = false,
  infoText,
  placeholder,
  value,
  state = "default",
  helperText,
  onChange,
  rows = 4,
  resizable = true,
  maxLength,
  enforceMaxLength = true,
  showCharacterCount = false,
  name,
}: TextareaProps) {
  const fieldId = useId();
  const disabled = state === "disabled";
  const readOnly = state === "readOnly";
  const error = state === "error";
  const count = value?.length ?? 0;
  const overLimit = maxLength !== undefined && count > maxLength;

  return (
    <div className={styles.field}>
      {label && (
        <FieldLabel
          text={label}
          required={required}
          withInfo={withInfo}
          infoText={infoText}
          fieldId={fieldId}
        />
      )}
      <div className={`${styles.container} ${styles[state]}`} data-state={state}>
        <textarea
          id={fieldId}
          className={`${styles.input} ${resizable ? styles.resizable : ""}`}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          maxLength={enforceMaxLength ? maxLength : undefined}
          aria-required={required || undefined}
          aria-invalid={error || undefined}
          aria-describedby={helperText ? `${fieldId}-message` : undefined}
          name={name}
        />
      </div>
      {(helperText || (showCharacterCount && maxLength !== undefined)) && (
        <div className={styles.footer}>
          {helperText && <HelperText text={helperText} intent={error ? "error" : "default"} fieldId={fieldId} />}
          {showCharacterCount && maxLength !== undefined && (
            <span
              className={`${styles.count} ${overLimit ? styles.countOverLimit : ""}`}
              aria-live="polite"
            >
              {count}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
