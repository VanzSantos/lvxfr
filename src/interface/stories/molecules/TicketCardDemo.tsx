import { useState } from "react";
import { TicketCard } from "../../../components/TicketCard/TicketCard";
import styles from "../Demo.module.css";

export function TicketCardDemo() {
  const [enabled, setEnabled] = useState(true);
  const [log, setLog] = useState<string[]>([]);

  function registrar(acao: string) {
    setLog((current) => [acao, ...current].slice(0, 5));
  }

  return (
    <div className={styles.column}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Todas as prioridades, com prazo, metadado, responsável e menu de ações (···)</span>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ width: 260 }}>
            <TicketCard
              title="Protocolo #33561420"
              priority="atrasado"
              deadlineLabel="Atrasado há 3 dias"
              metadata={[
                { label: "Solicitante", value: "João Silva" },
                { label: "Tipo", value: "Cadastro de prestador" },
              ]}
              assignee={{ name: "Maria Souza" }}
              enabled={enabled}
              onDuplicate={() => registrar("Duplicar")}
              onToggleEnabled={() => {
                setEnabled((v) => !v);
                registrar(enabled ? "Desabilitar" : "Habilitar");
              }}
              onEdit={() => registrar("Editar")}
              onViewDetails={() => registrar("Ver detalhes")}
              onDelete={() => registrar("Apagar")}
            />
          </div>
          <div style={{ width: 260 }}>
            <TicketCard
              title="Protocolo #33561421"
              priority="urgente"
              deadlineLabel="Vence hoje"
              metadata={[{ label: "Solicitante", value: "Ana Lima" }]}
              assignee={{ name: "Pedro Alves" }}
            />
          </div>
          <div style={{ width: 260 }}>
            <TicketCard
              title="Protocolo #33561422"
              priority="atencao"
              deadlineLabel="2 dias"
              metadata={[{ label: "Tipo", value: "Reajuste de contrato" }]}
            />
          </div>
          <div style={{ width: 260 }}>
            <TicketCard title="Protocolo #33561423" priority="no-prazo" deadlineLabel="5 dias" />
          </div>
        </div>
        {log.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 13, color: "var(--texto-secundario)" }}>
            Últimas ações: {log.join(", ")}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Mínimo — só título e prioridade (sem menu, nenhum callback fornecido)</span>
        <div style={{ width: 260 }}>
          <TicketCard title="Protocolo #33561430" priority="no-prazo" />
        </div>
      </div>
    </div>
  );
}
