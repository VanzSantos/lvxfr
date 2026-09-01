import { useState } from "react";
import { TextField } from "../../../components/TextField/TextField";
import { PasswordStrengthMeter } from "../../../components/PasswordStrengthMeter/PasswordStrengthMeter";
import styles from "../Demo.module.css";

export function PasswordStrengthMeterDemo() {
  const [senha, setSenha] = useState("");

  return (
    <div className={styles.column} style={{ maxWidth: 320 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Pareado com TextField type="password"</span>
        <TextField label="Nova senha" type="password" value={senha} onChange={setSenha} />
        <div style={{ marginTop: 8 }}>
          <PasswordStrengthMeter value={senha} />
        </div>
      </div>
    </div>
  );
}
