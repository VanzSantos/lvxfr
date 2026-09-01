import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TicketCard, type TicketPriority, type TicketMetadataRow } from "../TicketCard/TicketCard";
import { Badge } from "../Badge/Badge";
import styles from "./KanbanBoard.module.css";

export interface KanbanTicket {
  id: string;
  title: string;
  priority: TicketPriority;
  deadlineLabel?: string;
  metadata?: TicketMetadataRow[];
  assignee?: { name: string; avatarSrc?: string };
  enabled?: boolean;
}

export interface KanbanColumn {
  id: string;
  title: string;
  tickets: KanbanTicket[];
}

export interface KanbanMoveEvent {
  ticketId: string;
  fromColumnId: string;
  toColumnId: string;
  toIndex: number;
}

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  /** Presença ativa o drag-and-drop (reordenar dentro da coluna e mover entre colunas). Ausência = colunas estáticas, sem nenhum listener de arrastar montado. */
  onMoveTicket?: (event: KanbanMoveEvent) => void;
  onDuplicate?: (ticketId: string) => void;
  onToggleEnabled?: (ticketId: string) => void;
  onEdit?: (ticketId: string) => void;
  onViewDetails?: (ticketId: string) => void;
  onDelete?: (ticketId: string) => void;
}

function findColumnId(cols: KanbanColumn[], id: string): string | undefined {
  if (cols.some((c) => c.id === id)) return id;
  return cols.find((c) => c.tickets.some((t) => t.id === id))?.id;
}

interface TicketCardActionProps {
  onDuplicate?: (ticketId: string) => void;
  onToggleEnabled?: (ticketId: string) => void;
  onEdit?: (ticketId: string) => void;
  onViewDetails?: (ticketId: string) => void;
  onDelete?: (ticketId: string) => void;
}

function renderTicketCard(ticket: KanbanTicket, actions: TicketCardActionProps) {
  return (
    <TicketCard
      title={ticket.title}
      priority={ticket.priority}
      deadlineLabel={ticket.deadlineLabel}
      metadata={ticket.metadata}
      assignee={ticket.assignee}
      enabled={ticket.enabled}
      onDuplicate={actions.onDuplicate ? () => actions.onDuplicate!(ticket.id) : undefined}
      onToggleEnabled={actions.onToggleEnabled ? () => actions.onToggleEnabled!(ticket.id) : undefined}
      onEdit={actions.onEdit ? () => actions.onEdit!(ticket.id) : undefined}
      onViewDetails={actions.onViewDetails ? () => actions.onViewDetails!(ticket.id) : undefined}
      onDelete={actions.onDelete ? () => actions.onDelete!(ticket.id) : undefined}
    />
  );
}

function SortableTicketCard({ ticket, actions }: { ticket: KanbanTicket; actions: TicketCardActionProps }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: ticket.id });

  return (
    <div
      ref={setNodeRef}
      className={styles.dragHandle}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      {...attributes}
      {...listeners}
    >
      {renderTicketCard(ticket, actions)}
    </div>
  );
}

function DroppableColumnBody({ columnId, children }: { columnId: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id: columnId });
  return (
    <div ref={setNodeRef} className={styles.columnBody}>
      {children}
    </div>
  );
}

export function KanbanBoard({
  columns,
  onMoveTicket,
  onDuplicate,
  onToggleEnabled,
  onEdit,
  onViewDetails,
  onDelete,
}: KanbanBoardProps) {
  const draggable = Boolean(onMoveTicket);
  const [localColumns, setLocalColumns] = useState(columns);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sourceColumnRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    setLocalColumns(columns);
  }, [columns]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const actions: TicketCardActionProps = { onDuplicate, onToggleEnabled, onEdit, onViewDetails, onDelete };

  function handleDragStart(event: DragStartEvent) {
    const id = event.active.id as string;
    setActiveId(id);
    sourceColumnRef.current = findColumnId(localColumns, id);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeColumnId = findColumnId(localColumns, active.id as string);
    const overColumnId = findColumnId(localColumns, over.id as string);
    if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) return;

    setLocalColumns((prev) => {
      const activeColumn = prev.find((c) => c.id === activeColumnId)!;
      const overColumn = prev.find((c) => c.id === overColumnId)!;
      const activeIndex = activeColumn.tickets.findIndex((t) => t.id === active.id);
      if (activeIndex === -1) return prev;
      const ticket = activeColumn.tickets[activeIndex];
      const overIndex = overColumn.tickets.findIndex((t) => t.id === over.id);
      const insertAt = overIndex >= 0 ? overIndex : overColumn.tickets.length;

      return prev.map((c) => {
        if (c.id === activeColumnId) return { ...c, tickets: c.tickets.filter((t) => t.id !== active.id) };
        if (c.id === overColumnId) {
          const nextTickets = [...c.tickets];
          nextTickets.splice(insertAt, 0, ticket);
          return { ...c, tickets: nextTickets };
        }
        return c;
      });
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    const fromColumnId = sourceColumnRef.current;
    sourceColumnRef.current = undefined;
    if (!over || !fromColumnId) return;

    const columnId = findColumnId(localColumns, active.id as string);
    if (!columnId) return;
    const column = localColumns.find((c) => c.id === columnId)!;
    const activeIndex = column.tickets.findIndex((t) => t.id === active.id);
    const overId = over.id as string;
    const overIndex = overId === columnId ? column.tickets.length - 1 : column.tickets.findIndex((t) => t.id === overId);

    let finalTickets = column.tickets;
    if (overIndex >= 0 && overIndex !== activeIndex) {
      finalTickets = arrayMove(column.tickets, activeIndex, overIndex);
      const movedColumns = localColumns.map((c) => (c.id === columnId ? { ...c, tickets: finalTickets } : c));
      setLocalColumns(movedColumns);
    }

    const toIndex = finalTickets.findIndex((t) => t.id === active.id);
    onMoveTicket?.({ ticketId: active.id as string, fromColumnId, toColumnId: columnId, toIndex });
  }

  const activeTicket = activeId
    ? localColumns.flatMap((c) => c.tickets).find((t) => t.id === activeId)
    : undefined;

  const board = (
    <div className={styles.board}>
      {localColumns.map((column) => (
        <div key={column.id} className={styles.column}>
          <div className={styles.columnHeader}>
            <span className={styles.columnTitle}>{column.title}</span>
            <Badge variant="neutral" count={column.tickets.length} />
          </div>
          {draggable ? (
            <DroppableColumnBody columnId={column.id}>
              <SortableContext items={column.tickets.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                {column.tickets.length === 0 ? (
                  <span className={styles.emptyLabel}>Nenhum ticket</span>
                ) : (
                  column.tickets.map((ticket) => <SortableTicketCard key={ticket.id} ticket={ticket} actions={actions} />)
                )}
              </SortableContext>
            </DroppableColumnBody>
          ) : (
            <div className={styles.columnBody}>
              {column.tickets.length === 0 ? (
                <span className={styles.emptyLabel}>Nenhum ticket</span>
              ) : (
                column.tickets.map((ticket) => <div key={ticket.id}>{renderTicketCard(ticket, actions)}</div>)
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  if (!draggable) return board;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {board}
      <DragOverlay>{activeTicket ? renderTicketCard(activeTicket, actions) : null}</DragOverlay>
    </DndContext>
  );
}
