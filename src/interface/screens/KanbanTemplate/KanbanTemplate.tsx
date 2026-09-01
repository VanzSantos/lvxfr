import { useMemo, useState } from "react";
import { KanbanBoard, type KanbanColumn, type KanbanMoveEvent, type KanbanTicket } from "../../../components/KanbanBoard/KanbanBoard";
import { Button } from "../../../components/Button/Button";
import { Popover } from "../../../components/Popover/Popover";
import { Select } from "../../../components/Select/Select";
import { Badge } from "../../../components/Badge/Badge";
import { Chip } from "../../../components/Chip/Chip";
import { Icon } from "../../../components/Icon/Icon";
import type { TicketPriority } from "../../../components/TicketCard/TicketCard";
import styles from "./KanbanTemplate.module.css";

const PRIORITY_LABEL: Record<TicketPriority, string> = {
  atrasado: "Atrasado",
  urgente: "Urgente",
  atencao: "Atenção",
  "no-prazo": "No prazo",
};

const PRIORITY_OPTIONS = Object.entries(PRIORITY_LABEL).map(([value, label]) => ({ value, label }));

const DEADLINE_OPTIONS = [
  { value: "atrasados", label: "Atrasados" },
  { value: "hoje", label: "Vence hoje" },
  { value: "dias", label: "Em dias (2-5 dias)" },
];

const INITIAL_COLUMNS: KanbanColumn[] = [
  {
    id: "novos",
    title: "Novos",
    tickets: [
      {
        id: "t1",
        title: "Protocolo #33561420",
        priority: "atrasado",
        deadlineLabel: "Atrasado há 3 dias",
        metadata: [{ label: "Solicitante", value: "João Silva" }],
        assignee: { name: "Maria Souza" },
        enabled: true,
      },
      {
        id: "t2",
        title: "Protocolo #33561421",
        priority: "urgente",
        deadlineLabel: "Vence hoje",
        assignee: { name: "Pedro Alves" },
        enabled: true,
      },
      {
        id: "t5",
        title: "Protocolo #33561424",
        priority: "no-prazo",
        deadlineLabel: "5 dias",
        assignee: { name: "Maria Souza" },
        enabled: true,
      },
    ],
  },
  {
    id: "andamento",
    title: "Em andamento",
    tickets: [
      {
        id: "t3",
        title: "Protocolo #33561422",
        priority: "atencao",
        deadlineLabel: "2 dias",
        metadata: [{ label: "Tipo", value: "Reajuste de contrato" }],
        assignee: { name: "Pedro Alves" },
        enabled: true,
      },
    ],
  },
  {
    id: "concluidos",
    title: "Concluídos",
    tickets: [{ id: "t4", title: "Protocolo #33561423", priority: "no-prazo", assignee: { name: "Ana Lima" }, enabled: true }],
  },
];

interface KanbanFilters {
  priorities: string[];
  deadline: string;
  assignee: string;
}

const EMPTY_FILTERS: KanbanFilters = { priorities: [], deadline: "", assignee: "" };

function matchesDeadline(ticket: KanbanTicket, preset: string): boolean {
  if (!preset) return true;
  const label = (ticket.deadlineLabel ?? "").toLowerCase();
  if (preset === "atrasados") return label.includes("atrasado");
  if (preset === "hoje") return label.includes("hoje");
  if (preset === "dias") return /\d+\s*dias?/.test(label) && !label.includes("atrasado");
  return true;
}

interface KanbanTemplateProps {
  embedded?: boolean;
}

