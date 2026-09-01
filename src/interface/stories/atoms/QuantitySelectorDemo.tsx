import { useState } from "react";
import { QuantitySelector } from "../../../components/QuantitySelector/QuantitySelector";
import styles from "../Demo.module.css";

export function QuantitySelectorDemo() {
  const [quantidade, setQuantidade] = useState(2);

  return (
    <div className={styles.column} style={{ maxWidth: 320 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Interativo (min=0, max=10)</span>
        <QuantitySelector
          value={quantidade}
          min={0}
          max={10}
          accessibleLabel="Quantidade"
          onChange={setQuantidade}
        />
      </div>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Nos limites (desabilita o lado correspondente)</span>
        <div className={styles.row}>
          <QuantitySelector value={0} min={0} max={10} accessibleLabel="No mínimo" />
          <QuantitySelector value={10} min={0} max={10} accessibleLabel="No máximo" />
        </div>
      </div>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Desabilitado</span>
        <QuantitySelector value={3} min={0} max={10} accessibleLabel="Desabilitado" state="disabled" />
      </div>
    </div>
  );
}
