import { Icon } from "../Icon/Icon";
import styles from "./PasswordStrengthMeter.module.css";

export type PasswordStrengthLevel = "empty" | "weak" | "fair" | "good" | "strong";

export interface PasswordStrengthMeterProps {
  value: string;
  accessibleLabel?: string;
  showRequirements?: boolean;
}

const LEVEL_LABEL: Record<PasswordStrengthLevel, string> = {
  empty: "",
  weak: "Fraca",
  fair: "Média",
  good: "Forte",
  strong: "Muito forte",
};

const LEVEL_COLOR_VAR: Record<PasswordStrengthLevel, string> = {
  empty: "var(--borda-base)",
  weak: "var(--acao-destrutiva)",
  fair: "var(--borda-aviso)",
  good: "var(--borda-info)",
  strong: "var(--borda-sucesso)",
};

const LEVEL_TEXT_COLOR_VAR: Record<PasswordStrengthLevel, string> = {
  empty: "var(--texto-secundario)",
  weak: "var(--texto-erro)",
  fair: "var(--texto-aviso)",
  good: "var(--texto-info)",
  strong: "var(--texto-sucesso)",
};

interface Requirement {
  key: string;
  label: string;
  met: boolean;
}

function requirementsOf(value: string): Requirement[] {
  return [
    { key: "length", label: "Mínimo de 8 caracteres", met: value.length >= 8 },
    { key: "uppercase", label: "Uma letra maiúscula", met: /[A-Z]/.test(value) },
    { key: "lowercase", label: "Uma letra minúscula", met: /[a-z]/.test(value) },
    { key: "number", label: "Um número", met: /\d/.test(value) },
    { key: "special", label: "Um caractere especial", met: /[^a-zA-Z0-9]/.test(value) },
  ];
}

function levelOf(score: number): PasswordStrengthLevel {
  if (score === 0) return "empty";
  if (score <= 2) return "weak";
  if (score === 3) return "fair";
  if (score === 4) return "good";
  return "strong";
}

export function PasswordStrengthMeter({ value, accessibleLabel = "Força da senha", showRequirements = true }: PasswordStrengthMeterProps) {
  const requirements = requirementsOf(value);
  const score = value.length === 0 ? 0 : requirements.filter((r) => r.met).length;
  const level = levelOf(score);
  const filledSegments = level === "empty" ? 0 : Math.min(4, score);
  const color = LEVEL_COLOR_VAR[level];

  return (
    <div className={styles.field}>
      <div className={styles.segments} aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <span
            key={index}
            className={styles.segment}
            style={{ background: index < filledSegments ? color : "var(--borda-base)" }}
          />
        ))}
      </div>
      <span className={styles.label} role="status" aria-live="polite" style={{ color: LEVEL_TEXT_COLOR_VAR[level] }}>
        {level !== "empty" && `${accessibleLabel}: ${LEVEL_LABEL[level]}`}
      </span>

      {showRequirements && (
        <ul className={styles.requirements}>
          {requirements.map((requirement) => (
            <li key={requirement.key} className={styles.requirement}>
              <Icon
                name={requirement.met ? "check" : "x"}
                size="small"
                color={requirement.met ? "var(--icone-sucesso)" : "var(--icone-inativo)"}
                decorative
              />
              <span className={requirement.met ? styles.requirementMet : styles.requirementPending}>
                {requirement.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
