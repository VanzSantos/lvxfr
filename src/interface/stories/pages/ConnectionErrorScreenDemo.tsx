import { ConnectionErrorScreen } from "../../screens/ConnectionErrorScreen/ConnectionErrorScreen";
import styles from "./LoginScreenDemo.module.css";

export function ConnectionErrorScreenDemo() {
  return (
    <div className={styles.frame} style={{ height: 640, overflow: "hidden" }}>
      <ConnectionErrorScreen embedded />
    </div>
  );
}
