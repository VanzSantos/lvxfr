import { StackedText } from "../../../components/StackedText/StackedText";
import styles from "../Demo.module.css";

export function StackedTextDemo() {
  return (
    <div className={styles.column} style={{ maxWidth: 320 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Uso típico — nome + e-mail</span>
        <StackedText primaryText="Ana Souza" secondaryText="ana@exemplo.com" />
      </div>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>align="right" (ex.: célula numérica com unidade)</span>
        <StackedText primaryText="R$ 240,00" secondaryText="à vista" align="right" />
      </div>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>align="center"</span>
        <StackedText primaryText="Ativo" secondaryText="desde 2024" align="center" />
      </div>
    </div>
  );
}
