import { TwoFactorScreen } from "../../screens/TwoFactorScreen/TwoFactorScreen";
import styles from "./LoginScreenDemo.module.css";

export function TwoFactorScreenDemo() {
  return (
    <div className={styles.frame}>
      <TwoFactorScreen embedded />
    </div>
  );
}
