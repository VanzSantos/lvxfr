import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Toast, type ToastIntent } from "./Toast";
import styles from "./ToastProvider.module.css";

export interface ToastOptions {
  intent?: ToastIntent;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_VISIBLE = 3;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setQueue((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = crypto.randomUUID();
    setQueue((current) => [...current, { ...options, id }]);
    return id;
  }, []);

  const visible = queue.slice(0, MAX_VISIBLE);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {createPortal(
        <div className={styles.container}>
          {visible.map((item) => (
            <Toast
              key={item.id}
              intent={item.intent}
              message={item.message}
              actionLabel={item.actionLabel}
              onAction={item.onAction}
              duration={item.duration}
              onDismiss={() => dismiss(item.id)}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast: precisa estar dentro de um <ToastProvider>.");
  }
  return ctx;
}
