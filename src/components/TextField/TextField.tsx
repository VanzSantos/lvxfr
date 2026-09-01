import { useId, useState } from "react";
import { FieldLabel } from "../FieldLabel/FieldLabel";
import { HelperText } from "../HelperText/HelperText";
import { Icon, type IconName } from "../Icon/Icon";
import { maskPhoneDigits } from "../shared/phoneMask";
import { maskCpfDigits } from "../shared/cpfMask";
import styles from "./TextField.module.css";

export type TextFieldState = "default" | "focus" | "error" | "disabled" | "readOnly";

export interface TextFieldProps {
  label?: string;
  required?: boolean;
  withInfo?: boolean;
  infoText?: string;
  placeholder?: string;
  value?: string;
  state?: TextFieldState;
  helperText?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onChange?: (value: string) => void;
  type?: "text" | "password" | "email" | "tel" | "number" | "url" | "cpf";
  name?: string;
  autoComplete?: string;
  /**
   * Só se aplica com type="tel". Mostra o prefixo fixo "+55" (DDI) à
   * esquerda do campo, antes do número mascarado. Ver decisions.
   */
  showCountryCode?: boolean;
}

export function TextField({
  label,
  required = false,
  withInfo = false,
  infoText,
  placeholder,
  value,
  state = "default",
  helperText,
  leftIcon,
  rightIcon,
  onChange,
  type = "text",
  name,
  autoComplete,
  showCountryCode = false,
}: TextFieldProps) {
  const fieldId = useId();
  const disabled = state === "disabled";
  const readOnly = state === "readOnly";
  const error = state === "error";
  const iconColor = disabled ? "var(--icone-inativo)" : "var(--icone-secundario)";

  // Também fora do contrato original: rightIcon lá é só decorativo (Icon
  // nunca é clicável por si, forbidden do contratos/icon.contract.json).
  // Para type="password" precisamos de uma ação real de mostrar/ocultar,
  // então o slot direito vira um <button> que ENVOLVE o Icon decorativo —
  // mesmo padrão já usado no gatilho de info do FieldLabel. Quando
  // type="password", esse toggle sempre tem prioridade sobre um rightIcon
  // manual (sinalizado no self-audit).
  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);
  const effectiveType = isPassword ? (revealed ? "text" : "password") : type === "cpf" ? "text" : type;

  const isPhone = type === "tel";
  const isCpf = type === "cpf";
  const showDdi = isPhone && showCountryCode;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (isPhone) {
      onChange?.(maskPhoneDigits(event.target.value));
    } else if (isCpf) {
      onChange?.(maskCpfDigits(event.target.value));
    } else {
      onChange?.(event.target.value);
    }
  }

  return (
    <div className={styles.field}>
      {label && (
        <FieldLabel
          text={label}
          required={required}
          withInfo={withInfo}
          infoText={infoText}
          fieldId={fieldId}
        />
      )}
      <div
        className={`${styles.container} ${styles[state]}`}
        data-state={state}
      >
        {leftIcon && (
          <Icon name={leftIcon} size="medium" color={iconColor} />
        )}
        {showDdi && (
          <span className={styles.ddi} aria-hidden="true">+55</span>
        )}
        <input
          id={fieldId}
          className={styles.input}
          type={effectiveType}
          inputMode={isPhone || isCpf ? "numeric" : undefined}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-required={required || undefined}
          aria-invalid={error || undefined}
          aria-describedby={helperText ? `${fieldId}-message` : undefined}
          name={name}
          autoComplete={autoComplete}
        />
        {isPassword ? (
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => setRevealed((prev) => !prev)}
            disabled={disabled}
            aria-label={revealed ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={revealed}
          >
            <Icon name={revealed ? "eye-slash" : "eye"} size="medium" color={iconColor} />
          </button>
        ) : (
          rightIcon && <Icon name={rightIcon} size="medium" color={iconColor} />
        )}
      </div>
      {helperText && (
        <HelperText text={helperText} intent={error ? "error" : "default"} fieldId={fieldId} />
      )}
    </div>
  );
}
