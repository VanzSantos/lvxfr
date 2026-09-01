import styles from "./ProgressBar.module.css";

export type ProgressBarVariant = "primary" | "success" | "error" | "warning" | "critical" | "neutral";

export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: ProgressBarVariant;
  showValue?: boolean;
  accessibleLabel: string;
}

export function ProgressBar({
  value,
  max = 100,
  variant = "primary",
  showValue = false,
  accessibleLabel,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max === 0 ? 0 : (clamped / max) * 100;

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={accessibleLabel}
      >
        <div
          className={`${styles.fill} ${styles[variant]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showValue && <span className={styles.value}>{Math.round(percent)}%</span>}
    </div>
  );
}
