import { CopyButton } from "../../../components/CopyButton/CopyButton";
import styles from "../Demo.module.css";

export function CopyButtonDemo() {
  return (
    <div className={styles.column}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Ao lado de uma API key</span>
        <div className={styles.row} style={{ alignItems: "center" }}>
          <code
            style={{
              padding: "6px 10px",
              background: "var(--fundo-secundario)",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            sk_live_51H8x...aB3f
          </code>
          <CopyButton value="sk_live_51H8x9F2aB3f" accessibleLabel="Copiar chave de API" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Desabilitado</span>
        <CopyButton value="não copiável" state="disabled" />
      </div>
    </div>
  );
}
