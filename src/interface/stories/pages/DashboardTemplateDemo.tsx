import { DashboardTemplate } from "../../screens/DashboardTemplate/DashboardTemplate";
import styles from "./LoginScreenDemo.module.css";

export function DashboardTemplateDemo() {
  return (
    <div className={styles.frame} style={{ height: 720, overflow: "hidden" }}>
      <DashboardTemplate embedded />
    </div>
  );
}
