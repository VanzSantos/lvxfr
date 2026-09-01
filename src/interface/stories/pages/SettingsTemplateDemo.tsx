import { SettingsTemplate } from "../../screens/SettingsTemplate/SettingsTemplate";
import styles from "./LoginScreenDemo.module.css";

export function SettingsTemplateDemo() {
  return (
    <div className={styles.frame} style={{ height: 640, overflow: "hidden" }}>
      <SettingsTemplate embedded />
    </div>
  );
}
