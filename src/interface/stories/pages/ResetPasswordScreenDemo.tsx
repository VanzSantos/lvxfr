import { ResetPasswordScreen } from "../../screens/ResetPasswordScreen/ResetPasswordScreen";
import styles from "./LoginScreenDemo.module.css";

export function ResetPasswordScreenDemo() {
  return (
    <div className={styles.frame}>
      <ResetPasswordScreen embedded />
    </div>
  );
}
