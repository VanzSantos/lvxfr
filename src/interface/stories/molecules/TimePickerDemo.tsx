import { useState } from "react";
import { TimePicker } from "../../../components/TimePicker/TimePicker";
import styles from "../Demo.module.css";

export function TimePickerDemo() {
  const [horario, setHorario] = useState<string | null>(null);
  const [horarioComercial, setHorarioComercial] = useState<string | null>(null);
  const [intervalo, setIntervalo] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  });
  const [horarioSoDigitacao, setHorarioSoDigitacao] = useState<string | null>(null);
  const [horarioSemIcone, setHorarioSemIcone] = useState<string | null>(null);

  return (
    <div className={styles.column} style={{ maxWidth: 480 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Campo único (step=5)</span>
        <TimePicker label="Horário do compromisso" value={horario} onChange={setHorario} />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Com minTime/maxTime (horário comercial, step=30)</span>
        <TimePicker
          label="Horário de atendimento"
          value={horarioComercial}
          onChange={setHorarioComercial}
          minTime="08:00"
          maxTime="18:00"
          step={30}
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Intervalo (início/fim) — fim nunca antes de início</span>
        <TimePicker label="Janela de entrega" range value={intervalo} onChange={setIntervalo} />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>showPicker=false — só digitação, sem popover</span>
        <TimePicker label="Horário (só digitação)" value={horarioSoDigitacao} onChange={setHorarioSoDigitacao} showPicker={false} />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>showIcon=false — sem o ícone de relógio à esquerda</span>
        <TimePicker label="Horário" value={horarioSemIcone} onChange={setHorarioSemIcone} showIcon={false} />
      </div>
    </div>
  );
}
