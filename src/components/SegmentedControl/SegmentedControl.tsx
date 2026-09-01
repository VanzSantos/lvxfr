import { useRef, type KeyboardEvent } from "react";
import { Icon, type IconName } from "../Icon/Icon";
import styles from "./SegmentedControl.module.css";

export interface SegmentedControlItem {
  value: string;
  label: string;
  icon?: IconName;
  disabled?: boolean;
}

export type SegmentedControlState = "default" | "disabled";

export interface SegmentedControlProps {
  items: SegmentedControlItem[];
  value: string;
  onChange: (value: string) => void;
  state?: SegmentedControlState;
  accessibleLabel?: string;
}

export function SegmentedControl({ items, value, onChange, state = "default", accessibleLabel = "Opções" }: SegmentedControlProps) {
  if (items.length < 2) {
    throw new Error("SegmentedControl: precisa de pelo menos 2 items (contratos/segmented-control.contract.json, forbidden).");
  }

  const groupDisabled = state === "disabled";
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const enabledItems = items.filter((item) => !item.disabled);

  const focusAndSelect = (targetValue: string) => {
    onChange(targetValue);
    refs.current[targetValue]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentValue: string) => {
    if (groupDisabled) return;
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
    <div className={`${styles.group} ${groupDisabled ? styles.groupDisabled : ""}`} role="radiogroup" aria-label={accessibleLabel}>
      {items.map((item) => {
        const selected = item.value === value;
        const disabled = groupDisabled || item.disabled;
        return (
          <button
            key={item.value}
            ref={(el) => {
              refs.current[item.value] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            tabIndex={selected ? 0 : -1}
            className={`${styles.segment} ${selected ? styles.selected : ""}`}
            onClick={() => !disabled && onChange(item.value)}
            onKeyDown={(event) => handleKeyDown(event, item.value)}
          >
            {item.icon && (
              <Icon
                name={item.icon}
                size="small"
                color={disabled ? "var(--texto-inativo)" : selected ? "var(--texto-primario)" : "var(--icone-secundario)"}
                decorative
              />
            )}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
