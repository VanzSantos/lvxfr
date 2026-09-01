import { Icon, type IconName } from "../Icon/Icon";
import styles from "./Badge.module.css";

export type BadgeVariant =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "critical"
  | "accent1"
  | "accent2"
  | "accent3"
  | "neutral"
  | "white"
  | "dark";
export type BadgePosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export interface BadgeProps {
  variant?: BadgeVariant;
  label?: string;
  count?: number;
  max?: number;
  position?: BadgePosition;
  icon?: IconName;
  inverted?: boolean;
}

const POSITION_CLASS: Record<BadgePosition, string> = {
  "top-right": styles.topRight,
  "top-left": styles.topLeft,
  "bottom-right": styles.bottomRight,
  "bottom-left": styles.bottomLeft,
};

export function Badge({ variant = "neutral", label, count, max = 99, position, icon, inverted = false }: BadgeProps) {
  if (label !== undefined && count !== undefined) {
    throw new Error("Badge: label e count são mutuamente exclusivos — use só um.");
  }
  if (label === undefined && count === undefined) {
    throw new Error("Badge: é obrigatório fornecer label ou count.");
  }
  if (icon !== undefined && count !== undefined) {
    throw new Error("Badge: icon não é suportado junto de count — só junto de label.");
  }

  const content = label ?? (count! > max ? `${max}+` : String(count));

  return (
    <span
      className={`${styles.badge} ${styles[variant]} ${inverted ? styles.inverted : ""} ${position ? POSITION_CLASS[position] : ""}`}
    >
      {icon && <Icon name={icon} size="small" color="currentColor" decorative />}
      {content}
    </span>
  );
}
