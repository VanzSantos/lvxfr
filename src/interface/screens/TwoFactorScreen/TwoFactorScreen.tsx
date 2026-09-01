import { useState } from "react";
import { Otp } from "../../../components/Otp/Otp";
import { Button } from "../../../components/Button/Button";
import { Alert } from "../../../components/Alert/Alert";
import styles from "./TwoFactorScreen.module.css";

interface TwoFactorScreenProps {
  /** true quando a página é renderizada dentro de um contêiner de tamanho próprio (ex.: preview da DS Playground), em vez de ocupar a viewport inteira. */
  embedded?: boolean;
}

export function TwoFactorScreen({ embedded = false }: TwoFactorScreenProps) {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState(false);
  const [verificado, setVerificado] = useState(false);

  function handleComplete(value: string) {
    if (value === "123456") {
      setErro(false);
      setVerificado(true);
    } else {
      setErro(true);
    }
  }

  return (
    <div className={embedded ? styles.pageEmbedded : styles.page}>
      <div className={styles.imagePanel} aria-hidden="true" />

      <div className={styles.formPanel}>
        <div className={styles.content}>
          <div className={styles.backRow}>
            <Button variant="link" label="Voltar" leftIcon="arrow-left" onPress={() => {}} />
          </div>

          <div>
            <h1 className={styles.title}>Verificação em duas etapas</h1>
            <p className={styles.subtitle}>Enviamos um código de 6 dígitos para o seu e-mail. Digite-o abaixo.</p>
          </div>

          {erro && <Alert intent="error" description="Código inválido. Tente novamente." dismissible onDismiss={() => setErro(false)} />}
          {verificado && <Alert intent="success" description="Verificado com sucesso!" />}

          <Otp
            accessibleLabel="Código de verificação"
            value={codigo}
            onChange={(value) => {
              setCodigo(value);
              setErro(false);
            }}
            onComplete={handleComplete}
          />

          <Button variant="primary" label="Verificar" fullWidth onPress={() => handleComplete(codigo)} />
          <Button variant="link" label="Reenviar código" onPress={() => {}} />
        </div>
      </div>
    </div>
  );
}
