import { useState } from "react";
import { Icon } from "../Icon/Icon";
import { Modal } from "../Modal/Modal";
import styles from "./ImageThumbnail.module.css";

export type ImageThumbnailSize = "small" | "medium" | "large";

export interface ImageThumbnailProps {
  src: string;
  alt: string;
  size?: ImageThumbnailSize;
  clickable?: boolean;
  expandedAlt?: string;
}

export function ImageThumbnail({
  src,
  alt,
  size = "medium",
  clickable = false,
  expandedAlt,
}: ImageThumbnailProps) {
  const [open, setOpen] = useState(false);

  const image = <img src={src} alt={alt} className={styles.image} />;

  if (!clickable) {
    return <span className={`${styles.wrapper} ${styles[size]}`}>{image}</span>;
  }

  return (
    <>
      <button
        type="button"
        className={`${styles.wrapper} ${styles[size]} ${styles.trigger}`}
        onClick={() => setOpen(true)}
        aria-label={`Ampliar ${alt}`}
      >
        {image}
        <span className={styles.overlay} aria-hidden="true">
          <Icon name="arrow-square-out" size="small" color="var(--texto-invertido)" />
        </span>
      </button>
      <Modal open={open} onClose={() => setOpen(false)} accessibleLabel={expandedAlt ?? alt} size="medium">
        <img src={src} alt={expandedAlt ?? alt} className={styles.expandedImage} />
      </Modal>
    </>
  );
}
