import { Icon } from "../Icon/Icon";
import styles from "./Chip.module.css";

export type ChipVariant = "neutral" | "info" | "success" | "warning" | "error";

export interface ChipProps {
  label: string;
  variant?: ChipVariant;
  selected?: boolean;
  onToggle?: (nextSelected: boolean) => void;
  removable?: boolean;
  onRemove?: () => void;
  disabled?: boolean;
}

export function Chip({
  label,
  variant = "neutral",
  selected,
  onToggle,
  removable = false,
  onRemove,
  disabled = false,
}: ChipProps) {
  if (selected !== undefined && !onToggle) {
    throw new Error("Chip: onToggle é obrigatório quando selected é fornecido.");
  }
  if (removable && !onRemove) {
    throw new Error("Chip: onRemove é obrigatório quando removable=true.");
  }

  const stateClass = selected ? styles.selected : disabled ? styles.disabled : styles[variant];
  const removeIconColor = selected
    ? "var(--acao-primaria-texto)"
    : disabled
      ? "var(--acao-inativa-texto)"
      : variant === "neutral"
        ? "var(--texto-secundario)"
        : variant === "warning"
          ? "var(--texto-escuro-fixo)"
          : "var(--texto-invertido)";

  return (
    <span className={`${styles.chip} ${stateClass}`}>
      {selected !== undefined ? (
        <button
          type="button"
          className={styles.label}
          aria-pressed={selected}
          disabled={disabled}
          onClick={() => onToggle?.(!selected)}
        >
          {label}
        </button>
      ) : (
        <span className={styles.label}>{label}</span>
      )}
      {removable && (
        <button
          type="button"
          className={styles.removeButton}
          aria-label={`Remover ${label}`}
          disabled={disabled}
          onClick={onRemove}
        >
          <Icon name="x" size="small" color={removeIconColor} />
        </button>
      )}
    </span>
  );
}
