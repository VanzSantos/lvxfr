import { OnboardingScreen } from "../../screens/OnboardingScreen/OnboardingScreen";
import styles from "./LoginScreenDemo.module.css";

export function OnboardingScreenDemo() {
  return (
    <div className={styles.frame}>
      <OnboardingScreen embedded />
    </div>
  );
}
