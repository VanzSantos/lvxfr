import { useState } from "react";
import { Switch } from "../../../components/Switch/Switch";
import styles from "../Demo.module.css";

export function SwitchDemo() {
  const [notificacoes, setNotificacoes] = useState(true);
  const [modoEscuro, setModoEscuro] = useState(false);

  return (
    <div className={styles.column} style={{ maxWidth: 340 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Estados</span>
        <div className={styles.column} style={{ maxWidth: 320 }}>
          <Switch label="Desligado" checked={false} />
          <Switch label="Ligado" checked={true} />
          <Switch label="Desabilitado, desligado" checked={false} state="disabled" />
          <Switch label="Desabilitado, ligado" checked={true} state="disabled" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Interativo</span>
        <div className={styles.column} style={{ maxWidth: 320 }}>
          <Switch
            label="Notificações por e-mail"
            checked={notificacoes}
            onChange={setNotificacoes}
            name="notificacoes"
          />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>size="small" (contextos densos, ex.: coluna de ações de Datatable)</span>
        <div className={styles.row} style={{ alignItems: "center" }}>
          <Switch accessibleLabel="Ativo" size="small" checked={notificacoes} onChange={setNotificacoes} />
          <Switch accessibleLabel="Ativo, desabilitado" size="small" checked={true} state="disabled" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Sem label visível (accessibleLabel)</span>
        <div className={styles.column} style={{ maxWidth: 320 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Modo escuro (texto vem de fora do componente)</span>
            <Switch accessibleLabel="Modo escuro" checked={modoEscuro} onChange={setModoEscuro} />
          </div>
        </div>
      </div>
    </div>
  );
}
