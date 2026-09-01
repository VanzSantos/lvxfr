import { SignUpScreen } from "../../screens/SignUpScreen/SignUpScreen";
import styles from "./LoginScreenDemo.module.css";

export function SignUpScreenDemo() {
  return (
    <div className={styles.frame} style={{ height: 640, overflow: "hidden" }}>
      <SignUpScreen embedded />
    </div>
  );
}
