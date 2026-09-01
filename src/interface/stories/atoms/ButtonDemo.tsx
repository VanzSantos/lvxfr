import { Button, type ButtonVariant } from "../../../components/Button/Button";
import styles from "../Demo.module.css";

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "neutral", "subtle", "destructive", "link"];

export function ButtonDemo() {
  return (
    <div className={styles.column} style={{ maxWidth: 520 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Variantes (preenchido)</span>
        <div className={styles.row}>
          {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant} label={variant} />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Variantes (outlined)</span>
        <div className={styles.row}>
          {VARIANTS.filter((v) => v !== "link" && v !== "subtle").map((variant) => (
            <Button key={variant} variant={variant} outlined label={variant} />
          ))}
        </div>
        <span className={styles.itemLabel}>
          subtle não tem outlined — muito próximo do neutral outlined (2.35:1 de
          diferença, abaixo do mínimo de 3:1 de distinção de UI). Use variant="neutral" outlined.
        </span>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Todas as composições de ícone possíveis</span>
        <div className={styles.row}>
          <div className={styles.item}>
            <Button variant="primary" label="Salvar" />
            <span className={styles.itemLabel}>label</span>
          </div>
          <div className={styles.item}>
            <Button variant="primary" leftIcon="info" label="Detalhes" />
            <span className={styles.itemLabel}>leftIcon + label</span>
          </div>
          <div className={styles.item}>
            <Button variant="primary" rightIcon="arrow-right" label="Avançar" />
            <span className={styles.itemLabel}>rightIcon + label</span>
          </div>
          <div className={styles.item}>
            <Button variant="primary" leftIcon="info" rightIcon="arrow-right" label="Ambos" />
            <span className={styles.itemLabel}>leftIcon + label + rightIcon</span>
          </div>
          <div className={styles.item}>
            <Button variant="primary" iconOnly leftIcon="eye" accessibleLabel="Mostrar senha" />
            <span className={styles.itemLabel}>iconOnly (accessibleLabel)</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Estados</span>
        <div className={styles.row}>
          <Button variant="primary" label="Padrão" />
          <Button variant="primary" state="disabled" label="Desabilitado" />
          <Button variant="primary" state="loading" label="Carregando" />
        </div>
      </div>
    </div>
  );
}
