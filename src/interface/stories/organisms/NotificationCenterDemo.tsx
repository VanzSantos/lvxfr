import { useState } from "react";
import { NotificationCenter, type NotificationItem } from "../../../components/NotificationCenter/NotificationCenter";
import styles from "../Demo.module.css";

const NOTIFICATIONS_INICIAIS: NotificationItem[] = [
  { id: "n1", title: "Relatório de agosto disponível", description: "O relatório mensal já pode ser baixado.", timestamp: "há 2 horas", read: false },
  { id: "n2", title: "Novo comentário em Contratos", description: "Ana Souza comentou no contrato #4521.", timestamp: "há 5 horas", read: false },
  { id: "n3", title: "Backup concluído", description: "O backup diário foi concluído com sucesso.", timestamp: "ontem", read: true },
  { id: "n4", title: "Atualização de sistema agendada", description: "Manutenção programada para domingo, 02h.", timestamp: "há 2 dias", read: true },
  { id: "n5", title: "Novo membro na equipe", description: "Bruno Lima entrou na equipe Financeiro.", timestamp: "há 3 dias", read: true },
];

export function NotificationCenterDemo() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS_INICIAIS);
  const [allRead, setAllRead] = useState<NotificationItem[]>(NOTIFICATIONS_INICIAIS.map((n) => ({ ...n, read: true })));
  const [empty, setEmpty] = useState<NotificationItem[]>([]);

  return (
    <div className={styles.column} style={{ maxWidth: 320 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>
          Gatilho (sino + contador de não lidas) — clique pra abrir o Drawer com a lista completa
        </span>
        <div style={{ display: "flex", justifyContent: "center", padding: 16, background: "var(--fundo-secundario)", borderRadius: "var(--raio-pp)" }}>
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={(id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))}
            onMarkAllAsRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
            onDeleteMany={(ids) => {
              const idSet = new Set(ids);
              setNotifications((prev) => prev.filter((n) => !idSet.has(n.id)));
            }}
          />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>
          Estado "filtered-empty" — todas já lidas; abra e ative o filtro "só não lidas" pra ver a
          lista filtrada vazia
        </span>
        <div style={{ display: "flex", justifyContent: "center", padding: 16, background: "var(--fundo-secundario)", borderRadius: "var(--raio-pp)" }}>
          <NotificationCenter
            notifications={allRead}
            onMarkAsRead={(id) => setAllRead((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))}
            onMarkAllAsRead={() => setAllRead((prev) => prev.map((n) => ({ ...n, read: true })))}
            onDeleteMany={(ids) => {
              const idSet = new Set(ids);
              setAllRead((prev) => prev.filter((n) => !idSet.has(n.id)));
            }}
          />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Estado "empty" — lista de notificações vazia desde o início</span>
        <div style={{ display: "flex", justifyContent: "center", padding: 16, background: "var(--fundo-secundario)", borderRadius: "var(--raio-pp)" }}>
          <NotificationCenter
            notifications={empty}
            onMarkAsRead={(id) => setEmpty((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))}
            onMarkAllAsRead={() => setEmpty((prev) => prev.map((n) => ({ ...n, read: true })))}
            onDeleteMany={(ids) => {
              const idSet = new Set(ids);
              setEmpty((prev) => prev.filter((n) => !idSet.has(n.id)));
            }}
          />
        </div>
      </div>
    </div>
  );
}
