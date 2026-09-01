import { Icon, ICON_NAMES } from "../../components/Icon/Icon";
import styles from "./IconLibrary.module.css";

export function IconLibrary() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ícones (Phosphor)</h1>
        <span className={styles.count}>{ICON_NAMES.length} registrados</span>
      </header>
      <p className={styles.description}>
        Registro fechado do átomo <code>Icon</code> — cresce sob demanda de um consumidor
        real, nunca especulativamente (ver <code>contratos/icon.contract.json</code>). Use o{" "}
        <code>name</code> exatamente como aparece abaixo.
      </p>

      <div className={styles.grid}>
        {ICON_NAMES.map((name) => (
          <div key={name} className={styles.card}>
            <Icon name={name} size="large" color="var(--texto-primario)" />
            <code className={styles.name}>{name}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
