import type { ReactNode } from "react";
import { TextField } from "../TextField/TextField";
import { Chip } from "../Chip/Chip";
import styles from "./FilterBar.module.css";

export interface FilterBarActiveFilter {
  key: string;
  label: string;
}

export interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  activeFilters?: FilterBarActiveFilter[];
  onRemoveFilter?: (key: string) => void;
  onClearAll?: () => void;
  accessibleLabel?: string;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filters,
  activeFilters = [],
  onRemoveFilter,
  onClearAll,
  accessibleLabel = "Filtros",
}: FilterBarProps) {
  const showSearch = Boolean(onSearchChange);
  const showActiveRow = activeFilters.length > 0;
  const showClearAll = Boolean(onClearAll) && showActiveRow;

  return (
    <div className={styles.bar} role={showSearch ? "search" : "group"} aria-label={accessibleLabel}>
      <div className={styles.mainRow}>
        {showSearch && (
          <div className={styles.searchField}>
            <TextField placeholder={searchPlaceholder} value={searchValue} onChange={onSearchChange} leftIcon="magnifying-glass" />
          </div>
        )}
        {filters && <div className={styles.filters}>{filters}</div>}
      </div>

      {showActiveRow && (
        <div className={styles.activeRow}>
          {activeFilters.map((filter) => (
            <Chip key={filter.key} label={filter.label} removable onRemove={() => onRemoveFilter?.(filter.key)} />
          ))}
          {showClearAll && (
            <button type="button" className={styles.clearAll} onClick={onClearAll}>
              Limpar tudo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
