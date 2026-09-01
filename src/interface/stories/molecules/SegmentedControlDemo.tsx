import { useState } from "react";
import { SegmentedControl } from "../../../components/SegmentedControl/SegmentedControl";
import styles from "../Demo.module.css";

export function SegmentedControlDemo() {
  const [visualizacao, setVisualizacao] = useState("lista");
  const [periodo, setPeriodo] = useState("semana");
  const [status, setStatus] = useState("ativos");

  return (
    <div className={styles.column}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Com ícones</span>
        <SegmentedControl
          items={[
            { value: "lista", label: "Lista", icon: "list" },
            { value: "grade", label: "Grade", icon: "columns" },
          ]}
          value={visualizacao}
          onChange={setVisualizacao}
          accessibleLabel="Modo de visualização"
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>3 opções, sem ícone</span>
        <SegmentedControl
          items={[
            { value: "dia", label: "Dia" },
            { value: "semana", label: "Semana" },
            { value: "mes", label: "Mês" },
          ]}
          value={periodo}
          onChange={setPeriodo}
          accessibleLabel="Período"
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Com opção desabilitada</span>
        <SegmentedControl
          items={[
            { value: "todos", label: "Todos" },
            { value: "ativos", label: "Ativos" },
            { value: "arquivados", label: "Arquivados", disabled: true },
          ]}
          value={status}
          onChange={setStatus}
          accessibleLabel="Filtro de status"
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Grupo inteiro desabilitado</span>
        <SegmentedControl
          items={[
            { value: "a", label: "A" },
            { value: "b", label: "B" },
          ]}
          value="a"
          onChange={() => {}}
          state="disabled"
          accessibleLabel="Bloqueado"
        />
      </div>
    </div>
  );
}
