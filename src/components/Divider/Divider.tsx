import styles from "./Divider.module.css";

export type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps {
  orientation?: DividerOrientation;
  label?: string;
}

export function Divider({ orientation = "horizontal", label }: DividerProps) {
  if (orientation === "vertical") {
    return <div className={styles.vertical} role="separator" aria-orientation="vertical" />;
  }

  if (label) {
    return (
      <div className={styles.row} role="separator" aria-orientation="horizontal">
        <span className={styles.line} aria-hidden="true" />
        <span className={styles.label}>{label}</span>
        <span className={styles.line} aria-hidden="true" />
      </div>
    );
  }

  return <div className={styles.horizontal} role="separator" aria-orientation="horizontal" />;
}
