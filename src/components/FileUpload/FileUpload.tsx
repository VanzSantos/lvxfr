import { useId, useRef, useState } from "react";
import { FieldLabel } from "../FieldLabel/FieldLabel";
import { HelperText } from "../HelperText/HelperText";
import { Icon } from "../Icon/Icon";
import { Button, type ButtonVariant } from "../Button/Button";
import { Chip } from "../Chip/Chip";
import styles from "./FileUpload.module.css";

export type FileUploadVariant = "field" | "button" | "dropzone";
export type FileUploadState = "default" | "error" | "disabled";

export interface FileUploadRejection {
  file: File;
  reason: "type" | "size";
}

export interface FileUploadProps {
  variant?: FileUploadVariant;
  value: File[];
  onChange: (files: File[]) => void;
  onReject?: (rejected: FileUploadRejection[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  required?: boolean;
  helperText?: string;
  state?: FileUploadState;
  buttonLabel?: string;
  dropzoneLabel?: string;
  accessibleLabel?: string;
  /** Só variant='button'. Repassado direto pro variant do Button interno —
      default 'neutral' preserva o visual original (o único que existia até
      aqui). Ver decisions no contrato pra quando usar algo diferente. */
  buttonVariant?: ButtonVariant;
  /** Só variant='button'. Repassado direto pro outlined do Button interno —
      default true preserva o visual original. */
  buttonOutlined?: boolean;
}

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const patterns = accept.split(",").map((p) => p.trim().toLowerCase());
  return patterns.some((pattern) => {
    if (pattern.startsWith(".")) return file.name.toLowerCase().endsWith(pattern);
    if (pattern.endsWith("/*")) return file.type.startsWith(pattern.slice(0, -1));
    return file.type.toLowerCase() === pattern;
  });
}

export function FileUpload({
  variant = "dropzone",
  value,
  onChange,
  onReject,
  multiple = false,
  accept,
  maxSizeMB,
  label,
  required = false,
  helperText,
  state = "default",
  buttonLabel = "Selecionar arquivo",
  dropzoneLabel = "Arraste um arquivo aqui ou clique para selecionar",
  accessibleLabel = "Enviar arquivo",
  buttonVariant = "neutral",
  buttonOutlined = true,
}: FileUploadProps) {
  const fieldId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const disabled = state === "disabled";
  const error = state === "error";
  const [dragOver, setDragOver] = useState(false);

  function validate(files: File[]): { accepted: File[]; rejected: FileUploadRejection[] } {
    const accepted: File[] = [];
    const rejected: FileUploadRejection[] = [];
    for (const file of files) {
      if (!matchesAccept(file, accept)) {
        rejected.push({ file, reason: "type" });
      } else if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
        rejected.push({ file, reason: "size" });
      } else {
        accepted.push(file);
      }
    }
    return { accepted, rejected };
  }

  function applyFiles(incoming: File[]) {
    if (disabled) return;
    const { accepted, rejected } = validate(incoming);
    if (rejected.length > 0) onReject?.(rejected);
    if (accepted.length === 0) return;
    onChange(multiple ? [...value, ...accepted] : accepted.slice(0, 1));
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    applyFiles(files);
    event.target.value = "";
  }

  function openPicker() {
    if (disabled) return;
    inputRef.current?.click();
  }

  function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragOver(false);
    if (disabled) return;
    applyFiles(Array.from(event.dataTransfer.files));
  }

  function removeFile(index: number) {
    if (disabled) return;
    onChange(value.filter((_, i) => i !== index));
  }

  const fileList = value.length > 0 && (
    <div className={styles.chips}>
      {value.map((file, index) => (
        <Chip key={`${file.name}-${index}`} label={file.name} removable onRemove={() => removeFile(index)} disabled={disabled} />
      ))}
    </div>
  );

  const hiddenInput = (
    <input
      ref={inputRef}
      id={variant === "field" ? fieldId : undefined}
      type="file"
      className={styles.hiddenInput}
      multiple={multiple}
      accept={accept}
      disabled={disabled}
      aria-label={variant === "field" ? undefined : accessibleLabel}
      aria-describedby={helperText ? `${fieldId}-message` : undefined}
      onChange={handleInputChange}
    />
  );

  if (variant === "field") {
    return (
      <div className={styles.field}>
        {label && <FieldLabel text={label} required={required} fieldId={fieldId} />}
        {hiddenInput}
        <div className={`${styles.fieldRow} ${styles[state]}`}>
          <div className={styles.fieldContent}>
            {value.length > 0 ? (
              fileList
            ) : (
              <span className={styles.placeholder}>Nenhum arquivo selecionado</span>
            )}
          </div>
          <Button variant="neutral" outlined label={buttonLabel} onPress={openPicker} state={disabled ? "disabled" : "default"} />
        </div>
        {helperText && <HelperText text={helperText} intent={error ? "error" : "default"} fieldId={fieldId} />}
      </div>
    );
  }

  if (variant === "button") {
    return (
      <div className={styles.field}>
        {hiddenInput}
        <Button
          variant={buttonVariant}
          outlined={buttonVariant === "link" ? undefined : buttonOutlined}
          leftIcon="upload-simple"
          label={buttonLabel}
          onPress={openPicker}
          state={disabled ? "disabled" : "default"}
        />
        {fileList}
        {helperText && <HelperText text={helperText} intent={error ? "error" : "default"} fieldId={fieldId} />}
      </div>
    );
  }

  return (
    <div className={styles.field}>
      {hiddenInput}
      <button
        type="button"
        className={`${styles.dropzone} ${styles[state]} ${dragOver ? styles.dragOver : ""}`}
        disabled={disabled}
        onClick={openPicker}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <Icon name="upload-simple" size="large" color={disabled ? "var(--icone-inativo)" : "var(--icone-secundario)"} decorative />
        <span className={styles.dropzoneText}>{dropzoneLabel}</span>
      </button>
      {fileList}
      {helperText && <HelperText text={helperText} intent={error ? "error" : "default"} fieldId={fieldId} />}
    </div>
  );
}
