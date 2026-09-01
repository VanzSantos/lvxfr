import { useRef, type KeyboardEvent } from "react";
import { Badge } from "../Badge/Badge";
import styles from "./Tabs.module.css";

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
  /** Indicador numérico ao lado da label (ex.: quantidade de itens naquela aba). Reaproveita o átomo Badge. */
  count?: number;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
}

export function Tabs({ items, value, onChange }: TabsProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const enabledItems = items.filter((item) => !item.disabled);

  const focusAndSelect = (targetValue: string) => {
    onChange(targetValue);
    refs.current[targetValue]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentValue: string) => {
    const enabledIndex = enabledItems.findIndex((item) => item.value === currentValue);
    if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = enabledItems[(enabledIndex + 1) % enabledItems.length];
      focusAndSelect(next.value);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const prev = enabledItems[(enabledIndex - 1 + enabledItems.length) % enabledItems.length];
      focusAndSelect(prev.value);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusAndSelect(enabledItems[0].value);
    } else if (event.key === "End") {
      event.preventDefault();
      focusAndSelect(enabledItems[enabledItems.length - 1].value);
    }
  };

  return (
    <div className={styles.tablist} role="tablist">
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            ref={(el) => {
              refs.current[item.value] = el;
            }}
            type="button"
            id={`tab-${item.value}`}
            role="tab"
            aria-selected={selected}
            aria-controls={`panel-${item.value}`}
            aria-disabled={item.disabled || undefined}
            aria-label={item.count !== undefined ? `${item.label}, ${item.count}` : undefined}
            disabled={item.disabled}
            tabIndex={selected ? 0 : -1}
            className={`${styles.tab} ${selected ? styles.selected : ""}`}
            onClick={() => onChange(item.value)}
            onKeyDown={(event) => handleKeyDown(event, item.value)}
          >
            <span>{item.label}</span>
            {item.count !== undefined && (
              <Badge variant="neutral" count={item.count} />
            )}
          </button>
        );
      })}
    </div>
  );
}
