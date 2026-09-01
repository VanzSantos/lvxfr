import { useState } from "react";
import { Wizard } from "../../../components/Wizard/Wizard";
import { TextField } from "../../../components/TextField/TextField";
import styles from "../Demo.module.css";

export function WizardDemo() {
  const [passo, setPasso] = useState(0);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [concluido, setConcluido] = useState(false);

  const etapas = [
    {
      label: "Dados pessoais",
      description: "Nome",
      content: (
        <div style={{ maxWidth: 320 }}>
          <TextField label="Nome completo" value={nome} onChange={setNome} helperText="Obrigatório pra avançar." />
        </div>
      ),
    },
    {
      label: "Contato",
      description: "E-mail",
      content: (
        <div style={{ maxWidth: 320 }}>
          <TextField label="E-mail" value={email} onChange={setEmail} helperText="Precisa conter '@' pra avançar." />
        </div>
      ),
    },
    {
      label: "Revisão",
      content: (
        <div style={{ maxWidth: 320 }}>
          <p>
            <strong>Nome:</strong> {nome || "(vazio)"}
          </p>
          <p>
            <strong>E-mail:</strong> {email || "(vazio)"}
          </p>
        </div>
      ),
    },
  ];

  function validateStep(index: number): boolean {
    if (index === 0) return nome.trim().length > 0;
    if (index === 1) return email.includes("@");
    return true;
  }

  if (concluido) {
    return (
      <div className={styles.column}>
        <p>Cadastro concluído! Nome: {nome}, E-mail: {email}</p>
      </div>
    );
  }

  return (
    <div className={styles.column} style={{ maxWidth: 480 }}>
      <Wizard
        steps={etapas}
        currentStep={passo}
        onStepChange={setPasso}
        onComplete={() => setConcluido(true)}
        validateStep={validateStep}
        accessibleLabel="Etapas do cadastro"
      />
    </div>
  );
}
