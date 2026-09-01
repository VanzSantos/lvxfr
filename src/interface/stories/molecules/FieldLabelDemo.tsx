import { FieldLabel } from "../../../components/FieldLabel/FieldLabel";
import styles from "../Demo.module.css";

export function FieldLabelDemo() {
  return (
    <div className={styles.column}>
      <FieldLabel text="Nome" />
      <FieldLabel text="Login" required />
      <FieldLabel
        text="Senha"
        required
        withInfo
        infoText="Sua senha de acesso. Use o ícone de olho para exibir ou ocultar o que você digitou."
      />
    </div>
  );
}
