import { useId } from "react";
import styles from "./Radio.module.css";

export type RadioState = "default" | "error" | "disabled";

export interface RadioProps {
  checked: boolean;
  label: string;
  value: string;
  name: string;
  state?: RadioState;
  onChange?: (value: string) => void;
}

export function Radio({ checked, label, value, name, state = "default", onChange }: RadioProps) {
  const id = useId();
  const disabled = state === "disabled";
  const error = state === "error";

  return (
    <label className={`${styles.row} ${disabled ? styles.disabled : ""}`} htmlFor={id}>
      <input
        id={id}
        type="radio"
        className={styles.input}
        checked={checked}
        onChange={() => onChange?.(value)}
        value={value}
        name={name}
        disabled={disabled}
        aria-invalid={error || undefined}
      />
      <span
        className={`${styles.circle} ${checked ? styles.marked : styles.unmarked} ${
          error ? styles.error : ""
        }`}
        aria-hidden="true"
      >
        {checked && <span className={styles.dot} />}
      </span>
      <span className={styles.labelText}>{label}</span>
    </label>
  );
}
