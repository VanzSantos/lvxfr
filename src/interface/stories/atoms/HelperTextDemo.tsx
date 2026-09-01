import { HelperText } from "../../../components/HelperText/HelperText";
import styles from "../Demo.module.css";

export function HelperTextDemo() {
  return (
    <div className={styles.column}>
      <HelperText text="Mínimo de 8 caracteres, com letras e números." intent="default" />
      <HelperText text="E-mail inválido — verifique e tente novamente." intent="error" />
    </div>
  );
}