export function KanbanTemplate({ embedded = false }: KanbanTemplateProps) {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [filters, setFilters] = useState<KanbanFilters>(EMPTY_FILTERS);
  const [draftFilters, setDraftFilters] = useState<KanbanFilters>(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  const assigneeOptions = useMemo(() => {
    const names = new Set<string>();
    columns.forEach((c) => c.tickets.forEach((t) => t.assignee && names.add(t.assignee.name)));
    return Array.from(names).map((name) => ({ value: name, label: name }));
  }, [columns]);

  const filteredColumns = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      tickets: column.tickets.filter((ticket) => {
        if (filters.priorities.length > 0 && !filters.priorities.includes(ticket.priority)) return false;
        if (!matchesDeadline(ticket, filters.deadline)) return false;
        if (filters.assignee && ticket.assignee?.name !== filters.assignee) return false;
        return true;
      }),
    }));
  }, [columns, filters]);

  const activeFilterCount =
    filters.priorities.length + (filters.deadline ? 1 : 0) + (filters.assignee ? 1 : 0);

  function moveTicket({ ticketId, fromColumnId, toColumnId, toIndex }: KanbanMoveEvent) {
    setColumns((current) => {
      const source = current.find((c) => c.id === fromColumnId);
      const ticket = source?.tickets.find((t) => t.id === ticketId);
      if (!ticket) return current;
      return current.map((column) => {
        if (column.id === fromColumnId && fromColumnId !== toColumnId) {
          return { ...column, tickets: column.tickets.filter((t) => t.id !== ticketId) };
        }
        if (column.id === toColumnId) {
          const withoutTicket = column.tickets.filter((t) => t.id !== ticketId);
          const next = [...withoutTicket];
          next.splice(toIndex, 0, ticket);
          return { ...column, tickets: next };
        }
        return column;
      });
    });
  }

  function openFilterPopover(open: boolean) {
    if (open) setDraftFilters(filters);
    setFilterOpen(open);
  }

  function applyFilters() {
    setFilters(draftFilters);
    setFilterOpen(false);
  }

  function clearFilters() {
    setDraftFilters(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    setFilterOpen(false);
  }

  return (
    <div className={embedded ? styles.pageEmbedded : styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Fila de tickets</h1>
        <div className={styles.headerActions}>
          <Button variant="primary" label="Novo card" onPress={() => {}} />
          <Popover
            role="dialog"
            placement="bottom-end"
            accessibleLabel="Filtrar tickets"
            open={filterOpen}
            onOpenChange={openFilterPopover}
            content={
              <div className={styles.filterPanel}>
                <Select
                  label="Status"
                  multiple
                  options={PRIORITY_OPTIONS}
                  value={draftFilters.priorities}
                  onChange={(v) => setDraftFilters((f) => ({ ...f, priorities: v }))}
                  placeholder="Todos os status"
                />
                <Select
                  label="Prazo"
                  options={DEADLINE_OPTIONS}
                  value={draftFilters.deadline}
                  onChange={(v) => setDraftFilters((f) => ({ ...f, deadline: v }))}
                  placeholder="Qualquer prazo"
                />
                <Select
                  label="Responsável"
                  options={assigneeOptions}
                  value={draftFilters.assignee}
                  onChange={(v) => setDraftFilters((f) => ({ ...f, assignee: v }))}
                  placeholder="Qualquer responsável"
                />
                <div className={styles.filterActions}>
                  <Button variant="link" label="Limpar filtros" onPress={clearFilters} />
                  <Button variant="primary" label="Aplicar" onPress={applyFilters} />
                </div>
              </div>
            }
          >
            <button type="button" className={styles.filterTrigger}>
              <Icon name="funnel" size="small" color="var(--icone-secundario)" decorative />
              Filtrar
              {activeFilterCount > 0 && (
                <span className={styles.filterBadge}>
                  <Badge variant="info" count={activeFilterCount} />
                </span>
              )}
            </button>
          </Popover>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className={styles.activeFilters}>
          {filters.priorities.map((p) => (
            <Chip
              key={p}
              label={`Status: ${PRIORITY_LABEL[p as TicketPriority]}`}
              removable
              onRemove={() => setFilters((f) => ({ ...f, priorities: f.priorities.filter((x) => x !== p) }))}
            />
          ))}
          {filters.deadline && (
            <Chip
              label={`Prazo: ${DEADLINE_OPTIONS.find((o) => o.value === filters.deadline)?.label}`}
              removable
              onRemove={() => setFilters((f) => ({ ...f, deadline: "" }))}
            />
          )}
          {filters.assignee && (
            <Chip
              label={`Responsável: ${filters.assignee}`}
              removable
              onRemove={() => setFilters((f) => ({ ...f, assignee: "" }))}
            />
          )}
          <Button variant="link" label="Limpar tudo" onPress={clearFilters} />
        </div>
      )}

      <div className={styles.boardArea}>
        <KanbanBoard columns={filteredColumns} onMoveTicket={moveTicket} onEdit={() => {}} onDelete={() => {}} />
      </div>
    </div>
  );
}
