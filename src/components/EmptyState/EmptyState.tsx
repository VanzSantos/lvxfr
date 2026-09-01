import { Icon, type IconName } from "../Icon/Icon";
import { Button } from "../Button/Button";
import styles from "./EmptyState.module.css";

export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  if ((actionLabel && !onAction) || (!actionLabel && onAction)) {
    throw new Error("EmptyState: actionLabel e onAction são mutuamente dependentes.");
  }

  return (
    <div className={styles.wrapper}>
      {icon && (
        <Icon name={icon} size="extraLarge" color="var(--icone-secundario)" decorative />
      )}
      <span className={styles.title}>{title}</span>
      {description && <span className={styles.description}>{description}</span>}
      {actionLabel && onAction && (
        <div className={styles.action}>
          <Button variant="primary" label={actionLabel} onPress={onAction} />
        </div>
      )}
    </div>
  );
}
