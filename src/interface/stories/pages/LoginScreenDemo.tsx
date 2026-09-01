import { LoginScreen } from "../../screens/LoginScreen/LoginScreen";
import styles from "./LoginScreenDemo.module.css";

export function LoginScreenDemo() {
  return (
    <div className={styles.frame} style={{ height: 640, overflow: "hidden" }}>
      <LoginScreen embedded />
    </div>
  );
}
