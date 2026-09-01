import styles from "./Skeleton.module.css";

export type SkeletonShape = "text" | "circle" | "rect";

export interface SkeletonProps {
  shape?: SkeletonShape;
  width?: string;
  height?: string;
}

const DEFAULT_HEIGHT: Record<SkeletonShape, string> = {
  text: "16px",
  circle: "40px",
  rect: "120px",
};

export function Skeleton({ shape = "text", width, height }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={`${styles.skeleton} ${styles[shape]}`}
      style={{
        width: width ?? (shape === "circle" ? DEFAULT_HEIGHT.circle : "100%"),
        height: height ?? DEFAULT_HEIGHT[shape],
      }}
    />
  );
}
