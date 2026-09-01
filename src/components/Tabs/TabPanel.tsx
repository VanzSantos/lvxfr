import type { ReactNode } from "react";
import styles from "./Tabs.module.css";

export interface TabPanelProps {
  value: string;
  hidden: boolean;
  children: ReactNode;
}

export function TabPanel({ value, hidden, children }: TabPanelProps) {
  return (
    <div
      id={`panel-${value}`}
      role="tabpanel"
      aria-labelledby={`tab-${value}`}
      hidden={hidden}
      className={styles.panel}
    >
      {children}
    </div>
  );
}
