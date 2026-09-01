import { Icon, type IconName } from "../Icon/Icon";
import styles from "./DataField.module.css";

export interface DataFieldProps {
  label: string;
  value: string;
  icon?: IconName;
}

export function DataField({ label, value, icon }: DataFieldProps) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>
        {icon && <Icon name={icon} size="small" color="var(--icone-secundario)" decorative />}
        {value}
      </span>
    </div>
  );
}
