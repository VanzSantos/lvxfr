import styles from "./HelperText.module.css";

export type HelperTextIntent = "default" | "error";

export interface HelperTextProps {
  text: string;
  intent?: HelperTextIntent;
  /** Id do campo associado — o átomo deriva o próprio id como `${fieldId}-message`. */
  fieldId?: string;
}

export function HelperText({ text, intent = "default", fieldId }: HelperTextProps) {
  return (
    <span
      id={fieldId ? `${fieldId}-message` : undefined}
      className={`${styles.helperText} ${intent === "error" ? styles.error : styles.default}`}
    >
      {text}
    </span>
  );
}
