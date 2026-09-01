import { useId, useRef, useState } from "react";
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";
import { Icon } from "../Icon/Icon";
import { Button } from "../Button/Button";
import { Checkbox } from "../Checkbox/Checkbox";
import { Skeleton } from "../Skeleton/Skeleton";
import { Modal } from "../Modal/Modal";
import { Select, type SelectOption } from "../Select/Select";
import { Alert } from "../Alert/Alert";
import { Chip } from "../Chip/Chip";
import { normalizeForSearch } from "../shared/normalizeForSearch";
import styles from "./Datatable.module.css";

export type DatatableDensity = "comfortable" | "compact" | "condensed";
export type DatatableSortDirection = "asc" | "desc";
export type DatatableMode = "client" | "server";
export type DatatableExportFormat = "csv" | "pdf" | "xlsx";

export interface DatatableRowHelpers {
  isEditing: boolean;
  isDisabled: boolean;
  startEdit: () => void;
  cancelEdit: () => void;
  requestSave: () => void;
  requestToggleDisabled: () => void;
}

export interface DatatableEditControl {
  type: "text" | "select";
  options?: SelectOption[];
}

export interface DatatableColumn<T> {
  key: string;
  header: string;
  /** Valor bruto da célula, usado tanto pra exibir (quando render não é dado) quanto pra ordenar/filtrar. Default: row[key]. */
  accessor?: (row: T) => unknown;
  /** Node customizado da célula (modo leitura). Recebe helpers pra disparar edição/salvar/cancelar/habilitar-desabilitar da linha. */
  render?: (value: unknown, row: T, helpers: DatatableRowHelpers) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
  editable?: boolean;
  editControl?: DatatableEditControl;
  hideable?: boolean;
  sticky?: "right";
}

export interface DatatableFilterValue {
  columnKey: string;
  value: string;
}

export interface DatatableProps<T extends Record<string, unknown>> {
  columns: DatatableColumn<T>[];
  data: T[];
  rowKey: string;
  accessibleLabel: string;
  title?: string;
  toolbarActions?: React.ReactNode;
  bulkActions?: (selectedRowKeys: string[]) => React.ReactNode;
  density?: DatatableDensity;
  allowDensityToggle?: boolean;
  columnVisibilityEnabled?: boolean;

  selectable?: boolean;
  selectedRowKeys?: string[];
  onSelectionChange?: (selectedRowKeys: string[]) => void;

  sortMode?: DatatableMode;
  sortColumnKey?: string | null;
  sortDirection?: DatatableSortDirection;
  onSortChange?: (columnKey: string | null, direction: DatatableSortDirection) => void;

  filterMode?: DatatableMode;
  filterValues?: DatatableFilterValue[];
  onFilterChange?: (columnKey: string, value: string) => void;

  paginationEnabled?: boolean;
  paginationMode?: DatatableMode;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  onRowSave?: (rowKey: string, values: Record<string, unknown>, row: T) => void;
  disabledRowKeys?: string[];
  onDisabledRowKeysChange?: (disabledRowKeys: string[]) => void;
  onExport?: (format: DatatableExportFormat, rows: T[]) => void;

  loading?: boolean;
  skeletonRowCount?: number;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

function getCellValue<T>(column: DatatableColumn<T>, row: T): unknown {
  if (column.accessor) return column.accessor(row);
  return (row as Record<string, unknown>)[column.key];
}

type Confirmation =
  | { type: "save"; rowKey: string }
  | { type: "disable"; rowKey: string; nextDisabled: boolean };

function useDropdown() {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-end",
    whileElementsMounted: autoUpdate,
    middleware: [offset(4), flip(), shift({ padding: 8 })],
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "menu" });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);
  return { open, setOpen, refs, floatingStyles, context, getReferenceProps, getFloatingProps };
}

const EXPORT_FORMATS: { value: DatatableExportFormat; label: string }[] = [
  { value: "csv", label: "Exportar CSV" },
  { value: "pdf", label: "Exportar PDF" },
  { value: "xlsx", label: "Exportar XLSX" },
];

