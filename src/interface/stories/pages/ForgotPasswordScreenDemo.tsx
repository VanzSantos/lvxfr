import { ForgotPasswordScreen } from "../../screens/ForgotPasswordScreen/ForgotPasswordScreen";
import styles from "./LoginScreenDemo.module.css";

export function ForgotPasswordScreenDemo() {
  return (
    <div className={styles.frame}>
      <ForgotPasswordScreen embedded />
    </div>
  );
}
