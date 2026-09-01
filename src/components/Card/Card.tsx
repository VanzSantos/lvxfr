import type { ReactNode } from "react";
import styles from "./Card.module.css";

export type CardPadding = "small" | "medium" | "large";
export type CardElevation = "none" | "low" | "medium" | "high";

export interface CardProps {
  children: ReactNode;
  padding?: CardPadding;
  elevation?: CardElevation;
}

export function Card({ children, padding = "large", elevation = "none" }: CardProps) {
  return (
    <div className={`${styles.card} ${styles[padding]} ${styles[`elevation-${elevation}`]}`}>
      {children}
    </div>
  );
}
