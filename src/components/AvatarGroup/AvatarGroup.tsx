import { Avatar, type AvatarSize } from "../Avatar/Avatar";
import styles from "./AvatarGroup.module.css";

export interface AvatarGroupItem {
  src?: string;
  name?: string;
  accessibleLabel?: string;
}

export interface AvatarGroupProps {
  avatars: AvatarGroupItem[];
  max?: number;
  size?: AvatarSize;
  accessibleLabel?: string;
}

export function AvatarGroup({ avatars, max = 5, size = "medium", accessibleLabel = "Participantes" }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const overflowCount = avatars.length - visible.length;

  return (
    <div className={styles.group} role="group" aria-label={accessibleLabel}>
      {visible.map((avatar, index) => (
        <div key={index} className={`${styles.item} ${styles[size]}`} style={{ zIndex: visible.length - index }}>
          <Avatar src={avatar.src} name={avatar.name} accessibleLabel={avatar.accessibleLabel} size={size} />
        </div>
      ))}
      {overflowCount > 0 && (
        <div className={`${styles.item} ${styles.overflow} ${styles[size]}`} style={{ zIndex: 0 }}>
          <span role="img" aria-label={`e mais ${overflowCount} ${overflowCount === 1 ? "pessoa" : "pessoas"}`}>
            <span aria-hidden="true">+{overflowCount}</span>
          </span>
        </div>
      )}
    </div>
  );
}
