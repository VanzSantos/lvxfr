import { Icon } from "../Icon/Icon";
import styles from "./QuantitySelector.module.css";

export type QuantitySelectorState = "default" | "disabled";

export interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  accessibleLabel: string;
  state?: QuantitySelectorState;
  onChange?: (value: number) => void;
}

export function QuantitySelector({
  value,
  min,
  max,
  step = 1,
  accessibleLabel,
  state = "default",
  onChange,
}: QuantitySelectorProps) {
  const disabled = state === "disabled";
  const atMin = min !== undefined && value <= min;
  const atMax = max !== undefined && value >= max;

  function decrement() {
    const next = value - step;
    if (min !== undefined && next < min) return;
    onChange?.(next);
  }

  function increment() {
    const next = value + step;
    if (max !== undefined && next > max) return;
    onChange?.(next);
  }

  return (
    <div className={`${styles.group} ${disabled ? styles.disabled : ""}`} role="group" aria-label={accessibleLabel}>
      <button
        type="button"
        className={styles.button}
        onClick={decrement}
        disabled={disabled || atMin}
        aria-label={`Diminuir ${accessibleLabel}`}
      >
        <Icon name="minus" size="small" color={disabled || atMin ? "var(--icone-inativo)" : "var(--icone-secundario)"} />
      </button>
      <span className={styles.value} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={styles.button}
        onClick={increment}
        disabled={disabled || atMax}
        aria-label={`Aumentar ${accessibleLabel}`}
      >
        <Icon name="plus" size="small" color={disabled || atMax ? "var(--icone-inativo)" : "var(--icone-secundario)"} />
      </button>
    </div>
  );
}
