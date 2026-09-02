import { AutorizacaoOCRScreen } from "../../screens/AutorizacaoOCRScreen/AutorizacaoOCRScreen";
import styles from "./LoginScreenDemo.module.css";

export function AutorizacaoOCRScreenDemo() {
  return (
    <div className={styles.frame} style={{ height: 720, overflow: "hidden" }}>
      <AutorizacaoOCRScreen embedded />
    </div>
  );
}
