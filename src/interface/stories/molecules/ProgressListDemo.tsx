import { ProgressList } from "../../../components/ProgressList/ProgressList";
import styles from "../Demo.module.css";

export function ProgressListDemo() {
  return (
    <div className={styles.column} style={{ maxWidth: 480 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Prioridade (variantes de severidade)</span>
        <ProgressList
          items={[
            { label: "No prazo", value: 50, count: "50 Qt", variant: "neutral" },
            { label: "Atenção", value: 25, count: "25 Qt", variant: "warning" },
            { label: "Urgente", value: 0, count: "0 Qt", variant: "error" },
            { label: "Atrasado", value: 25, count: "25 Qt", variant: "critical" },
          ]}
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Rede de atendimento (mesmo tom pra todas)</span>
        <ProgressList
          items={[
            { label: "Ambulatorial", value: 40, max: 250, count: "40 Qt", variant: "success" },
            { label: "Internação Eletiva", value: 250, max: 250, count: "250 Qt", variant: "success" },
            { label: "Pronto Socorro", value: 100, max: 250, count: "100 Qt", variant: "success" },
          ]}
        />
      </div>
    </div>
  );
}
