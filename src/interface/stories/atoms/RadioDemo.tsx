import { useState } from "react";
import { Radio } from "../../../components/Radio/Radio";
import styles from "../Demo.module.css";

export function RadioDemo() {
  const [plano, setPlano] = useState("mensal");

  return (
    <div className={styles.column} style={{ maxWidth: 340 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Grupo interativo (mesmo name)</span>
        <div className={styles.column} style={{ maxWidth: 320 }}>
          <Radio label="Mensal" name="plano" value="mensal" checked={plano === "mensal"} onChange={setPlano} />
          <Radio label="Anual" name="plano" value="anual" checked={plano === "anual"} onChange={setPlano} />
          <Radio
            label="Vitalício"
            name="plano"
            value="vitalicio"
            checked={plano === "vitalicio"}
            onChange={setPlano}
          />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Estados</span>
        <div className={styles.column} style={{ maxWidth: 320 }}>
          <Radio label="Erro" name="estado-erro" value="x" checked={false} state="error" />
          <Radio label="Desabilitado, desmarcado" name="estado-disabled-1" value="x" checked={false} state="disabled" />
          <Radio label="Desabilitado, marcado" name="estado-disabled-2" value="x" checked={true} state="disabled" />
        </div>
      </div>
    </div>
  );
}
