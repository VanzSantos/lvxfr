import { useEffect, useRef, useState } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./CopyButton.module.css";

export type CopyButtonState = "default" | "disabled";

export interface CopyButtonProps {
  value: string;
  accessibleLabel?: string;
  onCopy?: () => void;
  state?: CopyButtonState;
}

export function CopyButton({ value, accessibleLabel = "Copiar", onCopy, state = "default" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const disabled = state === "disabled";
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleClick() {
    if (disabled) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(true);
    onCopy?.();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      className={styles.button}
      disabled={disabled}
      aria-label={copied ? "Copiado!" : accessibleLabel}
      onClick={handleClick}
    >
      <Icon
        name={copied ? "check" : "copy-simple"}
        size="small"
        color={disabled ? "var(--icone-inativo)" : copied ? "var(--icone-sucesso)" : "var(--icone-secundario)"}
        decorative
      />
    </button>
  );
}
