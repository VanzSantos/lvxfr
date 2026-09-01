import { useState } from "react";
import { Rating } from "../../../components/Rating/Rating";
import styles from "../Demo.module.css";

export function RatingDemo() {
  const [nota, setNota] = useState(3);
  const [notaComMeio, setNotaComMeio] = useState(3.5);

  return (
    <div className={styles.column}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Interativo — só inteiros</span>
        <Rating value={nota} onChange={setNota} accessibleLabel="Avalie sua experiência" />
        <p style={{ marginTop: 8, fontSize: 13, color: "var(--texto-secundario)" }}>Nota: {nota}</p>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Interativo — com meio-ponto (clique na metade esquerda/direita da estrela)</span>
        <Rating value={notaComMeio} onChange={setNotaComMeio} allowHalf accessibleLabel="Avalie o atendimento" />
        <p style={{ marginTop: 8, fontSize: 13, color: "var(--texto-secundario)" }}>Nota: {notaComMeio}</p>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Só leitura — nota média de um produto</span>
        <Rating value={4.5} allowHalf state="readOnly" accessibleLabel="Nota média do produto" />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Desabilitado</span>
        <Rating value={2} onChange={() => {}} state="disabled" accessibleLabel="Avaliação bloqueada" />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Escala de 1 a 10 (max customizado)</span>
        <Rating value={7} allowHalf state="readOnly" max={10} accessibleLabel="Nota de 1 a 10" />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Cor amarela</span>
        <Rating value={4} onChange={setNota} color="yellow" accessibleLabel="Avaliação amarela" />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Tamanho grande</span>
        <Rating value={notaComMeio} allowHalf state="readOnly" size="large" accessibleLabel="Nota grande" />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Compacto — 1 estrela + nota (só leitura)</span>
        <div style={{ display: "flex", gap: 24 }}>
          <Rating value={3.5} allowHalf state="readOnly" display="compact" accessibleLabel="Nota compacta verde" />
          <Rating value={4.8} allowHalf state="readOnly" display="compact" color="yellow" accessibleLabel="Nota compacta amarela" />
          <Rating value={5} state="readOnly" display="compact" color="yellow" size="large" accessibleLabel="Nota compacta amarela grande" />
        </div>
      </div>
    </div>
  );
}
