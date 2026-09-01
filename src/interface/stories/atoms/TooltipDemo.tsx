import { Tooltip } from "../../../components/Tooltip/Tooltip";
import styles from "../Demo.module.css";

export function TooltipDemo() {
  return (
    <div className={styles.row}>
      <Tooltip text="Dica curta e objetiva, ancorada ao gatilho." placement="top">
        <button className={styles.trigger} type="button">
          Passe o mouse, foque (Tab) ou toque
        </button>
      </Tooltip>
    </div>
  );
}
