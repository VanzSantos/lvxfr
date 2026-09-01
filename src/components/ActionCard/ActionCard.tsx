import { Card } from "../Card/Card";
import { Icon, type IconName } from "../Icon/Icon";
import { Button, type ButtonVariant } from "../Button/Button";
import styles from "./ActionCard.module.css";

export type ActionCardIconTone = "default" | "destructive" | "neutral";

export interface ActionCardStatus {
  label: string;
  active: boolean;
}

const ICON_TONE_COLOR: Record<ActionCardIconTone, string> = {
  default: "var(--acao-primaria)",
  destructive: "var(--acao-destrutiva)",
  neutral: "var(--icone-secundario)",
};

const ICON_TONE_CLASS: Record<ActionCardIconTone, string> = {
  default: styles.iconCircleDefault,
  destructive: styles.iconCircleDestructive,
  neutral: styles.iconCircleNeutral,
};

export interface ActionCardProps {
  icon: IconName;
  iconTone?: ActionCardIconTone;
  title: string;
  description: string;
  status?: ActionCardStatus;
  primaryLabel: string;
  onPrimaryAction: () => void;
  primaryVariant?: ButtonVariant;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
  secondaryVariant?: ButtonVariant;
  secondaryOutlined?: boolean;
  onInfo?: () => void;
  onSettings?: () => void;
}

export function ActionCard({
  icon,
  iconTone = "default",
  title,
  description,
  status,
  primaryLabel,
  onPrimaryAction,
  primaryVariant = "primary",
  secondaryLabel,
  onSecondaryAction,
  secondaryVariant = "link",
  secondaryOutlined = false,
  onInfo,
  onSettings,
}: ActionCardProps) {
  if (secondaryLabel !== undefined && onSecondaryAction === undefined) {
    throw new Error("ActionCard: onSecondaryAction é obrigatório quando secondaryLabel é fornecido.");
  }

  return (
    <Card padding="medium">
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={`${styles.iconCircle} ${ICON_TONE_CLASS[iconTone]}`}>
            <Icon name={icon} size="large" weight="bold" color={ICON_TONE_COLOR[iconTone]} decorative />
          </span>
          <div className={styles.utilities}>
            {onInfo && (
              <button type="button" className={styles.utilityButton} onClick={onInfo} aria-label={`Mais informações sobre ${title}`}>
                <Icon name="info" size="small" color="var(--icone-secundario)" decorative />
              </button>
            )}
            {onSettings && (
              <button type="button" className={styles.utilityButton} onClick={onSettings} aria-label={`Configurar ${title}`}>
                <Icon name="gear" size="small" color="var(--icone-secundario)" decorative />
              </button>
            )}
          </div>
        </div>

        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>

        {status && (
          <div className={styles.status}>
            <span className={`${styles.statusDot} ${status.active ? styles.statusActive : ""}`} aria-hidden="true" />
            <span className={styles.statusLabel}>{status.label}</span>
          </div>
        )}

        <div className={styles.actions}>
          <Button variant={primaryVariant} label={primaryLabel} onPress={onPrimaryAction} />
          {secondaryLabel && (
            <Button
              variant={secondaryVariant}
              outlined={secondaryOutlined}
              label={secondaryLabel}
              onPress={onSecondaryAction}
            />
          )}
        </div>
      </div>
    </Card>
  );
}
