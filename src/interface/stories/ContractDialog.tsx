import { useEffect, useRef, useState } from "react";
import { Icon } from "../../components/Icon/Icon";
import styles from "./ContractDialog.module.css";

interface ContractDialogProps {
  open: boolean;
  onClose: () => void;
  fileName: string;
  content: string;
}

export function ContractDialog({ open, onClose, fileName, content }: ContractDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Sempre reabre no tamanho normal.
  useEffect(() => {
    if (!open) setExpanded(false);
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.dialog} ${expanded ? styles.dialogExpanded : ""}`}
      onClose={onClose}
      onClick={(event) => {
        // clique no ::backdrop nativo dispara com target = o próprio <dialog>
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className={styles.header}>
        <code className={styles.fileName}>{fileName}</code>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setExpanded((value) => !value)}
            aria-label={expanded ? "Restaurar tamanho" : "Expandir para tela inteira"}
            aria-pressed={expanded}
          >
            <Icon name={expanded ? "corners-in" : "corners-out"} size="small" color="var(--texto-secundario)" decorative />
          </button>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fechar">
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
      <pre className={styles.code}>
        <code>{content}</code>
      </pre>
    </dialog>
  );
}
