import { Icon, type IconName } from "../Icon/Icon";
import styles from "./Alert.module.css";

export type AlertIntent = "info" | "success" | "warning" | "error" | "neutral";

export interface AlertAction {
  label: string;
  onAction: () => void;
}

export interface AlertProps {
  intent?: AlertIntent;
  title?: string;
  description: string;
  action?: AlertAction;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const INTENT_ICON: Record<AlertIntent, IconName> = {
  info: "info",
  success: "check-circle",
  warning: "warning-circle",
  error: "x-circle",
  // neutral reaproveita o glifo de 'info' — não tem semântica de status
  // própria (não é erro/sucesso/aviso/info), então não precisa de um glifo
  // dedicado, só uma cor neutra (ver decisions).
  neutral: "info",
};

export function Alert({ intent = "info", title, description, action, dismissible = false, onDismiss }: AlertProps) {
  if (dismissible && !onDismiss) {
    throw new Error("Alert: onDismiss é obrigatório quando dismissible=true.");
  }

  const role = intent === "error" || intent === "warning" ? "alert" : "status";
  const iconColor = intent === "neutral" ? "var(--icone-secundario)" : `var(--icone-${VARIANT_SUFFIX[intent]})`;
  const textColor = intent === "neutral" ? "var(--texto-primario)" : `var(--texto-${VARIANT_SUFFIX[intent]})`;

  return (
    <div className={`${styles.alert} ${styles[intent]}`} role={role}>
      <Icon name={INTENT_ICON[intent]} size="medium" color={iconColor} />
      <div className={styles.content}>
        {title && <strong className={styles.title}>{title}</strong>}
        <div className={styles.descriptionRow}>
          <span className={styles.description}>{description}</span>
          {action && (
            <button type="button" className={styles.action} onClick={action.onAction}>
              {action.label}
            </button>
          )}
        </div>
      </div>
      {dismissible && (
        <button
          type="button"
          className={styles.dismissButton}
          onClick={onDismiss}
          aria-label="Fechar"
        >
          <Icon name="x" size="small" color={textColor} />
        </button>
      )}
    </div>
  );
}

const VARIANT_SUFFIX: Record<Exclude<AlertIntent, "neutral">, string> = {
  info: "info",
  success: "sucesso",
  warning: "aviso",
  error: "erro",
};
