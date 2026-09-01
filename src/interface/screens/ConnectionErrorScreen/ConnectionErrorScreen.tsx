import { useState } from "react";
import { Icon } from "../../../components/Icon/Icon";
import { Button } from "../../../components/Button/Button";
import styles from "./ConnectionErrorScreen.module.css";

interface ConnectionErrorScreenProps {
  /** true quando a página é renderizada dentro de um contêiner de tamanho próprio (ex.: preview da DS Playground), em vez de ocupar a viewport inteira. */
  embedded?: boolean;
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ConnectionErrorScreen({
  embedded = false,
  title = "Não foi possível conectar",
  description = "Verifique sua internet e tente novamente em instantes.",
  onRetry = () => {},
}: ConnectionErrorScreenProps) {
  const [retrying, setRetrying] = useState(false);

  function handleRetry() {
    setRetrying(true);
    // Sem backend real nesta demo — só simula a espera de uma nova tentativa
    // antes de repassar pro callback do consumidor (ver decisions).
    setTimeout(() => {
      setRetrying(false);
      onRetry();
    }, 900);
  }

  return (
    <div className={embedded ? styles.pageEmbedded : styles.page}>
      <div className={styles.imagePanel} aria-hidden="true" />

      <div className={styles.formPanel}>
        <div className={styles.content}>
          <Icon name="warning-circle" size="extraLarge" color="var(--icone-erro)" decorative />
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
          <Button
            variant="primary"
            label="Tentar novamente"
            onPress={handleRetry}
            state={retrying ? "loading" : "default"}
          />
        </div>
      </div>
    </div>
  );
}
