import { useId } from "react";
import styles from "./Switch.module.css";

export type SwitchState = "default" | "disabled";
export type SwitchSize = "medium" | "small";

export interface SwitchProps {
  checked: boolean;
  label?: string;
  accessibleLabel?: string;
  state?: SwitchState;
  size?: SwitchSize;
  onChange?: (checked: boolean) => void;
  name?: string;
}

export function Switch({
  checked,
  label,
  accessibleLabel,
  state = "default",
  size = "medium",
  onChange,
  name,
}: SwitchProps) {
  const id = useId();
  const disabled = state === "disabled";

  return (
    <label
      className={`${styles.row} ${label ? "" : styles.bare} ${disabled ? styles.disabled : ""} ${
        size === "small" ? styles.small : ""
      }`}
      htmlFor={id}
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
        disabled={disabled}
        aria-checked={checked}
        aria-label={label ? undefined : accessibleLabel}
        name={name}
      />
      <span
        className={`${styles.track} ${checked ? styles.checked : styles.unchecked}`}
        aria-hidden="true"
      >
        <span className={styles.thumb} />
      </span>
      {label && <span className={styles.labelText}>{label}</span>}
    </label>
  );
}
