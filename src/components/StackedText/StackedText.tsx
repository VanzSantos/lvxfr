import styles from "./StackedText.module.css";

export type StackedTextAlign = "left" | "center" | "right";

export interface StackedTextProps {
  primaryText: string;
  secondaryText: string;
  align?: StackedTextAlign;
}

export function StackedText({ primaryText, secondaryText, align = "left" }: StackedTextProps) {
  return (
    <span className={styles.stack} style={{ textAlign: align, alignItems: ALIGN_ITEMS[align] }}>
      <span className={styles.primary}>{primaryText}</span>
      <span className={styles.secondary}>{secondaryText}</span>
    </span>
  );
}

const ALIGN_ITEMS: Record<StackedTextAlign, string> = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};