export function Datatable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  accessibleLabel,
  title,
  toolbarActions,
  bulkActions,
  density = "compact",
  allowDensityToggle = false,
  columnVisibilityEnabled = false,
  selectable = false,
  selectedRowKeys = [],
  onSelectionChange,
  sortMode = "client",
  sortColumnKey = null,
  sortDirection = "asc",
  onSortChange,
  filterMode = "client",
  filterValues = [],
  onFilterChange,
  paginationEnabled = false,
  paginationMode = "client",
  page = 1,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50, 100],
  totalRows,
  onPageChange,
  onPageSizeChange,
  onRowSave,
  disabledRowKeys = [],
  onDisabledRowKeysChange,
  onExport,
  loading = false,
  skeletonRowCount = 5,
  emptyStateTitle = "Nenhum registro encontrado.",
  emptyStateDescription,
}: DatatableProps<T>) {
  const idPrefix = useId();

  if (columns.length < 2) {
    throw new Error("Datatable: precisa de pelo menos 2 columns (contratos/datatable.contract.json, forbidden).");
  }

  const [openFilterColumnKey, setOpenFilterColumnKey] = useState<string | null>(null);
  const [editingRowKey, setEditingRowKey] = useState<string | null>(null);
  const [draftValues, setDraftValues] = useState<Record<string, unknown> | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [internalDensity, setInternalDensity] = useState<DatatableDensity>(density);
  const [hiddenColumnKeys, setHiddenColumnKeys] = useState<string[]>([]);
  const filterTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const columnPopover = useDropdown();
  const exportPopover = useDropdown();

  const effectiveDensity = allowDensityToggle ? internalDensity : density;
  const visibleColumns = columns.filter((column) => !hiddenColumnKeys.includes(column.key));
  const hideableColumns = columns.filter((column) => column.hideable !== false);

  function toggleColumnVisible(columnKey: string, visible: boolean) {
    setHiddenColumnKeys((current) => {
      const next = visible ? current.filter((k) => k !== columnKey) : [...current, columnKey];
      const wouldStayVisible = columns.filter((c) => !next.includes(c.key)).length;
      return wouldStayVisible === 0 ? current : next;
    });
  }

  function restoreAllColumns() {
    setHiddenColumnKeys([]);
  }

  const filterValueFor = (columnKey: string) =>
    filterValues.find((entry) => entry.columnKey === columnKey)?.value ?? "";

  function toggleFilter(columnKey: string) {
    setOpenFilterColumnKey((current) => (current === columnKey ? null : columnKey));
  }

  function closeFilter(columnKey: string) {
    setOpenFilterColumnKey(null);
    filterTriggerRefs.current[columnKey]?.focus();
  }

  const activeFilterEntries = filterValues.filter((entry) => entry.value.trim() !== "");

  function removeFilter(columnKey: string) {
    onFilterChange?.(columnKey, "");
  }

  function clearAllFilters() {
    activeFilterEntries.forEach((entry) => onFilterChange?.(entry.columnKey, ""));
  }

  // Filtro (client mode): substring normalizado por acento (shared/normalizeForSearch),
  // mesma correção já feita em Select/ComboBox — contratos/datatable.contract.json, forbidden.
  let processedData = data;
  if (filterMode === "client") {
    const activeFilters = filterValues.filter((entry) => entry.value.trim() !== "");
    if (activeFilters.length > 0) {
      processedData = processedData.filter((row) =>
        activeFilters.every((filter) => {
          const column = columns.find((c) => c.key === filter.columnKey);
          if (!column) return true;
          const raw = getCellValue(column, row);
          return normalizeForSearch(String(raw ?? "")).includes(normalizeForSearch(filter.value));
        })
      );
    }
  }

  // Ordenação (client mode) — nunca muta data, sempre produz cópia nova (forbidden).
  if (sortMode === "client" && sortColumnKey) {
    const sortColumn = columns.find((c) => c.key === sortColumnKey);
    if (sortColumn) {
      processedData = [...processedData].sort((a, b) => {
        const valueA = getCellValue(sortColumn, a);
        const valueB = getCellValue(sortColumn, b);
        let comparison = 0;
        if (typeof valueA === "number" && typeof valueB === "number") {
          comparison = valueA - valueB;
        } else {
          comparison = String(valueA ?? "").localeCompare(String(valueB ?? ""), "pt-BR");
        }
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }
  }

  const totalRowsComputed = paginationMode === "server" ? totalRows ?? 0 : processedData.length;

  let pageRows = processedData;
  if (paginationEnabled && paginationMode === "client") {
    const start = (page - 1) * pageSize;
    pageRows = processedData.slice(start, start + pageSize);
  }

  const selectedSet = new Set(selectedRowKeys);
  const currentPageKeys = pageRows.map((row) => String(row[rowKey]));
  const allSelected = currentPageKeys.length > 0 && currentPageKeys.every((key) => selectedSet.has(key));
  const someSelected = !allSelected && currentPageKeys.some((key) => selectedSet.has(key));

  function toggleAll() {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(selectedRowKeys.filter((key) => !currentPageKeys.includes(key)));
    } else {
      const merged = new Set(selectedRowKeys);
      currentPageKeys.forEach((key) => merged.add(key));
      onSelectionChange(Array.from(merged));
    }
  }

  function toggleRow(key: string) {
    if (!onSelectionChange) return;
    if (selectedSet.has(key)) {
      onSelectionChange(selectedRowKeys.filter((k) => k !== key));
    } else {
      onSelectionChange([...selectedRowKeys, key]);
    }
  }

  function handleSortClick(column: DatatableColumn<T>) {
    if (!onSortChange) return;
    if (sortColumnKey !== column.key) {
      onSortChange(column.key, "asc");
    } else if (sortDirection === "asc") {
      onSortChange(column.key, "desc");
    } else {
      onSortChange(null, "asc");
    }
  }

  function makeHelpers(row: T, key: string): DatatableRowHelpers {
    return {
      isEditing: editingRowKey === key,
      isDisabled: disabledRowKeys.includes(key),
      startEdit: () => {
        const draft: Record<string, unknown> = {};
        columns.forEach((column) => {
          if (column.editable) draft[column.key] = getCellValue(column, row);
        });
        setEditingRowKey(key);
        setDraftValues(draft);
      },
      cancelEdit: () => {
        setEditingRowKey(null);
        setDraftValues(null);
      },
      requestSave: () => setConfirmation({ type: "save", rowKey: key }),
      requestToggleDisabled: () =>
        setConfirmation({ type: "disable", rowKey: key, nextDisabled: !disabledRowKeys.includes(key) }),
    };
  }

  function confirmAction() {
    if (!confirmation) return;
    if (confirmation.type === "save") {
      const row = data.find((r) => String(r[rowKey]) === confirmation.rowKey);
      if (row) onRowSave?.(confirmation.rowKey, draftValues ?? {}, row);
      setEditingRowKey(null);
      setDraftValues(null);
    } else {
      const next = confirmation.nextDisabled
        ? [...disabledRowKeys, confirmation.rowKey]
        : disabledRowKeys.filter((k) => k !== confirmation.rowKey);
      onDisabledRowKeysChange?.(next);
    }
    setConfirmation(null);
  }

  const totalPages = Math.max(1, Math.ceil(totalRowsComputed / pageSize));
  const rangeStart = totalRowsComputed === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalRowsComputed);
  const totalColCount = visibleColumns.length + (selectable ? 1 : 0);

  function handlePageSizeChange(newSize: number) {
    // Troca de pageSize sempre reseta page pra 1 (contratos/datatable.contract.json, decisions).
    onPageSizeChange?.(newSize);
    onPageChange?.(1);
  }

  const showBulkActions = Boolean(selectable && bulkActions && selectedRowKeys.length >= 2);
  const showToolbar = Boolean(
    title || toolbarActions || allowDensityToggle || columnVisibilityEnabled || onExport || showBulkActions
  );
  // Ciclo do botão de densidade é só compact ↔ condensed — comfortable fica fora,
  // só alcançável via prop (contratos/datatable.contract.json, decisions).
  const isDensityAtSmallerEnd = effectiveDensity === "condensed";

  return (
    <div className={styles.container}>
      {showToolbar && (
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            {showBulkActions ? (
              <div className={styles.bulkActions}>
                <span className={styles.bulkCount}>{selectedRowKeys.length} selecionados</span>
                {bulkActions?.(selectedRowKeys)}
              </div>
            ) : (
              title && <h2 className={styles.title}>{title}</h2>
            )}
          </div>
          <div className={styles.toolbarRight}>
            {toolbarActions}

            {allowDensityToggle && (
              <Button
                variant="link"
                iconOnly
                leftIcon={isDensityAtSmallerEnd ? "equals" : "list"}
                accessibleLabel={isDensityAtSmallerEnd ? "Aumentar densidade" : "Diminuir densidade"}
                onPress={() => setInternalDensity((d) => (d === "condensed" ? "compact" : "condensed"))}
              />
            )}

            {columnVisibilityEnabled && (
              <div className={styles.popoverAnchor}>
                <span
                  ref={columnPopover.refs.setReference}
                  {...columnPopover.getReferenceProps()}
                  className={styles.popoverTriggerWrap}
                >
                  <Button variant="link" iconOnly leftIcon="columns" accessibleLabel="Colunas visíveis" />
                </span>
                {columnPopover.open && (
                  <FloatingPortal>
                    <FloatingFocusManager context={columnPopover.context} modal={false}>
                      <div
                        ref={columnPopover.refs.setFloating}
                        style={columnPopover.floatingStyles}
                        {...columnPopover.getFloatingProps()}
                        className={`${styles.popover} ${styles.popoverWide}`}
                      >
                        {hideableColumns.map((column) => (
                          <Checkbox
                            key={column.key}
                            label={column.header}
                            checked={!hiddenColumnKeys.includes(column.key)}
                            onChange={(checked) => toggleColumnVisible(column.key, checked)}
                          />
                        ))}
                      </div>
                    </FloatingFocusManager>
                  </FloatingPortal>
                )}
              </div>
            )}

            {onExport && (
              <div className={styles.popoverAnchor}>
                <span
                  ref={exportPopover.refs.setReference}
                  {...exportPopover.getReferenceProps()}
                  className={styles.popoverTriggerWrap}
                >
                  <Button variant="link" iconOnly leftIcon="download-simple" accessibleLabel="Exportar tabela" />
                </span>
                {exportPopover.open && (
                  <FloatingPortal>
                    <FloatingFocusManager context={exportPopover.context} modal={false}>
                      <div
                        ref={exportPopover.refs.setFloating}
                        style={exportPopover.floatingStyles}
                        {...exportPopover.getFloatingProps()}
                        className={styles.popover}
                      >
                        {EXPORT_FORMATS.map((format) => (
                          <Button
                            key={format.value}
                            variant="link"
                            fullWidth
                            label={format.label}
                            onPress={() => {
                              onExport(format.value, processedData);
                              exportPopover.setOpen(false);
                            }}
                          />
                        ))}
                      </div>
                    </FloatingFocusManager>
                  </FloatingPortal>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {hiddenColumnKeys.length > 0 && (
        <Alert
          intent="warning"
          description={`Atenção: você tem ${hiddenColumnKeys.length} coluna${hiddenColumnKeys.length > 1 ? "s" : ""} com visualização oculta.`}
          action={{ label: "Restaurar", onAction: restoreAllColumns }}
        />
      )}

      {activeFilterEntries.length > 0 && (
        <div className={styles.activeFilters}>
          <span className={styles.activeFiltersLabel}>Filtros ativos:</span>
          {activeFilterEntries.map((entry) => {
            const column = columns.find((c) => c.key === entry.columnKey);
            return (
              <Chip
                key={entry.columnKey}
                label={`${column?.header ?? entry.columnKey}: ${entry.value}`}
                removable
                onRemove={() => removeFilter(entry.columnKey)}
              />
            );
          })}
          <Button variant="link" label="Limpar todos" onPress={clearAllFilters} />
        </div>
      )}

      <div className={styles.wrapper} aria-busy={loading || undefined}>
        <div className={styles.scrollArea}>
          <table className={`${styles.table} ${styles[effectiveDensity]}`} aria-label={accessibleLabel}>
            <thead className={styles.thead}>
              <tr>
                {selectable && (
                  <th scope="col" className={`${styles.th} ${styles.thSelect}`}>
                    <Checkbox
                      hideLabel
                      label="Selecionar todos os itens desta página"
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={toggleAll}
                      state={loading || pageRows.length === 0 ? "disabled" : "default"}
                    />
                  </th>
                )}
                {visibleColumns.map((column) => {
                  const isSorted = sortColumnKey === column.key;
                  const ariaSort = !column.sortable
                    ? undefined
                    : isSorted
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : "none";
                  const nextDirectionLabel = !isSorted ? "crescente" : sortDirection === "asc" ? "decrescente" : "removido";
                  const isFilterOpen = openFilterColumnKey === column.key;
                  const filterInputId = `${idPrefix}-filter-${column.key}`;

                  return (
                    <th
                      key={column.key}
                      scope="col"
                      className={`${styles.th} ${column.sticky === "right" ? styles.stickyRight : ""}`}
                      style={{ width: column.width }}
                      aria-sort={ariaSort as React.AriaAttributes["aria-sort"]}
                    >
                      <div className={styles.thContent}>
                        <div className={styles.titleArea}>
                          {column.filterable && isFilterOpen ? (
                            <input
                              id={filterInputId}
                              type="text"
                              autoFocus
                              className={styles.headerControl}
                              aria-label={`Filtrar ${column.header}`}
                              placeholder="Filtrar…"
                              value={filterValueFor(column.key)}
                              onChange={(event) => onFilterChange?.(column.key, event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === "Escape") closeFilter(column.key);
                              }}
                              onBlur={() => {
                                if (!filterValueFor(column.key)) setOpenFilterColumnKey(null);
                              }}
                              disabled={loading}
                            />
                          ) : column.filterable ? (
                            <button
                              type="button"
                              ref={(el) => {
                                filterTriggerRefs.current[column.key] = el;
                              }}
                              className={`${styles.headerControl} ${styles.headerNameButton}`}
                              onClick={() => toggleFilter(column.key)}
                              aria-expanded={isFilterOpen}
                              aria-controls={filterInputId}
                            >
                              <span className={styles.headerNameText}>{column.header}</span>
                              <Icon name="magnifying-glass" size="small" color="var(--icone-secundario)" decorative />
                            </button>
                          ) : (
                            <span className={styles.headerLabel}>{column.header}</span>
                          )}
                        </div>

                        {column.sortable && (
                          <button
                            type="button"
                            className={styles.sortButton}
                            onClick={() => handleSortClick(column)}
                            aria-label={`Ordenar por ${column.header}, ${nextDirectionLabel}`}
                            disabled={loading}
                          >
                            <Icon
                              name={isSorted && sortDirection === "desc" ? "caret-down" : "caret-up"}
                              size="small"
                              color={isSorted ? "var(--acao-primaria)" : "var(--icone-secundario)"}
                            />
                          </button>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: skeletonRowCount }).map((_, index) => (
                  <tr key={`${idPrefix}-skeleton-${index}`}>
                    {selectable && (
                      <td className={styles.td}>
                        <Skeleton shape="rect" width="20px" height="20px" />
                      </td>
                    )}
                    {visibleColumns.map((column) => (
                      <td key={column.key} className={styles.td}>
                        <Skeleton shape="text" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pageRows.length === 0 ? (
                <tr>
                  <td colSpan={totalColCount} className={styles.emptyCell}>
                    <strong className={styles.emptyTitle}>{emptyStateTitle}</strong>
                    {emptyStateDescription && <p className={styles.emptyDescription}>{emptyStateDescription}</p>}
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => {
                  const key = String(row[rowKey]);
                  const selected = selectedSet.has(key);
                  const helpers = makeHelpers(row, key);
                  return (
                    <tr
                      key={key}
                      className={`${styles.row} ${selected ? styles.rowSelected : ""} ${
                        helpers.isEditing ? styles.rowEditing : ""
                      } ${helpers.isDisabled ? styles.rowDisabled : ""}`}
                    >
                      {selectable && (
                        <td className={styles.td}>
                          <Checkbox
                            hideLabel
                            label={`Selecionar linha ${key}`}
                            checked={selected}
                            onChange={() => toggleRow(key)}
                          />
                        </td>
                      )}
                      {visibleColumns.map((column) => {
                        const value = getCellValue(column, row);
                        const isCellEditing = helpers.isEditing && column.editable;
                        return (
                          <td
                            key={column.key}
                            className={`${styles.td} ${column.sticky === "right" ? styles.stickyRight : ""}`}
                            style={{ textAlign: column.align ?? "left" }}
                          >
                            {isCellEditing ? (
                              column.editControl?.type === "select" ? (
                                <Select
                                  options={column.editControl.options ?? []}
                                  value={String(draftValues?.[column.key] ?? "")}
                                  onChange={(newValue) =>
                                    setDraftValues((current) => ({ ...current, [column.key]: newValue }))
                                  }
                                />
                              ) : (
                                <input
                                  type="text"
                                  className={styles.editInput}
                                  aria-label={`${column.header} (editando)`}
                                  value={String(draftValues?.[column.key] ?? "")}
                                  onChange={(event) =>
                                    setDraftValues((current) => ({ ...current, [column.key]: event.target.value }))
                                  }
                                />
                              )
                            ) : column.render ? (
                              column.render(value, row, helpers)
                            ) : (
                              String(value ?? "")
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {paginationEnabled && (
          <div className={styles.pagination}>
            <div className={styles.paginationSummary}>
              {totalRowsComputed === 0
                ? "0 registros"
                : `${rangeStart}–${rangeEnd} de ${totalRowsComputed}`}
            </div>
            <div className={styles.paginationControls}>
              <label className={styles.pageSizeLabel}>
                Itens por página
                <select
                  className={styles.pageSizeSelect}
                  value={pageSize}
                  onChange={(event) => handlePageSizeChange(Number(event.target.value))}
                  disabled={loading}
                >
                  {pageSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <Button
                variant="link"
                iconOnly
                accessibleLabel="Página anterior"
                leftIcon="caret-left"
                onPress={() => onPageChange?.(page - 1)}
                state={page <= 1 || loading ? "disabled" : "default"}
              />
              <span className={styles.pageIndicator}>
                {page} de {totalPages}
              </span>
              <Button
                variant="link"
                iconOnly
                accessibleLabel="Próxima página"
                leftIcon="caret-right"
                onPress={() => onPageChange?.(page + 1)}
                state={page >= totalPages || loading ? "disabled" : "default"}
              />
            </div>
          </div>
        )}
      </div>

      {confirmation && (
        <Modal
          open
          onClose={() => setConfirmation(null)}
          title={
            confirmation.type === "save"
              ? "Salvar alterações?"
              : confirmation.nextDisabled
                ? "Desativar registro?"
                : "Ativar registro?"
          }
          size="small"
        >
          <div className={styles.confirmBody}>
            <p className={styles.confirmText}>
              {confirmation.type === "save"
                ? `As alterações da linha ${confirmation.rowKey} serão salvas.`
                : confirmation.nextDisabled
                  ? `O registro ${confirmation.rowKey} ficará desabilitado até ser reativado.`
                  : `O registro ${confirmation.rowKey} voltará a ficar ativo.`}
            </p>
            <div className={styles.confirmActions}>
              <Button variant="neutral" outlined label="Cancelar" onPress={() => setConfirmation(null)} />
              <Button variant="primary" label="Confirmar" onPress={confirmAction} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
