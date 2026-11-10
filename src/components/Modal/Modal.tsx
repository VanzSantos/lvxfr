import { useEffect, useId, useRef, type ReactNode } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./Modal.module.css";

export type ModalSize = "small" | "medium" | "large";
export type ModalPadding = "small" | "medium" | "large";
export type ModalRole = "dialog" | "alertdialog";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  accessibleLabel?: string;
  children: ReactNode;
  size?: ModalSize;
  padding?: ModalPadding;
  dismissible?: boolean;
  role?: ModalRole;
}

export function Modal({
  open,
  onClose,
  title,
  accessibleLabel,
  children,
  size = "medium",
  padding = "large",
  dismissible = true,
  role = "dialog",
}: ModalProps) {
  if (!title && !accessibleLabel) {
    throw new Error("Modal: accessibleLabel é obrigatório quando title não é fornecido.");
  }

  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const hasHeader = Boolean(title) || dismissible;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.dialog} ${styles[size]}`}
      role={role}
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : accessibleLabel}
      onClose={onClose}
      onCancel={(event) => {
        // "cancel" dispara ANTES de fechar (ex.: tecla Esc) — bloquear aqui
        // impede o fechamento, diferente de tentar reabrir depois de já ter
        // fechado.
        if (!dismissible) event.preventDefault();
      }}
      onClick={(event) => {
        // clique no ::backdrop nativo dispara com target = o próprio <dialog>
        // (não existe evento dedicado de "clique fora") — mesmo padrão já
        // usado no ContractDialog interno do Playground.
        if (dismissible && event.target === dialogRef.current) onClose();
      }}
    >
      <div className={`${styles.content} ${styles[`padding-${padding}`]}`}>
        {hasHeader && (
          <div className={styles.header}>
            {title && (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            )}
            {dismissible && (
              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Fechar"
              >
                <Icon name="x" size="small" color="var(--texto-secundario)" />
              </button>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </dialog>
  );
}
