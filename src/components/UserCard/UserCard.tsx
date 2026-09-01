import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Avatar } from "../Avatar/Avatar";
import { StackedText } from "../StackedText/StackedText";
import { Icon } from "../Icon/Icon";
import styles from "./UserCard.module.css";

export type UserCardCaretDirection = "up" | "down";

export interface UserCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  name: string;
  secondaryText: string;
  avatarSrc?: string;
  accessibleLabel?: string;
  /** 'up' (padrão) = o menu que este cartão aciona abre PRA CIMA (Popover no
      rodapé de um painel, ver decisions) — cobre os dois consumidores
      originais. 'down' = o menu abre PRA BAIXO — segundo consumidor real
      (BackofficeTemplate, rodapé mobile: User Card no TOPO do Drawer, menu
      expande como collapse inline logo abaixo, não Popover). O consumidor
      decide a direção; UserCard não sabe nada sobre O QUE abre por baixo/
      cima do cartão (Popover, collapse inline, ou qualquer outra coisa). */
  caretDirection?: UserCardCaretDirection;
}

/** Gatilho de identificação do usuário (Avatar + nome/e-mail + caret) — pensado
    pro rodapé do SideNav, mas é só o CARTÃO em si, sem popover/menu embutido:
    o consumidor decide o que abre, envolvendo o UserCard com Popover (mesmo
    padrão de qualquer outro gatilho de Popover no harness — ver
    contratos/user-card.contract.json). Usa forwardRef porque Popover precisa
    de acesso ao nó DOM real do gatilho (cloneElement + ref), primeiro
    consumo real desse padrão no harness com um componente customizado (até
    aqui só elementos nativos como <button> eram usados como children direto
    do Popover). */
export const UserCard = forwardRef<HTMLButtonElement, UserCardProps>(function UserCard(
  { name, secondaryText, avatarSrc, accessibleLabel, caretDirection = "up", className, ...rest },
  ref
) {
  return (
    <button
      type="button"
      ref={ref}
      className={className ? `${styles.card} ${className}` : styles.card}
      aria-label={accessibleLabel}
      {...rest}
    >
      <span className={styles.identity}>
        <Avatar name={name} src={avatarSrc} size="small" />
        <StackedText primaryText={name} secondaryText={secondaryText} />
      </span>
      <Icon name={caretDirection === "down" ? "caret-down" : "caret-up"} size="small" color="var(--icone-secundario)" decorative />
    </button>
  );
});
