import { CrudTemplate } from "../../screens/CrudTemplate/CrudTemplate";
import styles from "./LoginScreenDemo.module.css";

export function CrudTemplateDemo() {
  return (
    <div className={styles.frame} style={{ height: 720, overflow: "hidden" }}>
      <CrudTemplate embedded />
    </div>
  );
}
