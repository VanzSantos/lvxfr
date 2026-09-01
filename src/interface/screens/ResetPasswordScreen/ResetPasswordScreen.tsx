import { useState } from "react";
import { TextField } from "../../../components/TextField/TextField";
import { Button } from "../../../components/Button/Button";
import { Alert } from "../../../components/Alert/Alert";
import { PasswordStrengthMeter } from "../../../components/PasswordStrengthMeter/PasswordStrengthMeter";
import styles from "./ResetPasswordScreen.module.css";

interface ResetPasswordScreenProps {
  /** true quando a página é renderizada dentro de um contêiner de tamanho próprio (ex.: preview da DS Playground), em vez de ocupar a viewport inteira. */
  embedded?: boolean;
}

export function ResetPasswordScreen({ embedded = false }: ResetPasswordScreenProps) {
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (senha.length < 8) {
      setErro("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (senha !== confirmacao) {
      setErro("As senhas não coincidem.");
      return;
    }
    setErro(null);
    setSucesso(true);
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
            <h1 className={styles.title}>Redefinir senha</h1>
            <p className={styles.subtitle}>Escolha uma nova senha para sua conta.</p>
          </div>

          {erro && <Alert intent="error" description={erro} dismissible onDismiss={() => setErro(null)} />}
          {sucesso && <Alert intent="success" description="Senha redefinida com sucesso." />}

          <div className={styles.field}>
            <TextField
              label="Nova senha"
              required
              type="password"
              value={senha}
              onChange={setSenha}
              name="senha"
              autoComplete="new-password"
            />
            <PasswordStrengthMeter value={senha} />
          </div>

          <TextField
            label="Confirmar nova senha"
            required
            type="password"
            value={confirmacao}
            onChange={setConfirmacao}
            name="confirmacao"
            autoComplete="new-password"
          />

          <Button variant="primary" label="Redefinir senha" fullWidth type="submit" />
        </form>
      </div>
    </div>
  );
}
