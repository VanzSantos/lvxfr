import { ToastProvider, useToast } from "../../../components/Toast/ToastProvider";
import styles from "../Demo.module.css";

function ToastTriggers() {
  const { toast } = useToast();

  return (
    <div className={styles.column} style={{ maxWidth: 440 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Os 4 intents</span>
        <div className={styles.row}>
          <button
            type="button"
            className={styles.trigger}
            onClick={() => toast({ intent: "info", message: "Sua sessão expira em 5 minutos." })}
          >
            info
          </button>
          <button
            type="button"
            className={styles.trigger}
            onClick={() => toast({ intent: "success", message: "Item salvo com sucesso." })}
          >
            success
          </button>
          <button
            type="button"
            className={styles.trigger}
            onClick={() => toast({ intent: "warning", message: "Sua senha expira em 3 dias." })}
          >
            warning
          </button>
          <button
            type="button"
            className={styles.trigger}
            onClick={() => toast({ intent: "error", message: "Falha ao salvar." })}
          >
            error
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Com ação secundária</span>
        <button
          type="button"
          className={styles.trigger}
          onClick={() =>
            toast({
              intent: "success",
              message: "Item excluído.",
              actionLabel: "Desfazer",
              onAction: () => toast({ intent: "info", message: "Exclusão desfeita." }),
            })
          }
        >
          Excluir item (com Desfazer)
        </button>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Fila (máx. 3 visíveis — dispara 5 de uma vez)</span>
        <button
          type="button"
          className={styles.trigger}
          onClick={() => {
            for (let i = 1; i <= 5; i++) {
              toast({ intent: "info", message: `Notificação ${i} de 5` });
            }
          }}
        >
          Disparar 5 toasts
        </button>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Sem auto-dispensa (duration=0)</span>
        <button
          type="button"
          className={styles.trigger}
          onClick={() =>
            toast({ intent: "warning", message: "Fica até fechar manualmente.", duration: 0 })
          }
        >
          Disparar persistente
        </button>
      </div>
    </div>
  );
}

export function ToastDemo() {
  return (
    <ToastProvider>
      <ToastTriggers />
    </ToastProvider>
  );
}
