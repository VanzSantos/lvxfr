import { useState } from "react";
import { ComboBox } from "../../../components/ComboBox/ComboBox";
import styles from "../Demo.module.css";

const PAISES = [
  { value: "br", label: "Brasil" },
  { value: "pt", label: "Portugal" },
  { value: "ar", label: "Argentina" },
  { value: "us", label: "Estados Unidos" },
  { value: "de", label: "Alemanha", disabled: true },
  { value: "jp", label: "Japão" },
  { value: "ca", label: "Canadá" },
  { value: "mx", label: "México" },
  { value: "es", label: "Espanha" },
  { value: "it", label: "Itália" },
  { value: "fr", label: "França" },
  { value: "uk", label: "Reino Unido" },
];

export function ComboBoxDemo() {
  const [pais, setPais] = useState("");
  const [paises, setPaises] = useState<string[]>(["br", "pt", "ar", "us", "jp"]);
  const [comErro, setComErro] = useState("");

  return (
    <div className={styles.column} style={{ maxWidth: 360 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Seleção única (12 opções, digite pra filtrar)</span>
        <ComboBox
          label="País"
          withInfo
          infoText="Digite pra filtrar entre as opções."
          placeholder="Buscar país..."
          options={PAISES}
          value={pais}
          onChange={setPais}
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Seleção múltipla (mesmo resumo truncado do Select)</span>
        <ComboBox
          label="Países visitados"
          multiple
          placeholder="Buscar país..."
          options={PAISES}
          value={paises}
          onChange={setPaises}
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Obrigatório + erro</span>
        <ComboBox
          label="País"
          required
          state={comErro ? "default" : "error"}
          helperText={comErro ? undefined : "Selecione um país."}
          placeholder="Buscar país..."
          options={PAISES}
          value={comErro}
          onChange={setComErro}
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Desabilitado</span>
        <ComboBox label="País" state="disabled" placeholder="Indisponível" options={PAISES} value="" />
      </div>
    </div>
  );
}
