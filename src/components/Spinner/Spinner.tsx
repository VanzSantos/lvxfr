import type { CSSProperties } from "react";
import styles from "./Spinner.module.css";

export type SpinnerSize = "small" | "medium" | "large" | "extraLarge";

const SIZE_VAR: Record<SpinnerSize, string> = {
  small: "var(--icone-pequeno)",
  medium: "var(--icone-medio)",
  large: "var(--icone-grande, 24px)",
  extraLarge: "var(--icone-extra-grande, 32px)",
};

export interface SpinnerProps {
  size?: SpinnerSize;
  /** Token semântico de cor, já resolvido para um valor CSS (ex.: "var(--acao-carregando-texto)"). */
  color: string;
  decorative?: boolean;
  accessibleLabel?: string;
}

export function Spinner({ size = "medium", color, decorative = true, accessibleLabel }: SpinnerProps) {
  if (!decorative && !accessibleLabel) {
    throw new Error("Spinner: accessibleLabel é obrigatório quando decorative=false.");
  }

  const style: CSSProperties = {
    ["--spinner-size" as string]: SIZE_VAR[size],
    ["--spinner-color" as string]: color,
  };

  return (
    <span
      className={styles.spinner}
      style={style}
      role={decorative ? undefined : "status"}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : accessibleLabel}
    />
  );
}
