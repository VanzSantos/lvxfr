import { useState } from "react";
import { TextField } from "../../../components/TextField/TextField";
import { Button } from "../../../components/Button/Button";
import { Alert } from "../../../components/Alert/Alert";
import { Checkbox } from "../../../components/Checkbox/Checkbox";
import { PasswordStrengthMeter } from "../../../components/PasswordStrengthMeter/PasswordStrengthMeter";
import { Wizard } from "../../../components/Wizard/Wizard";
import styles from "./SignUpScreen.module.css";

interface SignUpScreenProps {
  /** true quando a página é renderizada dentro de um contêiner de tamanho próprio (ex.: preview da DS Playground), em vez de ocupar a viewport inteira. */
  embedded?: boolean;
}

export function SignUpScreen({ embedded = false }: SignUpScreenProps) {
  const [passo, setPasso] = useState(0);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  function validateStep(index: number): boolean {
    if (index === 0) {
      if (!nome || !email || !cpf) {
        setErro("Preencha nome, e-mail e CPF pra continuar.");
        return false;
      }
      setErro(null);
      return true;
    }

    if (senha.length < 8) {
      setErro("A senha precisa ter pelo menos 8 caracteres.");
      return false;
    }
    if (senha !== confirmacao) {
      setErro("As senhas não coincidem.");
      return false;
    }
    if (!aceitaTermos) {
      setErro("Você precisa aceitar os termos de uso pra continuar.");
      return false;
    }
    setErro(null);
    return true;
  }

  function handleComplete() {
    setSucesso(true);
  }

  const etapas = [
    {
      label: "Seus dados",
      content: (
        <div className={styles.stepFields}>
          <TextField label="Nome completo" required value={nome} onChange={setNome} name="nome" autoComplete="name" />
          <TextField label="E-mail" required type="email" value={email} onChange={setEmail} name="email" autoComplete="email" />
          <TextField
            label="CPF"
            required
            type="cpf"
            leftIcon="identification-card"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={setCpf}
            name="cpf"
            autoComplete="off"
          />
        </div>
      ),
    },
    {
      label: "Senha",
      content: (
        <div className={styles.stepFields}>
          <div className={styles.field}>
            <TextField
              label="Senha"
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
            label="Confirmar senha"
            required
            type="password"
            value={confirmacao}
            onChange={setConfirmacao}
            name="confirmacao"
            autoComplete="new-password"
          />

          <Checkbox
            label="Li e aceito os termos de uso e a política de privacidade"
            checked={aceitaTermos}
            onChange={setAceitaTermos}
          />
        </div>
      ),
    },
  ];

  return (
    <div className={embedded ? styles.pageEmbedded : styles.page}>
      <div className={styles.imagePanel} aria-hidden="true" />

      <div className={styles.formPanel}>
        <div className={styles.form}>
          <div className={styles.backRow}>
            <Button variant="link" label="Voltar" leftIcon="arrow-left" onPress={() => {}} />
          </div>

          <h1 className={styles.title}>Criar conta</h1>

          {erro && <Alert intent="error" description={erro} dismissible onDismiss={() => setErro(null)} />}
          {sucesso && <Alert intent="success" description="Conta criada com sucesso." />}

          <Wizard
            steps={etapas}
            currentStep={passo}
            onStepChange={setPasso}
            onComplete={handleComplete}
            validateStep={validateStep}
            accessibleLabel="Etapas de cadastro"
            completeLabel="Criar conta"
          />
        </div>
      </div>
    </div>
  );
}
