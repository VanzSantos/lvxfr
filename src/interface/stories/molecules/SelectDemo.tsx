import { useState } from "react";
import { Select } from "../../../components/Select/Select";
import styles from "../Demo.module.css";

const PAISES = [
  { value: "br", label: "Brasil" },
  { value: "pt", label: "Portugal" },
  { value: "ar", label: "Argentina" },
  { value: "us", label: "Estados Unidos" },
  { value: "de", label: "Alemanha", disabled: true },
  { value: "jp", label: "Japão" },
  { value: "mx", label: "México" },
];

export function SelectDemo() {
  const [pais, setPais] = useState("");
  const [paises, setPaises] = useState<string[]>(["br", "pt", "ar", "us", "jp"]);
  const [comErro, setComErro] = useState("");

  return (
    <div className={styles.column} style={{ maxWidth: 360 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Seleção única</span>
        <Select
          label="País"
          withInfo
          infoText="País onde você mora atualmente."
          placeholder="Selecione um país"
          options={PAISES}
          value={pais}
          onChange={setPais}
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Seleção múltipla (fica aberto ao marcar)</span>
        <Select
          label="Países visitados"
          multiple
          placeholder="Selecione um ou mais"
          options={PAISES}
          value={paises}
          onChange={setPaises}
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Obrigatório + erro</span>
        <Select
          label="País"
          required
          state={comErro ? "default" : "error"}
          helperText={comErro ? undefined : "Selecione um país."}
          placeholder="Selecione um país"
          options={PAISES}
          value={comErro}
          onChange={setComErro}
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Desabilitado</span>
        <Select
          label="País"
          state="disabled"
          placeholder="Indisponível"
          options={PAISES}
          value=""
        />
      </div>
    </div>
  );
}
