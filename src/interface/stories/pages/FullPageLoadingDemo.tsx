import { FullPageLoading } from "../../screens/FullPageLoading/FullPageLoading";
import styles from "./LoginScreenDemo.module.css";

export function FullPageLoadingDemo() {
  return (
    <div className={styles.frame}>
      <FullPageLoading embedded message="Carregando seus dados..." />
    </div>
  );
}
