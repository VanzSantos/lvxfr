import { Card, type CardElevation } from "../Card/Card";
import { Icon, type IconName } from "../Icon/Icon";
import styles from "./StatCard.module.css";

export type StatCardTrendDirection = "up" | "down" | "neutral";
export type StatCardTrendTone = "success" | "error" | "neutral";

export interface StatCardProps {
  label: string;
  value: string;
  icon?: IconName;
  trendDirection?: StatCardTrendDirection;
  trendValue?: string;
  trendTone?: StatCardTrendTone;
  helperText?: string;
  elevation?: CardElevation;
  /** true = borda do card fica vermelha (acao-destrutiva). Opt-in, não derivado automaticamente de trendTone — nem todo card com tendência de erro é "crítico" a ponto de precisar de borda. */
  critical?: boolean;
}

const DEFAULT_TONE: Record<StatCardTrendDirection, StatCardTrendTone> = {
  up: "success",
  down: "error",
  neutral: "neutral",
};

const TONE_COLOR_VAR: Record<StatCardTrendTone, string> = {
  success: "var(--texto-sucesso)",
  error: "var(--texto-erro)",
  neutral: "var(--texto-secundario)",
};

const ICON_CIRCLE_BG_VAR: Record<StatCardTrendTone, string> = {
  success: "var(--acao-primaria-transparente)",
  error: "var(--acao-destrutiva-transparente)",
  neutral: "var(--fundo-secundario)",
};

export function StatCard({
  label,
  value,
  icon,
  trendDirection,
  trendValue,
  trendTone,
  helperText,
  elevation = "none",
  critical = false,
}: StatCardProps) {
  const tone = trendDirection ? (trendTone ?? DEFAULT_TONE[trendDirection]) : undefined;
  const toneColor = tone ? TONE_COLOR_VAR[tone] : "var(--icone-secundario)";
  const resolvedTone = tone ?? "neutral";

  return (
    <div className={critical ? styles.criticalWrapper : undefined}>
      <Card padding="medium" elevation={elevation}>
        <div className={styles.content}>
          <div className={icon ? `${styles.header} ${styles.headerWithIcon}` : styles.header}>
            <span className={styles.label}>{label}</span>
            {icon && (
              <span
                className={styles.iconCircle}
                style={{ background: ICON_CIRCLE_BG_VAR[resolvedTone] }}
              >
                <Icon name={icon} size="medium" color={toneColor} decorative />
              </span>
            )}
          </div>
          <div className={styles.valueRow}>
            <span className={styles.value}>{value}</span>
          </div>
          {/* AJUSTADO a pedido do usuário — sem seta/chevron no indicador de
              tendência (o sinal +/- de trendValue já comunica a direção
              sozinho); trendValue e helperText passaram pra MESMA linha
              (trendValue à esquerda, colorido pelo tone; helperText em
              seguida, cinza), no lugar da seta+% grudada no valor e do
              helperText solto embaixo. Seta decorativa à direita (sempre
              cinza, nunca colorida pelo tone — não é indicador de
              tendência, é só o mesmo affordance 'ver mais' das referências
              visuais anexadas pelo usuário) fecha a linha quando há
              trendValue ou helperText pra mostrar. */}
          {(trendDirection && trendValue) || helperText ? (
            <div className={styles.footer}>
              <span className={styles.footerText}>
                {trendDirection && trendValue && (
                  <span className={styles.trend} style={{ color: toneColor }}>
                    {trendValue}
                  </span>
                )}
                {helperText && <span className={styles.helperText}>{helperText}</span>}
              </span>
              <Icon name="arrow-right" size="small" color="var(--icone-secundario)" decorative />
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
