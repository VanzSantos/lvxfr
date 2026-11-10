import { useEffect, useState } from "react";
import { Modal } from "../../components/Modal/Modal";
import { Button } from "../../components/Button/Button";
import styles from "./ContractDialog.module.css";

interface ContractDialogProps {
  open: boolean;
  onClose: () => void;
  fileName: string;
  content: string;
}

/** Diálogo "Ver contrato" — Modal do SeleneSDK; alterna entre 'large' e 'full'
    (tela inteira) pelo botão da barra acima do código. */
export function ContractDialog({ open, onClose, fileName, content }: ContractDialogProps) {
  const [expanded, setExpanded] = useState(false);

  // Sempre reabre no tamanho normal.
  useEffect(() => {
    if (!open) setExpanded(false);
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title={fileName} size={expanded ? "full" : "large"}>
      <div className={styles.content}>
        <div className={styles.toolbar}>
          <Button
            variant="neutral"
            iconOnly
            leftIcon={expanded ? "corners-in" : "corners-out"}
            accessibleLabel={expanded ? "Restaurar tamanho" : "Expandir para tela inteira"}
            onPress={() => setExpanded((value) => !value)}
          />
        </div>
        <pre className={styles.code}>
          <code>{content}</code>
        </pre>
      </div>
    </Modal>
  );
}
