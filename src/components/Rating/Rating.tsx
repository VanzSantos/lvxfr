import { useState } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./Rating.module.css";

export type RatingState = "default" | "readOnly" | "disabled";
export type RatingColor = "green" | "yellow";
export type RatingSize = "default" | "large";
export type RatingDisplay = "stars" | "compact";

interface RatingInteractiveProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  allowHalf?: boolean;
  state?: "default" | "disabled";
  color?: RatingColor;
  size?: RatingSize;
  accessibleLabel?: string;
}

interface RatingReadOnlyProps {
  value: number;
  onChange?: undefined;
  max?: number;
  allowHalf?: boolean;
  state: "readOnly";
  display?: RatingDisplay;
  color?: RatingColor;
  size?: RatingSize;
  accessibleLabel?: string;
}

export type RatingProps = RatingInteractiveProps | RatingReadOnlyProps;

const COLOR_VAR: Record<RatingColor, string> = {
  green: "var(--acao-primaria)",
  yellow: "var(--borda-aviso)",
};

// display='compact' mostra o value como TEXTO ao lado da estrela — o mesmo
// amarelo-500 (borda-aviso) usado na estrela fica claro demais pra leitura de
// texto pequeno, então o texto (só no compact, só na cor yellow) usa
// texto-aviso (amarelo-700, mais escuro) enquanto a estrela continua com a
// cor normal de COLOR_VAR. Ver contratos/rating.contract.json, decisions.
const COMPACT_TEXT_COLOR_VAR: Record<RatingColor, string> = {
  green: "var(--acao-primaria)",
  yellow: "var(--texto-aviso)",
};

const ICON_SIZE: Record<RatingSize, "medium" | "large"> = {
  default: "medium",
  large: "large",
};

function starIconFor(position: number, displayValue: number): { name: "star" | "star-half"; filled: boolean } {
  if (displayValue >= position) return { name: "star", filled: true };
  if (displayValue >= position - 0.5) return { name: "star-half", filled: true };
  return { name: "star", filled: false };
}

function formatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function Rating(props: RatingProps) {
  const { value, max = 5, allowHalf = false, accessibleLabel = "Avaliação" } = props;
  const state = props.state ?? "default";
  const readOnly = state === "readOnly";
  const disabled = state === "disabled";
  const color = props.color ?? "green";
  const size = props.size ?? "default";
  const display = props.state === "readOnly" ? (props.display ?? "stars") : "stars";
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  if (value < 0 || value > max) {
    throw new Error("Rating: value precisa estar entre 0 e max (contratos/rating.contract.json, forbidden).");
  }

  const displayValue = hoverValue ?? value;
  const iconSize = ICON_SIZE[size];

  function valueFromPointer(position: number, event: React.MouseEvent<HTMLSpanElement>): number {
    if (!allowHalf) return position;
    const rect = event.currentTarget.getBoundingClientRect();
    const isLeftHalf = event.clientX - rect.left < rect.width / 2;
    return isLeftHalf ? position - 0.5 : position;
  }

  function handleClick(position: number, event: React.MouseEvent<HTMLSpanElement>) {
    if (readOnly || disabled) return;
    props.onChange?.(valueFromPointer(position, event));
  }

  function handleMouseMove(position: number, event: React.MouseEvent<HTMLSpanElement>) {
    if (readOnly || disabled) return;
    setHoverValue(valueFromPointer(position, event));
  }

  function handleMouseLeave() {
    setHoverValue(null);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (readOnly || disabled) return;
    const step = allowHalf ? 0.5 : 1;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      props.onChange?.(Math.min(max, value + step));
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      props.onChange?.(Math.max(0, value - step));
    } else if (event.key === "Home") {
      event.preventDefault();
      props.onChange?.(0);
    } else if (event.key === "End") {
      event.preventDefault();
      props.onChange?.(max);
    }
  }

  const stars = Array.from({ length: max }, (_, i) => i + 1);

  if (readOnly && display === "compact") {
    return (
      <div
        className={styles.compact}
        role="img"
        aria-label={`${accessibleLabel}: ${value} de ${max}`}
      >
        <Icon name="star" size={iconSize} color={COLOR_VAR[color]} weight="fill" decorative />
        <span className={styles.compactValue} style={{ color: COMPACT_TEXT_COLOR_VAR[color] }}>
          {formatValue(value)}
        </span>
      </div>
    );
  }

  if (readOnly) {
    return (
      <div
        className={styles.rating}
        role="img"
        aria-label={`${accessibleLabel}: ${value} de ${max}`}
      >
        {stars.map((position) => {
          const { name, filled } = starIconFor(position, value);
          return (
            <Icon
              key={position}
              name={name}
              size={iconSize}
              color={filled ? COLOR_VAR[color] : "var(--icone-secundario)"}
              weight={filled ? "fill" : "regular"}
              decorative
            />
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`${styles.rating} ${disabled ? styles.disabled : ""}`}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={accessibleLabel}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={`${value} de ${max}`}
      aria-disabled={disabled || undefined}
      onKeyDown={handleKeyDown}
      onMouseLeave={handleMouseLeave}
    >
      {stars.map((position) => {
        const { name, filled } = starIconFor(position, displayValue);
        return (
          <span
            key={position}
            className={styles.star}
            onClick={(event) => handleClick(position, event)}
            onMouseMove={(event) => handleMouseMove(position, event)}
          >
            <Icon
              name={name}
              size={iconSize}
              color={disabled ? "var(--icone-inativo)" : filled ? COLOR_VAR[color] : "var(--icone-secundario)"}
              weight={filled ? "fill" : "regular"}
              decorative
            />
          </span>
        );
      })}
    </div>
  );
}
