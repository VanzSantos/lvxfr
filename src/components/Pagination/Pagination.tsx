import { Button } from "../Button/Button";
import styles from "./Pagination.module.css";

export interface PaginationProps {
  page: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  disabled?: boolean;
  accessibleLabel?: string;
}

export function Pagination({
  page,
  onPageChange,
  totalItems,
  pageSize,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onPageSizeChange,
  disabled = false,
  accessibleLabel = "Paginação",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return (
    <nav className={styles.pagination} aria-label={accessibleLabel}>
      <div className={styles.summary} aria-live="polite">
        {totalItems === 0 ? "0 registros" : `${rangeStart}–${rangeEnd} de ${totalItems}`}
      </div>
      <div className={styles.controls}>
        {onPageSizeChange && (
          <label className={styles.pageSizeLabel}>
            Itens por página
            <select
              className={styles.pageSizeSelect}
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              disabled={disabled}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}
        <Button
          variant="link"
          iconOnly
          accessibleLabel="Página anterior"
          leftIcon="caret-left"
          onPress={() => onPageChange(page - 1)}
          state={page <= 1 || disabled ? "disabled" : "default"}
        />
        <span className={styles.pageIndicator}>
          {page} de {totalPages}
        </span>
        <Button
          variant="link"
          iconOnly
          accessibleLabel="Próxima página"
          leftIcon="caret-right"
          onPress={() => onPageChange(page + 1)}
          state={page >= totalPages || disabled ? "disabled" : "default"}
        />
      </div>
    </nav>
  );
}
