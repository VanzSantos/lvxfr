import { useState } from "react";
import { KanbanBoard, type KanbanColumn, type KanbanMoveEvent } from "../../../components/KanbanBoard/KanbanBoard";
import styles from "../Demo.module.css";

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
        enabled: true,
      },
    ],
  },
  {
    id: "concluidos",
    title: "Concluídos",
    tickets: [{ id: "t4", title: "Protocolo #33561423", priority: "no-prazo", enabled: true }],
  },
  {
    id: "arquivados",
    title: "Arquivados",
    tickets: [],
  },
];

export function KanbanBoardDemo() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [log, setLog] = useState<string[]>([]);

  function registrar(acao: string) {
    setLog((current) => [acao, ...current].slice(0, 5));
  }

  function toggleEnabled(ticketId: string) {
    setColumns((current) =>
      current.map((column) => ({
        ...column,
        tickets: column.tickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, enabled: !ticket.enabled } : ticket
        ),
      }))
    );
    registrar(`Habilitar/Desabilitar ${ticketId}`);
  }

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
    registrar(`Mover ${ticketId}: ${fromColumnId} → ${toColumnId} (posição ${toIndex})`);
  }

  function deleteTicket(ticketId: string) {
    setColumns((current) =>
      current.map((column) => ({
        ...column,
        tickets: column.tickets.filter((ticket) => ticket.id !== ticketId),
      }))
    );
    registrar(`Apagar ${ticketId}`);
  }

  return (
    <div className={styles.column} style={{ maxWidth: "none" }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Board com 4 colunas (uma vazia), drag-and-drop + ações reais de duplicar/habilitar/editar/ver/apagar</span>
        <div style={{ height: 520, width: "100%" }}>
          <KanbanBoard
            columns={columns}
            onMoveTicket={moveTicket}
            onDuplicate={(id) => registrar(`Duplicar ${id}`)}
            onToggleEnabled={toggleEnabled}
            onEdit={(id) => registrar(`Editar ${id}`)}
            onViewDetails={(id) => registrar(`Ver detalhes ${id}`)}
            onDelete={deleteTicket}
          />
        </div>
        {log.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 13, color: "var(--texto-secundario)" }}>
            Últimas ações: {log.join(", ")}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Board estático — sem onMoveTicket (drag-and-drop desativado, cartões não são arrastáveis)</span>
        <div style={{ height: 400, width: "100%" }}>
          <KanbanBoard columns={INITIAL_COLUMNS} onDuplicate={(id) => registrar(`Duplicar ${id}`)} onEdit={(id) => registrar(`Editar ${id}`)} />
        </div>
      </div>
    </div>
  );
}
