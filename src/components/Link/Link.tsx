import { Icon, type IconName } from "../Icon/Icon";
import styles from "./Link.module.css";

export type LinkState = "default" | "disabled";

export interface LinkProps {
  href: string;
  label: string;
  external?: boolean;
  underline?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  state?: LinkState;
  onPress?: () => void;
  current?: boolean;
}

export function Link({
  href,
  label,
  external = false,
  underline = false,
  leftIcon,
  rightIcon,
  state = "default",
  onPress,
  current = false,
}: LinkProps) {
  const disabled = state === "disabled";
  // <a> não tem atributo disabled nativo — sem href, o elemento já não é
  // focável nem clicável nativamente, mesmo efeito prático de "sair da
  // tabulação" que o Button disabled tem, só que pela ausência do próprio
  // atributo que torna a âncora interativa (contratos/link.contract.json).
  const effectiveHref = disabled ? undefined : href;
  // Cor sempre explícita, nunca currentColor implícito — mesma regra do
  // Icon/Button. Fica no tom base (não acompanha o :hover do texto, que é
  // puro CSS) — mesmo comportamento já estabelecido no Button, onde o ícone
  // também não anima cor no hover, só o texto via CSS color.
  const iconColor = disabled
    ? "var(--texto-inativo)"
    : current
      ? "var(--acao-link-texto-sobreposto)"
      : "var(--acao-link-texto)";

  return (
    <a
      href={effectiveHref}
      className={`${styles.link} ${underline ? styles.underline : ""} ${disabled ? styles.disabled : ""} ${current ? styles.current : ""}`}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-disabled={disabled || undefined}
      aria-current={current ? "page" : undefined}
      onClick={() => !disabled && onPress?.()}
    >
      {leftIcon && <Icon name={leftIcon} size="small" color={iconColor} />}
      <span>{label}</span>
      {external ? (
        <>
          <Icon name="arrow-square-out" size="small" color={iconColor} />
          <span className={styles.visuallyHidden}>(abre em nova aba)</span>
        </>
      ) : (
        rightIcon && <Icon name={rightIcon} size="small" color={iconColor} />
      )}
    </a>
  );
}
