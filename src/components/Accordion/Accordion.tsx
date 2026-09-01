import type { ReactNode } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./Accordion.module.css";

export interface AccordionItem {
  key: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  openKeys: string[];
  onChange: (openKeys: string[]) => void;
  mode?: "single" | "multiple";
}

export function Accordion({ items, openKeys, onChange, mode = "multiple" }: AccordionProps) {
  if (items.length === 0) {
    throw new Error("Accordion: items não pode ser vazio (contratos/accordion.contract.json, forbidden).");
  }

  function toggle(key: string, isOpen: boolean) {
    if (mode === "single") {
      onChange(isOpen ? [] : [key]);
      return;
    }
    onChange(isOpen ? openKeys.filter((k) => k !== key) : [...openKeys, key]);
  }

  return (
    <div className={styles.accordion}>
      {items.map((item) => {
        const isOpen = openKeys.includes(item.key);
        const headerId = `item-${item.key}-header`;
        const panelId = `item-${item.key}-panel`;

        return (
          <div key={item.key} className={styles.item}>
            <button
              type="button"
              id={headerId}
              className={styles.header}
              aria-expanded={isOpen}
              aria-controls={panelId}
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
              onClick={() => toggle(item.key, isOpen)}
            >
              <span className={styles.label}>{item.label}</span>
              <span className={`${styles.caret} ${isOpen ? styles.caretOpen : ""}`}>
                <Icon name="caret-down" size="small" color="var(--icone-secundario)" decorative />
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={`${styles.panelWrapper} ${isOpen ? styles.panelWrapperOpen : ""}`}
            >
              <div className={styles.panel}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
