import { useMemo, useState } from "react";
import { Button } from "../Button/Button";
import { Badge } from "../Badge/Badge";
import { Drawer } from "../Drawer/Drawer";
import { Switch } from "../Switch/Switch";
import { Checkbox } from "../Checkbox/Checkbox";
import { EmptyState } from "../EmptyState/EmptyState";
import { ConfirmDialog } from "../ConfirmDialog/ConfirmDialog";
import styles from "./NotificationCenter.module.css";

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  read: boolean;
}

export interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteMany: (ids: string[]) => void;
  accessibleLabel?: string;
}

/** Botão-gatilho (Button variant="link" iconOnly, ícone "bell", Badge de
    contagem de não lidas sobreposto ao ícone) + Drawer na direita com a
    lista completa — componente auto-contido, o consumidor só passa os
    dados (notifications) e os callbacks de mutação. Estado de UI (drawer
    aberto, filtro "apenas não lidas", seleção, qual confirmação está
    pendente) é 100% interno — mesmo racional de Datatable (sort/filtro/
    paginação internos, dados e mutações sempre controlados de fora via
    callback). Ver contratos/notification-center.contract.json. */
export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteMany,
  accessibleLabel = "Notificações",
}: NotificationCenterProps) {
  const [open, setOpen] = useState(false);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const visible = useMemo(() => (onlyUnread ? notifications.filter((n) => !n.read) : notifications), [notifications, onlyUnread]);
  const allVisibleSelected = visible.length > 0 && visible.every((item) => selected.has(item.id));

  function toggleSelected(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleSelectAllVisible() {
    setSelected(allVisibleSelected ? new Set() : new Set(visible.map((item) => item.id)));
  }

  function markSelectedAsRead() {
    selected.forEach((id) => onMarkAsRead(id));
  }

  function closeDrawer() {
    setOpen(false);
    setSelected(new Set());
  }

  function runConfirmedDelete() {
    onDeleteMany([...selected]);
    setSelected(new Set());
    setConfirmDelete(false);
  }

  return (
    <>
      {/* AJUSTADO a pedido do usuário — o Badge precisa SOBREPOR o ícone do
          sino (não flutuar no canto da área de clique maior). O wrapper
          .trigger (40x40, área de clique) é diferente do .iconBox (do
          tamanho do próprio ícone) — o Badge é posicionado relativo ao
          .iconBox, então fica ancorado exatamente no canto do sino, não no
          canto da área de clique inteira. */}
      <span className={styles.trigger} onClick={() => setOpen(true)}>
        <span className={styles.iconBox}>
          <Button
            variant="link"
            iconOnly
            leftIcon="bell"
            accessibleLabel={accessibleLabel}
            onPress={() => setOpen(true)}
          />
          {unreadCount > 0 && <Badge variant="error" count={unreadCount} position="top-right" />}
        </span>
      </span>

      <Drawer open={open} onClose={closeDrawer} title="Notificações" accessibleLabel={accessibleLabel} size="medium">
        <div className={styles.panel}>
          <Switch label="Exibir apenas não lidas" checked={onlyUnread} onChange={setOnlyUnread} size="small" />

          {selected.size === 0 ? (
            unreadCount > 0 && (
              <div className={styles.bulkActionsRow}>
                <Button variant="link" label="Marcar todas como lidas" onPress={onMarkAllAsRead} />
              </div>
            )
          ) : (
            <div className={styles.bulkActionsRow}>
              <Button
                variant="link"
                label={allVisibleSelected ? "Desmarcar todos" : "Selecionar todos"}
                onPress={toggleSelectAllVisible}
              />
              <Button variant="link" label="Marcar como lidas" onPress={markSelectedAsRead} />
            </div>
          )}

          {selected.size > 0 && (
            <div className={styles.selectionBar}>
              <Button
                variant="destructive"
                label={`Apagar ${selected.size} selecionada${selected.size > 1 ? "s" : ""}`}
                onPress={() => setConfirmDelete(true)}
                fullWidth
              />
            </div>
          )}

          {visible.length === 0 ? (
            <EmptyState
              icon="bell"
              title={onlyUnread ? "Nenhuma notificação não lida" : "Nenhuma notificação"}
              description={onlyUnread ? "Você está em dia — não há mensagens não lidas." : "Novas notificações vão aparecer aqui."}
            />
          ) : (
            <ul className={styles.list}>
              {visible.map((item) => (
                <li key={item.id} className={styles.item}>
                  <Checkbox
                    checked={selected.has(item.id)}
                    onChange={(checked) => toggleSelected(item.id, checked)}
                    label={`Selecionar "${item.title}"`}
                    hideLabel
                  />

                  <div className={styles.content}>
                    <span className={item.read ? styles.titleRead : styles.titleUnread}>{item.title}</span>
                    {item.description && <span className={styles.description}>{item.description}</span>}
                    {item.timestamp && <span className={styles.timestamp}>{item.timestamp}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Drawer>

      <ConfirmDialog
        open={confirmDelete}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={runConfirmedDelete}
        title={`Excluir ${selected.size} notificaç${selected.size > 1 ? "ões" : "ão"} selecionada${selected.size > 1 ? "s" : ""}?`}
        description="Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        confirmVariant="destructive"
      />
    </>
  );
}
