import { useState } from "react";
import { Alert } from "../../../components/Alert/Alert";
import styles from "../Demo.module.css";

export function AlertDemo() {
  const [dismissivelVisivel, setDismissivelVisivel] = useState(true);

  return (
    <div className={styles.column} style={{ maxWidth: 440 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Os 5 intents (contorno suavizado via color-mix)</span>
        <div className={styles.column} style={{ maxWidth: 420 }}>
          <Alert intent="info" description="Sua sessão expira em 5 minutos." />
          <Alert intent="success" description="Cadastro salvo com sucesso." />
          <Alert intent="warning" description="Sua senha expira em 3 dias." />
          <Alert intent="error" description="Usuário ou senha inválidos." />
          <Alert intent="neutral" description="Este recurso está em fase beta." />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Com título</span>
        <Alert
          intent="error"
          title="Não foi possível entrar"
          description="Verifique seu usuário e senha e tente novamente."
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Dismissible (controlado)</span>
        {dismissivelVisivel ? (
          <Alert
            intent="info"
            description="Você pode fechar este aviso."
            dismissible
            onDismiss={() => setDismissivelVisivel(false)}
          />
        ) : (
          <span className={styles.itemLabel}>Fechado — Alert não gerencia a própria visibilidade.</span>
        )}
      </div>
    </div>
  );
}
