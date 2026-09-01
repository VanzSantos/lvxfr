import { KanbanTemplate } from "../../screens/KanbanTemplate/KanbanTemplate";
import styles from "./LoginScreenDemo.module.css";

export function KanbanTemplateDemo() {
  return (
    <div className={styles.frame} style={{ height: 720, overflow: "hidden" }}>
      <KanbanTemplate embedded />
    </div>
  );
}
