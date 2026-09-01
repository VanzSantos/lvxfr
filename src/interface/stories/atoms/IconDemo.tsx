import { Icon } from "../../../components/Icon/Icon";
import styles from "../Demo.module.css";

export function IconDemo() {
  return (
    <div className={styles.row}>
      <div className={styles.item}>
        <Icon name="info" size="medium" color="var(--icone-secundario)" />
        <span className={styles.itemLabel}>decorativo</span>
      </div>
      <div className={styles.item}>
        <Icon name="arrow-right" size="large" color="var(--acao-primaria)" />
        <span className={styles.itemLabel}>size="large"</span>
      </div>
      <div className={styles.item}>
        <Icon
          name="eye"
          size="medium"
          color="var(--icone-secundario)"
          decorative={false}
          accessibleLabel="Mostrar senha"
        />
        <span className={styles.itemLabel}>decorative=false</span>
      </div>
    </div>
  );
}
