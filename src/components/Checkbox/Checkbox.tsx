import { useEffect, useId, useRef } from "react";
import { Icon } from "../Icon/Icon";
import { HelperText } from "../HelperText/HelperText";
import styles from "./Checkbox.module.css";

export type CheckboxState = "default" | "error" | "disabled";

export interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  label: string;
  hideLabel?: boolean;
  required?: boolean;
  state?: CheckboxState;
  helperText?: string;
  onChange?: (checked: boolean) => void;
  name?: string;
}

export function Checkbox({
  checked,
  indeterminate = false,
  label,
  hideLabel = false,
  required = false,
  state = "default",
  helperText,
  onChange,
  name,
}: CheckboxProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const disabled = state === "disabled";
  const error = state === "error";
  // Desabilitado usa icone-inativo (mesmo tom de borda-inativo) — evita o
  // check branco quase invisível sobre o fundo cinza-claro de acao-inativa.
  const checkColor = disabled ? "var(--icone-inativo)" : "var(--acao-primaria-texto)";

  // indeterminate é propriedade DOM, não atributo HTML — precisa de ref
  // (contratos/checkbox.contract.json, decisions).
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={styles.field}>
      <label
        className={`${styles.row} ${disabled ? styles.disabled : ""}`}
        htmlFor={id}
      >
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          className={styles.input}
          checked={checked}
          onChange={(event) => onChange?.(event.target.checked)}
          disabled={disabled}
          required={required}
          aria-required={required || undefined}
          aria-invalid={error || undefined}
          aria-describedby={helperText ? `${id}-message` : undefined}
          name={name}
        />
        <span
          className={`${styles.box} ${
            checked || indeterminate ? styles.marked : styles.unmarked
          } ${error ? styles.error : ""}`}
          aria-hidden="true"
        >
          {indeterminate ? (
            <Icon name="minus" size="small" color={checkColor} />
          ) : checked ? (
            <Icon name="check" size="small" color={checkColor} />
          ) : null}
        </span>
        <span className={`${styles.labelText} ${hideLabel ? styles.srOnly : ""}`}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </span>
      </label>
      {helperText && (
        <div className={styles.helperTextWrapper}>
          <HelperText text={helperText} intent={error ? "error" : "default"} fieldId={id} />
        </div>
      )}
    </div>
  );
}
