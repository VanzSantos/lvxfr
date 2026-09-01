import { useEffect, useState } from "react";
import { ProgressBar } from "../../../components/ProgressBar/ProgressBar";
import styles from "../Demo.module.css";

export function ProgressBarDemo() {
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgresso((p) => (p >= 100 ? 0 : p + 7));
    }, 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.column} style={{ maxWidth: 440 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Estático (com showValue)</span>
        <ProgressBar value={25} accessibleLabel="Progresso de exemplo" showValue />
        <ProgressBar value={70} accessibleLabel="Progresso de exemplo" showValue />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Variantes (concluído / falhou)</span>
        <ProgressBar value={100} variant="success" accessibleLabel="Envio concluído" showValue />
        <ProgressBar value={35} variant="error" accessibleLabel="Envio falhou aos 35%" showValue />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Variantes de severidade (pra listas de prioridade, ex.: ProgressList)</span>
        <ProgressBar value={50} variant="neutral" accessibleLabel="No prazo" showValue />
        <ProgressBar value={25} variant="warning" accessibleLabel="Atenção" showValue />
        <ProgressBar value={25} variant="critical" accessibleLabel="Atrasado" showValue />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Dinâmico (animado)</span>
        <ProgressBar value={progresso} accessibleLabel="Enviando arquivo" showValue />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Value fora do intervalo (clampado)</span>
        <ProgressBar value={150} max={100} accessibleLabel="Value acima do máximo" showValue />
      </div>
    </div>
  );
}
