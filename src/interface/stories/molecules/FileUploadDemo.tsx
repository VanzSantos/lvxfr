import { useState } from "react";
import { FileUpload, type FileUploadRejection } from "../../../components/FileUpload/FileUpload";
import styles from "../Demo.module.css";

export function FileUploadDemo() {
  const [arquivoField, setArquivoField] = useState<File[]>([]);
  const [arquivosButton, setArquivosButton] = useState<File[]>([]);
  const [arquivosDropzone, setArquivosDropzone] = useState<File[]>([]);
  const [rejeitados, setRejeitados] = useState<FileUploadRejection[]>([]);

  return (
    <div className={styles.column} style={{ maxWidth: 480 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>variant="field"</span>
        <FileUpload
          variant="field"
          label="Comprovante de endereço"
          value={arquivoField}
          onChange={setArquivoField}
          helperText="PDF ou imagem, até 5MB."
          accept=".pdf,image/*"
          maxSizeMB={5}
          onReject={setRejeitados}
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>variant="button" (multiple)</span>
        <FileUpload variant="button" value={arquivosButton} onChange={setArquivosButton} multiple buttonLabel="Anexar arquivos" />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>variant="button" — buttonVariant="link" (sem fundo/borda) + required</span>
        <FileUpload
          variant="button"
          value={[]}
          onChange={() => {}}
          buttonLabel="Enviar sua foto"
          buttonVariant="link"
          buttonOutlined={false}
          required
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>variant="dropzone" (multiple, arraste ou clique)</span>
        <FileUpload
          variant="dropzone"
          value={arquivosDropzone}
          onChange={setArquivosDropzone}
          multiple
          onReject={setRejeitados}
          dropzoneLabel="Arraste uma planilha aqui ou clique para importar"
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>state="error" / state="disabled"</span>
        <div className={styles.row} style={{ alignItems: "flex-start", gap: 16 }}>
          <FileUpload variant="field" label="Documento" value={[]} onChange={() => {}} state="error" helperText="Arquivo obrigatório." />
          <FileUpload variant="field" label="Documento" value={[]} onChange={() => {}} state="disabled" helperText="Bloqueado nesta etapa." />
        </div>
      </div>

      {rejeitados.length > 0 && (
        <p style={{ fontSize: 13, color: "var(--texto-erro)" }}>
          Rejeitados: {rejeitados.map((r) => `${r.file.name} (${r.reason})`).join(", ")}
        </p>
      )}
    </div>
  );
}
