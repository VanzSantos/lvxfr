import { useState } from "react";
import { Calendar } from "../../../components/Calendar/Calendar";
import styles from "../Demo.module.css";

function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function CalendarDemo() {
  const [data, setData] = useState<string | null>(todayISO());
  const [dataComLimites, setDataComLimites] = useState<string | null>(null);

  const hoje = todayISO();
  const [ano, mes] = hoje.split("-").map(Number);
  const minDate = `${ano}-${String(mes).padStart(2, "0")}-01`;
  const maxDate = new Date(ano, mes, 0).getDate();
  const maxDateISO = `${ano}-${String(mes).padStart(2, "0")}-${String(maxDate).padStart(2, "0")}`;

  return (
    <div className={styles.row} style={{ alignItems: "flex-start", flexWrap: "wrap", gap: 32 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Livre — clique no rótulo do mês pra pular direto</span>
        <Calendar value={data} onChange={setData} accessibleLabel="Data do evento" />
        <p style={{ marginTop: 8, fontSize: 13, color: "var(--texto-secundario)" }}>
          Selecionado: {data ?? "nenhuma"}
        </p>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Com minDate/maxDate (só o mês atual) e um dia específico bloqueado</span>
        <Calendar
          value={dataComLimites}
          onChange={setDataComLimites}
          minDate={minDate}
          maxDate={maxDateISO}
          disabledDate={(iso) => iso.endsWith("-15")}
          accessibleLabel="Data com restrições"
        />
        <p style={{ marginTop: 8, fontSize: 13, color: "var(--texto-secundario)" }}>
          Selecionado: {dataComLimites ?? "nenhuma"}
        </p>
      </div>
    </div>
  );
}
