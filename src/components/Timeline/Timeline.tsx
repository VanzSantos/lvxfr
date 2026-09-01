import { Icon, type IconName } from "../Icon/Icon";
import { Link } from "../Link/Link";
import styles from "./Timeline.module.css";

export type TimelineTone = "neutral" | "success" | "warning" | "error" | "info";

export interface TimelineAttachment {
  label: string;
  href: string;
  external?: boolean;
}

export interface TimelineItem {
  title: string;
  description?: string;
  timestamp?: string;
  icon?: IconName;
  tone?: TimelineTone;
  /** Caixa de valor destacada do evento (ex.: "Registro alta: 02/08/2024"). Usa o mesmo tone do item. */
  value?: string;
  attachments?: TimelineAttachment[];
}

export interface TimelineProps {
  items: TimelineItem[];
  accessibleLabel?: string;
}

const TONE_COLOR_VAR: Record<TimelineTone, string> = {
  neutral: "var(--icone-secundario)",
  success: "var(--fundo-sucesso-forte)",
  warning: "var(--fundo-aviso-forte)",
  error: "var(--fundo-erro-forte)",
  info: "var(--icone-info)",
};

// warning é a única tone cujo marcador preenchido não passa contraste AA com o
// glyph branco (fundo-aviso-forte = Amarelo-600) — usa texto-primario (preto) em vez de
// texto-invertido só nesse caso. Ver tokens/tokens.css e contratos/timeline.contract.json.
const TONE_ICON_COLOR_VAR: Partial<Record<TimelineTone, string>> = {
  warning: "var(--texto-primario)",
};

const TONE_DEFAULT_ICON: Partial<Record<TimelineTone, IconName>> = {
  success: "check",
  warning: "warning-circle",
  error: "x-circle",
  info: "info",
};

const TONE_VALUE_BG_VAR: Record<TimelineTone, string> = {
  neutral: "var(--fundo-secundario)",
  success: "var(--fundo-sucesso)",
  warning: "var(--fundo-aviso)",
  error: "var(--fundo-erro)",
  info: "var(--fundo-info)",
};

const TONE_VALUE_TEXT_VAR: Record<TimelineTone, string> = {
  neutral: "var(--texto-primario)",
  success: "var(--texto-sucesso)",
  warning: "var(--texto-aviso)",
  error: "var(--texto-erro)",
  info: "var(--texto-info)",
};

export function Timeline({ items, accessibleLabel = "Linha do tempo" }: TimelineProps) {
  if (items.length === 0) {
    throw new Error("Timeline: items não pode ser vazio (contratos/timeline.contract.json, forbidden).");
  }

  return (
    <ol className={styles.list} aria-label={accessibleLabel}>
      {items.map((item, index) => {
        const tone = item.tone ?? "neutral";
        const color = TONE_COLOR_VAR[tone];
        const iconColor = TONE_ICON_COLOR_VAR[tone] ?? "var(--texto-invertido)";
        const icon = item.icon ?? TONE_DEFAULT_ICON[tone];
        const isLast = index === items.length - 1;

        return (
          <li key={index} className={styles.item}>
            <div className={styles.markerColumn}>
              <span className={styles.marker} style={{ background: color }} aria-hidden="true">
                {icon ? (
                  <Icon name={icon} size="small" color={iconColor} decorative />
                ) : (
                  <span className={styles.dot} />
                )}
              </span>
              {!isLast && <span className={styles.connector} aria-hidden="true" />}
            </div>
            <div className={styles.content}>
              <div className={styles.headerRow}>
                <span className={styles.title}>{item.title}</span>
                {item.timestamp && <span className={styles.timestamp}>{item.timestamp}</span>}
              </div>
              {item.description && <span className={styles.description}>{item.description}</span>}
              {item.value && (
                <span
                  className={styles.valueBox}
                  style={{ background: TONE_VALUE_BG_VAR[tone], color: TONE_VALUE_TEXT_VAR[tone] }}
                >
                  {item.value}
                </span>
              )}
              {item.attachments && item.attachments.length > 0 && (
                <div className={styles.attachments}>
                  {item.attachments.map((attachment, attachmentIndex) => (
                    <Link
                      key={attachmentIndex}
                      href={attachment.href}
                      label={attachment.label}
                      external={attachment.external}
                      leftIcon="download-simple"
                    />
                  ))}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
