import { useEffect, useRef } from "react";
import styles from "./ContractDialog.module.css";

interface ContractDialogProps {
  open: boolean;
  onClose: () => void;
  fileName: string;
  content: string;
}

export function ContractDialog({ open, onClose, fileName, content }: ContractDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

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
      className={styles.dialog}
      onClose={onClose}
      onClick={(event) => {
        // clique no ::backdrop nativo dispara com target = o próprio <dialog>
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className={styles.header}>
        <code className={styles.fileName}>{fileName}</code>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fechar">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <pre className={styles.code}>
        <code>{content}</code>
      </pre>
    </dialog>
  );
}
