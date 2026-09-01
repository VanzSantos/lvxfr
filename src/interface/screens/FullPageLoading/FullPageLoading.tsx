import { Spinner } from "../../../components/Spinner/Spinner";
import styles from "./FullPageLoading.module.css";

interface FullPageLoadingProps {
  embedded?: boolean;
  message?: string;
}

export function FullPageLoading({ embedded = false, message = "Carregando..." }: FullPageLoadingProps) {
  return (
    <div className={embedded ? styles.pageEmbedded : styles.page} role="status" aria-live="polite">
      <Spinner size="extraLarge" color="var(--acao-primaria)" />
      <span className={styles.message}>{message}</span>
    </div>
  );
}
