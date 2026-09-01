import { useEffect, useRef } from "react";
import { Icon, type IconName } from "../Icon/Icon";
import styles from "./Toast.module.css";

export type ToastIntent = "info" | "success" | "warning" | "error";

export interface ToastProps {
  intent?: ToastIntent;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
  onDismiss: () => void;
}

const INTENT_ICON: Record<ToastIntent, IconName> = {
  info: "info",
  success: "check-circle",
  warning: "warning-circle",
  error: "x-circle",
};

export function Toast({
  intent = "info",
  message,
  actionLabel,
  onAction,
  duration = 5000,
  onDismiss,
}: ToastProps) {
  const remainingRef = useRef(duration);
  const startedAtRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const start = () => {
    if (duration <= 0) return;
    startedAtRef.current = Date.now();
    timeoutRef.current = setTimeout(onDismiss, remainingRef.current);
  };

  const pause = () => {
    if (duration <= 0 || !startedAtRef.current) return;
    clear();
    remainingRef.current -= Date.now() - startedAtRef.current;
    startedAtRef.current = null;
  };

  const resume = () => {
    if (duration <= 0) return;
    start();
  };

  useEffect(() => {
    start();
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const role = intent === "error" || intent === "warning" ? "alert" : "status";
  // fundo é sólido/escuro em todas as variantes (ver Toast.module.css) — ícone e botão de
  // fechar acompanham a MESMA cor de texto que .message/.action já usam por intent: branco
  // pras 3 saturadas o bastante pra continuar escuras em qualquer tema (info/success/error),
  // escuro-fixo pro warning (fundo-aviso-forte continua um amarelo claro em qualquer tema).
  const iconColor = intent === "warning" ? "var(--texto-escuro-fixo)" : "var(--texto-invertido)";

  return (
    <div
      className={`${styles.toast} ${styles[intent]}`}
      role={role}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <Icon name={INTENT_ICON[intent]} size="medium" color={iconColor} />
      <div className={styles.content}>
        <span className={styles.message}>{message}</span>
        {actionLabel && onAction && (
          <button type="button" className={styles.action} onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
      <button
        type="button"
        className={styles.dismissButton}
        onClick={onDismiss}
        aria-label="Fechar"
      >
        <Icon name="x" size="small" color={iconColor} />
      </button>
    </div>
  );
}
