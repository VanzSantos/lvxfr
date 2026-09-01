import { BackofficeTemplate } from "../../screens/BackofficeTemplate/BackofficeTemplate";
import styles from "./LoginScreenDemo.module.css";

export function BackofficeTemplateDemo() {
  return (
    <div className={styles.frame} style={{ height: 640, overflow: "hidden" }}>
      <BackofficeTemplate embedded />
    </div>
  );
}
