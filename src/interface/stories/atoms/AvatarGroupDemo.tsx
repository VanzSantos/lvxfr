import { AvatarGroup } from "../../../components/AvatarGroup/AvatarGroup";
import styles from "../Demo.module.css";

const pessoas = [
  { name: "Ana Beatriz" },
  { name: "Carlos Eduardo" },
  { name: "Fernanda Lima" },
  { name: "Gustavo Rocha" },
  { name: "Helena Souza" },
  { name: "Igor Martins" },
  { name: "Julia Prado" },
];

export function AvatarGroupDemo() {
  return (
    <div className={styles.column}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Padrão (max=5) — 7 pessoas, 2 ficam no "+2"</span>
        <AvatarGroup avatars={pessoas} accessibleLabel="Responsáveis pelo projeto" />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Cabem todas (3 pessoas, max=5)</span>
        <AvatarGroup avatars={pessoas.slice(0, 3)} accessibleLabel="Participantes da reunião" />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>size="small", max=3</span>
        <AvatarGroup avatars={pessoas} max={3} size="small" accessibleLabel="Revisores" />
      </div>
    </div>
  );
}
