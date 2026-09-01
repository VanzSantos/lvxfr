import { ProgressBar, type ProgressBarVariant } from "../ProgressBar/ProgressBar";
import styles from "./ProgressList.module.css";

export interface ProgressListItem {
  label: string;
  value: number;
  max?: number;
  count: string;
  variant?: ProgressBarVariant;
}

export interface ProgressListProps {
  items: ProgressListItem[];
}

export function ProgressList({ items }: ProgressListProps) {
  if (items.length === 0) {
    throw new Error("ProgressList: items não pode ser vazio (contratos/progress-list.contract.json, forbidden).");
  }

  return (
    <ul className={styles.list}>
      {items.map((item, index) => (
        <li key={index} className={styles.item}>
          <span className={styles.label}>{item.label}</span>
          <div className={styles.row}>
            <div className={styles.barWrapper}>
              <ProgressBar
                value={item.value}
                max={item.max}
                variant={item.variant}
                accessibleLabel={`${item.label}: ${item.count}`}
              />
            </div>
            <span className={styles.count}>{item.count}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
