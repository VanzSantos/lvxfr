import { useState } from "react";
import { DatePicker } from "../../../components/DatePicker/DatePicker";
import styles from "../Demo.module.css";

export function DatePickerDemo() {
  const [data, setData] = useState<string | null>(null);
  const [dataComErro, setDataComErro] = useState<string | null>(null);
  const [intervalo, setIntervalo] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  });
  const [dataSoDigitacao, setDataSoDigitacao] = useState<string | null>(null);
  const [dataSemIcone, setDataSemIcone] = useState<string | null>(null);

  return (
    <div className={styles.column} style={{ maxWidth: 480 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Campo único</span>
        <DatePicker
          label="Data de nascimento"
          value={data}
          onChange={setData}
          maxDate="2026-08-18"
          helperText="Data selecionada só pode ser hoje ou antes."
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Estado de erro</span>
        <DatePicker
          label="Data de entrega"
          value={dataComErro}
          onChange={setDataComErro}
          state="error"
          helperText="Escolha uma data válida."
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Intervalo (início/fim) — fim nunca antes de início</span>
        <DatePicker label="Período da reserva" range value={intervalo} onChange={setIntervalo} />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>showPicker=false — só digitação, sem popover</span>
        <DatePicker label="Data (só digitação)" value={dataSoDigitacao} onChange={setDataSoDigitacao} showPicker={false} />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>showIcon=false — sem o ícone de calendário à esquerda</span>
        <DatePicker label="Data" value={dataSemIcone} onChange={setDataSemIcone} showIcon={false} />
      </div>
    </div>
  );
}
