import { Button } from "../../../components/Button/Button";
import { Icon } from "../../../components/Icon/Icon";
import styles from "./ErrorScreen.module.css";

export type ErrorScreenCode = 404 | 500;

interface ErrorScreenProps {
  embedded?: boolean;
  code?: ErrorScreenCode;
  onGoHome?: () => void;
}

const MESSAGES: Record<ErrorScreenCode, { title: string; description: string }> = {
  404: { title: "Página não encontrada", description: "A página que você está procurando não existe ou foi movida." },
  500: { title: "Algo deu errado", description: "Ocorreu um erro inesperado no servidor. Tente novamente em instantes." },
};

export function ErrorScreen({ embedded = false, code = 404, onGoHome }: ErrorScreenProps) {
  const message = MESSAGES[code];

  return (
    <div className={embedded ? styles.pageEmbedded : styles.page}>
      <div className={styles.content}>
        <Icon name="warning-circle" size="extraLarge" color="var(--icone-secundario)" decorative />
        <span className={styles.code}>{code}</span>
        <h1 className={styles.title}>{message.title}</h1>
        <p className={styles.description}>{message.description}</p>
        <Button variant="primary" label="Voltar para o início" onPress={onGoHome ?? (() => {})} />
      </div>
    </div>
  );
}
