import { Popover } from "../../../components/Popover/Popover";
import styles from "../Demo.module.css";

export function PopoverDemo() {
  return (
    <div className={styles.column}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>role="dialog" (padrão) — mini-formulário livre</span>
        <Popover
          accessibleLabel="Editar apelido"
          content={
            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 220 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "var(--texto-primario)" }}>Apelido</label>
              <input
                style={{
                  padding: 8,
                  border: "1px solid var(--borda-base)",
                  borderRadius: 8,
                  background: "var(--fundo-campo)",
                  color: "var(--texto-primario)",
                }}
                defaultValue="Convidado"
              />
            </div>
          }
        >
          <button type="button" className={styles.trigger}>
            Editar apelido
          </button>
        </Popover>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>role="menu" — lista de ações</span>
        <Popover
          role="menu"
          accessibleLabel="Ações"
          placement="bottom-end"
          content={
            <div style={{ display: "flex", flexDirection: "column", minWidth: 160 }}>
              <button style={{ textAlign: "left", padding: "8px 12px", border: "none", background: "none", cursor: "pointer", color: "var(--texto-primario)" }}>
                Duplicar
              </button>
              <button style={{ textAlign: "left", padding: "8px 12px", border: "none", background: "none", cursor: "pointer", color: "var(--texto-primario)" }}>
                Arquivar
              </button>
              <button style={{ textAlign: "left", padding: "8px 12px", border: "none", background: "none", cursor: "pointer", color: "var(--texto-erro)" }}>
                Excluir
              </button>
            </div>
          }
        >
          <button type="button" className={styles.trigger} aria-label="Mais ações">
            ⋯
          </button>
        </Popover>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>tone="dark" — painel escuro, pra gatilhos sobre superfícies escuras (ex.: CallControlBar)</span>
        <div style={{ display: "inline-block", padding: 16, background: "var(--fundo-invertido)", borderRadius: "var(--raio-p)" }}>
          <Popover
            role="menu"
            tone="dark"
            accessibleLabel="Ações"
            placement="bottom-start"
            content={
              <div style={{ display: "flex", flexDirection: "column", minWidth: 160 }}>
                <button style={{ textAlign: "left", padding: "8px 12px", border: "none", background: "none", cursor: "pointer", color: "var(--texto-invertido)" }}>
                  Duplicar
                </button>
                <button style={{ textAlign: "left", padding: "8px 12px", border: "none", background: "none", cursor: "pointer", color: "var(--texto-invertido)" }}>
                  Arquivar
                </button>
              </div>
            }
          >
            <button
              type="button"
              aria-label="Mais ações"
              style={{ padding: 8, borderRadius: "var(--raio-circular)", border: "none", background: "var(--fundo-secundario)", color: "var(--texto-invertido)", cursor: "pointer" }}
            >
              ⋯
            </button>
          </Popover>
        </div>
      </div>
    </div>
  );
}
