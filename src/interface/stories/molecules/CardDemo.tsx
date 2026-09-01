import { Card } from "../../../components/Card/Card";
import styles from "../Demo.module.css";

export function CardDemo() {
  return (
    <div className={styles.column} style={{ maxWidth: 480 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Densidades de padding</span>
        <div className={styles.row}>
          <Card padding="small">
            <span className={styles.itemLabel}>small (12px)</span>
          </Card>
          <Card padding="medium">
            <span className={styles.itemLabel}>medium (24px)</span>
          </Card>
          <Card padding="large">
            <span className={styles.itemLabel}>large (32px, padrão)</span>
          </Card>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Elevation (none / low / medium / high)</span>
        <div className={styles.row}>
          <Card padding="medium" elevation="none">
            <span className={styles.itemLabel}>none (só borda)</span>
          </Card>
          <Card padding="medium" elevation="low">
            <span className={styles.itemLabel}>low</span>
          </Card>
          <Card padding="medium" elevation="medium">
            <span className={styles.itemLabel}>medium</span>
          </Card>
          <Card padding="medium" elevation="high">
            <span className={styles.itemLabel}>high</span>
          </Card>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Conteúdo livre (children)</span>
        <Card padding="medium">
          <div className={styles.column} style={{ maxWidth: "none" }}>
            <strong>Sem slots fixos</strong>
            <span className={styles.itemLabel}>
              Título, texto e qualquer outro componente do harness entram como filhos livres — é
              assim que o LoginScreen usa o Card hoje.
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
