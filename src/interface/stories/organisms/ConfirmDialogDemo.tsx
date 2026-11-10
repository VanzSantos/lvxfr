import { useState } from "react";
import { ConfirmDialog } from "../../../components/ConfirmDialog/ConfirmDialog";
import { Button } from "../../../components/Button/Button";
import styles from "../Demo.module.css";

export function ConfirmDialogDemo() {
  const [openDestrutivo, setOpenDestrutivo] = useState(false);
  const [openPrimario, setOpenPrimario] = useState(false);
  const [openRotulosLongos, setOpenRotulosLongos] = useState(false);
  const [confirming, setConfirming] = useState(false);

  function handleConfirmDestrutivo() {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      setOpenDestrutivo(false);
    }, 1500);
  }

  return (
    <div className={styles.row}>
      <Button variant="destructive" label="Excluir conta" onPress={() => setOpenDestrutivo(true)} />
      <Button variant="primary" label="Salvar alterações" onPress={() => setOpenPrimario(true)} />
      <Button variant="secondary" label="Rótulos longos (bug OCR)" onPress={() => setOpenRotulosLongos(true)} />

      <ConfirmDialog
        open={openDestrutivo}
        onCancel={() => setOpenDestrutivo(false)}
        onConfirm={handleConfirmDestrutivo}
        title="Excluir conta?"
        description="Esta ação não pode ser desfeita. Todos os seus dados serão removidos permanentemente."
        confirmLabel="Excluir"
        confirmVariant="destructive"
        confirmState={confirming ? "loading" : "default"}
      />

      <ConfirmDialog
        open={openPrimario}
        onCancel={() => setOpenPrimario(false)}
        onConfirm={() => setOpenPrimario(false)}
        title="Salvar alterações?"
        description="As alterações feitas neste formulário serão salvas."
      />

      <ConfirmDialog
        open={openRotulosLongos}
        onCancel={() => setOpenRotulosLongos(false)}
        onConfirm={() => setOpenRotulosLongos(false)}
        title="Dados incompletos na extração"
        description="Alguns campos não puderam ser confirmados automaticamente. Revise antes de continuar."
        cancelLabel="Voltar e preencher"
        confirmLabel="Enviar mesmo assim"
      />
    </div>
  );
}
