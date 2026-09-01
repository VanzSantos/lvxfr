import { useState } from "react";
import { TextField } from "../../../components/TextField/TextField";
import { Button } from "../../../components/Button/Button";
import { Alert } from "../../../components/Alert/Alert";
import styles from "./ForgotPasswordScreen.module.css";

interface ForgotPasswordScreenProps {
  /** true quando a página é renderizada dentro de um contêiner de tamanho próprio (ex.: preview da DS Playground), em vez de ocupar a viewport inteira. */
  embedded?: boolean;
}

export function ForgotPasswordScreen({ embedded = false }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <div className={embedded ? styles.pageEmbedded : styles.page}>
      <div className={styles.imagePanel} aria-hidden="true" />

      <div className={styles.formPanel}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.backRow}>
            <Button variant="link" label="Voltar" leftIcon="arrow-left" onPress={() => {}} />
          </div>

          <div>
            <h1 className={styles.title}>Esqueci minha senha</h1>
            <p className={styles.subtitle}>Informe seu e-mail cadastrado e enviaremos um link de recuperação.</p>
          </div>

          {sent && (
            <Alert
              intent="success"
              description="Se esse e-mail existir na nossa base, enviamos um link de recuperação."
              dismissible
              onDismiss={() => setSent(false)}
            />
          )}

          <TextField
            label="E-mail"
            required
            type="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(value) => {
              setEmail(value);
              setSent(false);
            }}
            name="email"
            autoComplete="email"
          />

          <Button variant="primary" label="Enviar link de recuperação" fullWidth type="submit" />
        </form>
      </div>
    </div>
  );
}
