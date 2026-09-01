import { Icon, type IconName } from "../Icon/Icon";
import styles from "./Stepper.module.css";

export interface StepperItem {
  label: string;
  description?: string;
  icon?: IconName;
}

export type StepperVariant = "inline" | "stacked";

export interface StepperProps {
  items: StepperItem[];
  currentStep: number;
  accessibleLabel: string;
  onStepClick?: (index: number) => void;
  variant?: StepperVariant;
}

type StepStatus = "pending" | "current" | "completed";

export function Stepper({ items, currentStep, accessibleLabel, onStepClick, variant = "stacked" }: StepperProps) {
  if (items.length < 2) {
    throw new Error("Stepper: precisa de pelo menos 2 items (contratos/stepper.contract.json, forbidden).");
  }
  if (currentStep < 0 || currentStep > items.length - 1) {
    throw new Error("Stepper: currentStep precisa estar entre 0 e items.length - 1.");
  }

  function statusOf(index: number): StepStatus {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "current";
    return "pending";
  }

  return (
    <nav aria-label={accessibleLabel} className={styles.nav}>
      <ol className={`${styles.list} ${variant === "stacked" ? styles.listStacked : styles.listInline}`}>
        {items.map((item, index) => {
          const status = statusOf(index);
          const clickable = Boolean(onStepClick) && status !== "pending";
          const indicator = item.icon ? (
            <Icon
              name={item.icon}
              size="small"
              color={
                status === "completed"
                  ? "var(--acao-primaria-texto)"
                  : status === "current"
                    ? "var(--acao-primaria)"
                    : "var(--icone-secundario)"
              }
              decorative
            />
          ) : status === "completed" ? (
            <Icon name="check" size="small" color="var(--acao-primaria-texto)" decorative />
          ) : (
            <span>{index + 1}</span>
          );

          const content = (
            <>
              <span className={`${styles.marker} ${styles[status]}`}>{indicator}</span>
              <span className={styles.texts}>
                <span className={styles.label}>{item.label}</span>
                {item.description && <span className={styles.description}>{item.description}</span>}
              </span>
            </>
          );

          const stepClassName = `${styles.step} ${variant === "stacked" ? styles.stepStacked : styles.stepInline}`;

          return (
            <li key={item.label} className={`${styles.item} ${variant === "stacked" ? styles.itemStacked : styles.itemInline}`}>
              {variant === "stacked" && index > 0 && (
                <span className={`${styles.connector} ${index <= currentStep ? styles.connectorDone : ""}`} aria-hidden="true" />
              )}
              {clickable ? (
                <button
                  type="button"
                  className={stepClassName}
                  onClick={() => onStepClick?.(index)}
                  aria-current={status === "current" ? "step" : undefined}
                  aria-label={`${item.label}, ${status === "completed" ? "concluída" : "etapa atual"}`}
                >
                  {content}
                </button>
              ) : (
                <div className={stepClassName} aria-current={status === "current" ? "step" : undefined}>
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
