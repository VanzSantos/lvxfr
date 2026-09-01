import { Modal } from "../Modal/Modal";
import { Button } from "../Button/Button";
import styles from "./ConfirmDialog.module.css";

export type ConfirmDialogVariant = "primary" | "destructive";
export type ConfirmDialogConfirmState = "default" | "loading";

export interface ConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ConfirmDialogVariant;
  confirmState?: ConfirmDialogConfirmState;
}

export function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmVariant = "primary",
  confirmState = "default",
}: ConfirmDialogProps) {
  const loading = confirmState === "loading";

  return (
    <Modal open={open} onClose={onCancel} title={title} size="small" dismissible={!loading}>
      <div className={styles.body}>
        <p className={styles.description}>{description}</p>
        <div className={styles.actions}>
          <Button variant="neutral" outlined label={cancelLabel} onPress={onCancel} state={loading ? "disabled" : "default"} />
          <Button
            variant={confirmVariant}
            label={confirmLabel}
            onPress={onConfirm}
            state={loading ? "loading" : "default"}
          />
        </div>
      </div>
    </Modal>
  );
}
