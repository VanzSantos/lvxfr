import { useState } from "react";
import { TextField } from "../../../components/TextField/TextField";
import { Button } from "../../../components/Button/Button";
import { Alert } from "../../../components/Alert/Alert";
import { Icon } from "../../../components/Icon/Icon";
import styles from "./LoginScreen.module.css";

interface LoginScreenProps {
  /** true quando a página é renderizada dentro de um contêiner de tamanho próprio (ex.: preview da DS Playground), em vez de ocupar a viewport inteira (padrão). */
  embedded?: boolean;
}

export function LoginScreen({ embedded = false }: LoginScreenProps) {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  // Sem autenticação real — fora do escopo desta tela. Todo submit "falha",
  // só pra demonstrar o Alert de erro (contratos/alert.contract.json) no
  // caso de uso real que motivou o componente.
  const [loginFailed, setLoginFailed] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoginFailed(true);
  }

  function handleCpfChange(value: string) {
    setCpf(value);
    setLoginFailed(false);
  }

  function handleSenhaChange(value: string) {
    setSenha(value);
    setLoginFailed(false);
  }

  return (
    <div className={embedded ? styles.pageEmbedded : styles.page}>
      <div className={styles.imagePanel} aria-hidden="true" />

      <div className={styles.formPanel}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.brandMarkForm}>
            <span className={styles.brandIconSolid}>
              <Icon name="sparkle" size="medium" color="var(--acao-primaria-texto)" decorative />
            </span>
            <span className={styles.brandWordmark}>Portal</span>
          </div>

          <div>
            <h1 className={styles.title}>Vamos entrar?</h1>
            <p className={styles.subtitle}>
              Insira seu <strong>CPF</strong> e sua senha para acessar sua conta.
            </p>
          </div>

          {loginFailed && (
            <Alert
              intent="error"
              description="CPF ou senha inválidos."
              dismissible
              onDismiss={() => setLoginFailed(false)}
            />
          )}

          <TextField
            label="CPF"
            required
            type="cpf"
            leftIcon="identification-card"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={handleCpfChange}
            name="cpf"
            autoComplete="username"
          />

          <TextField
            label="Senha"
            required
            type="password"
            placeholder="Sua senha aqui..."
            value={senha}
            onChange={handleSenhaChange}
            name="senha"
            autoComplete="current-password"
          />

          <div className={styles.forgotPassword}>
            <Button
              variant="link"
              label="Esqueci minha senha"
              onPress={() => {
                // Navegação de recuperação de senha — fora do escopo desta tela.
              }}
            />
          </div>

          <Button
            variant="primary"
            label="Entrar"
            fullWidth
            type="submit"
            rightIcon="arrow-right"
          />
        </form>
      </div>
    </div>
  );
}
