import { useState } from "react";
import { Slider } from "../../../components/Slider/Slider";
import styles from "../Demo.module.css";

export function SliderDemo() {
  const [volume, setVolume] = useState(40);
  const [faixaPreco, setFaixaPreco] = useState<[number, number]>([200, 800]);
  const [desabilitado] = useState(30);

  return (
    <div className={styles.column} style={{ maxWidth: 400 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Valor único</span>
        <Slider label="Volume" value={volume} onChange={setVolume} />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Intervalo (dois cabos) — step=50</span>
        <Slider label="Faixa de preço (R$)" range value={faixaPreco} onChange={setFaixaPreco} min={0} max={1000} step={50} />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Desabilitado</span>
        <Slider label="Brilho" value={desabilitado} onChange={() => {}} state="disabled" />
      </div>
    </div>
  );
}
