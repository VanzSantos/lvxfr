import { Badge } from "../../../components/Badge/Badge";
import styles from "../Demo.module.css";

export function BadgeDemo() {
  return (
    <div className={styles.column} style={{ maxWidth: 420 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Status (fundo sólido)</span>
        <div className={styles.row}>
          <Badge variant="info" label="Em análise" />
          <Badge variant="success" label="Ativo" />
          <Badge variant="warning" label="Pendente" />
          <Badge variant="error" label="Bloqueado" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Com ícone (só combina com label)</span>
        <div className={styles.row}>
          <Badge variant="success" label="Autorizado" icon="check-circle" />
          <Badge variant="warning" label="Atenção" icon="warning-circle" />
          <Badge variant="error" label="Recusado" icon="x-circle" />
          <Badge variant="critical" label="Atrasado" icon="warning-circle" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Accent, sem status (accent1=kiwi, accent2=roxo, accent3=laranja)</span>
        <div className={styles.row}>
          <Badge variant="accent1" label="Beta" />
          <Badge variant="accent2" label="Interno" />
          <Badge variant="accent3" label="Novo" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Sem cor (neutral / white / dark — contexto de superfície)</span>
        <div className={styles.row}>
          <Badge variant="neutral" label="Rascunho" />
          <div style={{ padding: 4, background: "var(--fundo-secundario)", borderRadius: 8 }}>
            <Badge variant="white" label="Arquivado" />
          </div>
          <Badge variant="dark" label="v2.1.0" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Contador (count + truncamento em max)</span>
        <div className={styles.row}>
          <Badge variant="error" count={3} />
          <Badge variant="error" count={42} />
          <Badge variant="error" count={140} max={99} />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Modo anexado (position, os 4 cantos do pai)</span>
        <div className={styles.row}>
          {(["top-right", "top-left", "bottom-right", "bottom-left"] as const).map((position) => (
            <div
              key={position}
              style={{
                position: "relative",
                width: 48,
                height: 48,
                borderRadius: "9999px",
                background: "var(--acao-inativa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span>AV</span>
              <Badge variant="error" count={5} position={position} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Invertido (inverted — fundo claro + texto colorido, modelo antigo)</span>
        <div className={styles.row}>
          <Badge variant="info" label="Em análise" inverted />
          <Badge variant="success" label="Ativo" inverted />
          <Badge variant="warning" label="Pendente" inverted />
          <Badge variant="error" label="Bloqueado" inverted />
          <Badge variant="critical" label="Atrasado" inverted />
        </div>
      </div>
    </div>
  );
}
