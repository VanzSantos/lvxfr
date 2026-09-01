import { useId } from "react";
import { Badge, type BadgeVariant } from "../Badge/Badge";
import styles from "./SelectableCard.module.css";

export type SelectableCardState = "default" | "disabled";
export type SelectableCardTone = "dark" | "primary" | "accent1" | "accent2" | "accent3" | "info";

const TONE_CLASS: Record<SelectableCardTone, string> = {
  dark: styles.toneDark,
  primary: styles.tonePrimary,
  accent1: styles.toneAccent1,
  accent2: styles.toneAccent2,
  accent3: styles.toneAccent3,
  info: styles.toneInfo,
};

// Nem todo SelectableCardTone tem um BadgeVariant "da mesma família de cor" — 'primary'
// (verde-ação) não existe como variant do Badge, então nunca colide. Ver decisions.
const TONE_TO_BADGE_VARIANT: Partial<Record<SelectableCardTone, BadgeVariant>> = {
  dark: "dark",
  accent1: "accent1",
  accent2: "accent2",
  accent3: "accent3",
  info: "info",
};

export interface SelectableCardProps {
  checked: boolean;
  name: string;
  value: string;
  title: string;
  onChange?: (value: string) => void;
  description?: string;
  price?: string;
  badgeLabel?: string;
  badgeVariant?: BadgeVariant;
  state?: SelectableCardState;
  selectedTone?: SelectableCardTone;
}

export function SelectableCard({
  checked,
  name,
  value,
  title,
  onChange,
  description,
  price,
  badgeLabel,
  badgeVariant = "neutral",
  state = "default",
  selectedTone = "dark",
}: SelectableCardProps) {
  const id = useId();
  const disabled = state === "disabled";
  const badgeClashesWithSelection = checked && TONE_TO_BADGE_VARIANT[selectedTone] === badgeVariant;

  return (
    <label
      htmlFor={id}
      className={`${styles.card} ${checked ? `${styles.checked} ${TONE_CLASS[selectedTone]}` : ""} ${disabled ? styles.disabled : ""}`}
    >
      <input
        id={id}
        type="radio"
        className={styles.input}
        checked={checked}
        onChange={() => onChange?.(value)}
        value={value}
        name={name}
        disabled={disabled}
      />
      <span className={styles.header}>
        <span className={`${styles.circle} ${checked ? styles.circleMarked : ""}`} aria-hidden="true">
          {checked && <span className={styles.dot} />}
        </span>
        {badgeLabel && <Badge variant={badgeVariant} label={badgeLabel} inverted={badgeClashesWithSelection} />}
      </span>
      <span className={styles.title}>{title}</span>
      {description && <span className={styles.description}>{description}</span>}
      {price && <span className={styles.price}>{price}</span>}
    </label>
  );
}
