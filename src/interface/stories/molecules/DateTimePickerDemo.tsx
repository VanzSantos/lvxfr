import { useState } from "react";
import { DateTimePicker } from "../../../components/DateTimePicker/DateTimePicker";
import styles from "../Demo.module.css";

export function DateTimePickerDemo() {
  const [inicioEvento, setInicioEvento] = useState<string | null>(null);
  const [intervalo, setIntervalo] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  });
  const [soDigitacao, setSoDigitacao] = useState<string | null>(null);
  const [semIcone, setSemIcone] = useState<string | null>(null);

  return (
    <div className={styles.column} style={{ maxWidth: 560 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Campo único — Calendar + Hora/Minuto no mesmo popover</span>
        <DateTimePicker label="Início do evento" value={inicioEvento} onChange={setInicioEvento} />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Intervalo (início/fim) — fim nunca antes de início</span>
        <DateTimePicker label="Janela de manutenção" range value={intervalo} onChange={setIntervalo} />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>showPicker=false — só digitação, sem popover</span>
        <DateTimePicker label="Data e hora (só digitação)" value={soDigitacao} onChange={setSoDigitacao} showPicker={false} />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>showIcon=false — sem o ícone de calendário à esquerda</span>
        <DateTimePicker label="Data e hora" value={semIcone} onChange={setSemIcone} showIcon={false} />
      </div>
    </div>
  );
}
