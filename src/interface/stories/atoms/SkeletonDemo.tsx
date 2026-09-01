import { useState } from "react";
import { Skeleton } from "../../../components/Skeleton/Skeleton";
import styles from "../Demo.module.css";

export function SkeletonDemo() {
  const [carregado, setCarregado] = useState(false);

  return (
    <div className={styles.column} style={{ maxWidth: 440 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Shapes</span>
        <div className={styles.row} style={{ alignItems: "center" }}>
          <Skeleton shape="circle" />
          <Skeleton shape="text" width="160px" />
          <Skeleton shape="rect" width="80px" height="80px" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Card de perfil (composição)</span>
        <div style={{ display: "flex", gap: 12, width: "100%", alignItems: "center" }}>
          <Skeleton shape="circle" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            <Skeleton shape="text" width="70%" />
            <Skeleton shape="text" width="40%" />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Alternando carregando/carregado</span>
        <button type="button" className={styles.trigger} onClick={() => setCarregado((c) => !c)}>
          {carregado ? "Voltar pro carregamento" : "Simular conteúdo carregado"}
        </button>
        <div style={{ marginTop: 12, width: "100%" }}>
          {carregado ? (
            <p style={{ margin: 0 }}>Conteúdo real carregado com sucesso.</p>
          ) : (
            <Skeleton shape="text" width="100%" />
          )}
        </div>
      </div>
    </div>
  );
}
