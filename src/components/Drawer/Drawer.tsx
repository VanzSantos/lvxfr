import { useEffect, useId, useRef, type ReactNode } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./Drawer.module.css";

export type DrawerSize = "small" | "medium" | "large";
export type DrawerPadding = "small" | "medium" | "large";
export type DrawerRole = "dialog" | "alertdialog";
export type DrawerLayout = "overlay" | "push";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  accessibleLabel?: string;
  children: ReactNode;
  size?: DrawerSize;
  padding?: DrawerPadding;
  dismissible?: boolean;
  modal?: boolean;
  layout?: DrawerLayout;
  role?: DrawerRole;
}

export function Drawer({
  open,
  onClose,
  title,
  accessibleLabel,
  children,
  size = "medium",
  padding = "large",
  dismissible = true,
  modal = true,
  layout = "overlay",
  role = "dialog",
}: DrawerProps) {
  // layout='push' só faz sentido com modal=false — um Drawer que bloqueia a
  // página (modal=true) sempre sobrepõe, nunca participa do layout normal
  // (ver contratos/drawer.contract.json, decisions).
  const effectiveLayout = modal ? "overlay" : layout;
  if (!title && !accessibleLabel) {
    throw new Error("Drawer: accessibleLabel é obrigatório quando title não é fornecido.");
  }

  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const hasHeader = Boolean(title) || dismissible;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      if (modal) {
        dialog.showModal();
      } else {
        dialog.show();
      }
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, modal]);

  // show() (modal=false) não fecha com Esc nativamente — só showModal() dá
  // isso de graça. Reimplementado só nesse caso, pra manter a experiência
  // consistente entre os dois modos (ver contratos/drawer.contract.json,
  // decisions).
  useEffect(() => {
    if (!open || modal || !dismissible) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, modal, dismissible, onClose]);

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.drawer} ${styles[size]} ${effectiveLayout === "push" ? styles.push : ""}`}
      role={role}
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : accessibleLabel}
      onClose={onClose}
      onCancel={(event) => {
        if (!dismissible) event.preventDefault();
      }}
      onClick={(event) => {
        // backdrop só existe de verdade quando modal=true (showModal()) —
        // com modal=false o clique nunca vai ter target === o próprio
        // <dialog> porque não existe ::backdrop nativo cobrindo a página.
        if (dismissible && modal && event.target === dialogRef.current) onClose();
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
