import { useEffect, useState } from "react";
import { Icon, type IconSize } from "../Icon/Icon";
import styles from "./Avatar.module.css";

export type AvatarSize = "small" | "medium" | "large" | "xlarge";
export type AvatarShape = "circle" | "square";
export type AvatarStatus = "online" | "away" | "offline";

const FALLBACK_ICON_SIZE: Record<AvatarSize, IconSize> = {
  small: "small",
  medium: "medium",
  large: "large",
  xlarge: "extraLarge",
};

export interface AvatarProps {
  src?: string;
  name?: string;
  accessibleLabel?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ src, name, accessibleLabel, size = "medium", shape = "circle", status }: AvatarProps) {
  const accessibleName = accessibleLabel ?? name;
  if (!accessibleName) {
    throw new Error("Avatar: accessibleLabel ou name é obrigatório.");
  }

  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  const showImage = Boolean(src) && !imageFailed;
  const initials = !showImage && name ? getInitials(name) : null;

  return (
    <span className={`${styles.wrapper} ${styles[size]}`}>
      <span className={`${styles.frame} ${styles[shape]}`}>
        {showImage ? (
          <img
            src={src}
            alt={accessibleName}
            className={styles.image}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className={styles.fallback} role="img" aria-label={accessibleName}>
            {initials ? (
              <span aria-hidden="true">{initials}</span>
            ) : (
              <Icon name="user" size={FALLBACK_ICON_SIZE[size]} color="var(--texto-secundario)" />
            )}
          </span>
        )}
      </span>
      {status && <span className={`${styles.statusDot} ${styles[status]}`} aria-hidden="true" />}
    </span>
  );
}
