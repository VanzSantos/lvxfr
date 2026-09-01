import { Icon } from "../Icon/Icon";
import { Tooltip } from "../Tooltip/Tooltip";
import styles from "./FieldLabel.module.css";

export interface FieldLabelProps {
  text: string;
  required?: boolean;
  withInfo?: boolean;
  infoText?: string;
  fieldId?: string;
}

export function FieldLabel({
  text,
  required = false,
  withInfo = false,
  infoText,
  fieldId,
}: FieldLabelProps) {
  if (withInfo && !infoText) {
    throw new Error(`FieldLabel "${text}": infoText é obrigatório quando withInfo=true.`);
  }

  return (
    <span className={styles.wrapper}>
      <label htmlFor={fieldId} className={styles.label}>
        {text}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {withInfo && infoText && (
        <Tooltip text={infoText} placement="top">
          <span
            tabIndex={0}
            role="button"
            aria-label={`Mais informações sobre ${text}`}
            className={styles.infoTrigger}
          >
            <Icon name="info" size="small" color="var(--icone-secundario)" />
          </span>
        </Tooltip>
      )}
    </span>
  );
}
