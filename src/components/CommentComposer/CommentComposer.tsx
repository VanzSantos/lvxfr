import { Textarea } from "../Textarea/Textarea";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import styles from "./CommentComposer.module.css";

export type CommentComposerLimitMode = "block" | "warn";

export interface CommentComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  submitLabel?: string;
  onAttachImage?: () => void;
  onMarkImportant?: () => void;
  disabled?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  limitMode?: CommentComposerLimitMode;
}

export function CommentComposer({
  value,
  onChange,
  onSubmit,
  placeholder = "Insira sua nota aqui...",
  submitLabel = "Publicar",
  onAttachImage,
  onMarkImportant,
  disabled = false,
  maxLength,
  showCharacterCount = false,
  limitMode = "block",
}: CommentComposerProps) {
  const overLimit = limitMode === "warn" && maxLength !== undefined && value.length > maxLength;
  const canSubmit = value.trim().length > 0 && !disabled && !overLimit;

  return (
    <div className={styles.composer}>
      <Textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        resizable={false}
        state={disabled ? "disabled" : overLimit ? "error" : "default"}
        maxLength={maxLength}
        enforceMaxLength={limitMode === "block"}
        showCharacterCount={showCharacterCount}
        helperText={overLimit ? `Limite de ${maxLength} caracteres excedido.` : undefined}
      />
      <div className={styles.toolbar}>
        <div className={styles.utilities}>
          {onAttachImage && (
            <button type="button" className={styles.utilityButton} onClick={onAttachImage} disabled={disabled} aria-label="Anexar imagem">
              <Icon name="image" size="small" color="var(--icone-secundario)" decorative />
            </button>
          )}
          {onMarkImportant && (
            <button type="button" className={styles.utilityButton} onClick={onMarkImportant} disabled={disabled} aria-label="Marcar como importante">
              <Icon name="warning-circle" size="small" color="var(--icone-secundario)" decorative />
            </button>
          )}
        </div>
        <Button
          variant="primary"
          label={submitLabel}
          onPress={() => onSubmit(value)}
          state={canSubmit ? "default" : "disabled"}
        />
      </div>
    </div>
  );
}
