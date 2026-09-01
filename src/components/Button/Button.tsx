import { Icon, type IconName } from "../Icon/Icon";
import { Spinner } from "../Spinner/Spinner";
import styles from "./Button.module.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "neutral"
  | "subtle"
  | "destructive"
  | "link";
export type ButtonState = "default" | "hover" | "pressed" | "disabled" | "loading";

export interface ButtonProps {
  variant?: ButtonVariant;
  outlined?: boolean;
  state?: ButtonState;
  showLabel?: boolean;
  label?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  iconOnly?: boolean;
  fullWidth?: boolean;
  accessibleLabel?: string;
  onPress?: () => void;
  type?: "button" | "submit";
}

export function Button({
  variant = "primary",
  outlined = false,
  state = "default",
  showLabel = true,
  label,
  leftIcon,
  rightIcon,
  iconOnly = false,
  fullWidth = false,
  accessibleLabel,
  onPress,
  type = "button",
}: ButtonProps) {
  if (iconOnly && !accessibleLabel) {
    throw new Error("Button: accessibleLabel é obrigatório quando iconOnly=true.");
  }
  if (outlined && variant === "subtle") {
    throw new Error(
      "Button: outlined=true com variant=\"subtle\" não é suportado — o único tom da família " +
        "'sutil' legível o bastante pra contornado (texto-secundario, 7.56:1 contra branco) fica " +
        "a só 2.35:1 do neutral outlined, abaixo do mínimo de distinção de UI (3:1). Use " +
        "variant=\"neutral\" outlined."
    );
  }

  const disabled = state === "disabled";
  const loading = state === "loading";
  // --btn-text já resolve a cor certa pro estado atual (preenchido vs outlined) —
  // a fórmula fixa acao-{variant}-texto usada antes ignorava outlined=true e
  // pintava o ícone com a cor de texto-sobre-preenchido (branco) num fundo
  // transparente, ficando invisível. Bug real encontrado testando os botões
  // iconOnly outlined de paginação do Datatable no navegador.
  const textColorVar = disabled ? "var(--acao-inativa-texto)" : "var(--btn-text)";

  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${outlined ? styles.outlined : ""} ${
        fullWidth ? styles.fullWidth : ""
      } ${loading ? styles.loading : ""}`}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-label={iconOnly ? accessibleLabel : undefined}
      onClick={() => !disabled && !loading && onPress?.()}
    >
      {loading ? (
        // decorative=true: o <button> já expõe aria-busy, então o Spinner não
        // precisa de role="status" próprio (evitaria anunciar duas vezes).
        <Spinner size="medium" color="var(--acao-carregando-texto)" />
      ) : (
        <>
          {leftIcon && <Icon name={leftIcon} size="medium" color={textColorVar} />}
          {showLabel && label && <span className={styles.label}>{label}</span>}
          {rightIcon && <Icon name={rightIcon} size="medium" color={textColorVar} />}
        </>
      )}
    </button>
  );
}
