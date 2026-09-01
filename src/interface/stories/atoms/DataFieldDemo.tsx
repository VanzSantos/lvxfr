import { DataField } from "../../../components/DataField/DataField";
import styles from "../Demo.module.css";

export function DataFieldDemo() {
  return (
    <div className={styles.column} style={{ maxWidth: 560 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Sem ícone</span>
        <div className={styles.row}>
          <DataField label="Nome completo" value="Amélia Aparecida dos Santos" />
          <DataField label="CPF" value="000.000.000-00" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Com ícone prefixando o valor</span>
        <div className={styles.row}>
          <DataField label="Contato celular" value="(27) 9 0000-0000" icon="user" />
          <DataField label="E-mail" value="meu.email@gmail.com" icon="info" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Grade de detalhe (composição típica)</span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxWidth: 480 }}>
          <DataField label="Matrícula" value="000000" />
          <DataField label="Situação do plano" value="Ativo" />
          <DataField label="Idade" value="72 anos" />
          <DataField label="Nascimento" value="00/00/0000" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Valor ausente (decisão de quem consome, ex.: travessão)</span>
        <DataField label="Complemento" value="—" />
      </div>
    </div>
  );
}
