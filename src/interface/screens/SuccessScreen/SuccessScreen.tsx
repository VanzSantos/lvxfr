import { Icon } from "../../../components/Icon/Icon";
import { Button } from "../../../components/Button/Button";
import styles from "./SuccessScreen.module.css";

interface SuccessScreenProps {
  /** true quando a página é renderizada dentro de um contêiner de tamanho próprio (ex.: preview da DS Playground), em vez de ocupar a viewport inteira. */
  embedded?: boolean;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SuccessScreen({
  embedded = false,
  title = "Tudo certo!",
  description = "Sua solicitação foi concluída com sucesso.",
  actionLabel = "Voltar para o início",
  onAction = () => {},
}: SuccessScreenProps) {
  return (
    <div className={embedded ? styles.pageEmbedded : styles.page}>
      <div className={styles.imagePanel} aria-hidden="true" />

      <div className={styles.formPanel}>
        <div className={styles.content}>
          <Icon name="check-circle" size="extraLarge" color="var(--icone-sucesso)" decorative />
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
          <Button variant="primary" label={actionLabel} onPress={onAction} />
        </div>
      </div>
    </div>
  );
}
