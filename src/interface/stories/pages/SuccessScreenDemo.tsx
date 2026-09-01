import { SuccessScreen } from "../../screens/SuccessScreen/SuccessScreen";
import styles from "./LoginScreenDemo.module.css";

export function SuccessScreenDemo() {
  return (
    <div className={styles.frame} style={{ height: 640, overflow: "hidden" }}>
      <SuccessScreen embedded />
    </div>
  );
}
