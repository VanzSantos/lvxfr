import { useState } from "react";
import { Card } from "../Card/Card";
import { Badge, type BadgeVariant } from "../Badge/Badge";
import { Avatar } from "../Avatar/Avatar";
import { Icon, type IconName } from "../Icon/Icon";
import { Popover } from "../Popover/Popover";
import styles from "./TicketCard.module.css";

export type TicketPriority = "atrasado" | "urgente" | "atencao" | "no-prazo";

export interface TicketMetadataRow {
  label: string;
  value: string;
}

export interface TicketCardProps {
  title: string;
  priority: TicketPriority;
  deadlineLabel?: string;
  metadata?: TicketMetadataRow[];
  assignee?: { name: string; avatarSrc?: string };
  /** Estado atual do ticket — só usado pra decidir o rótulo/ícone do item Habilitar/Desabilitar do menu. */
  enabled?: boolean;
  onDuplicate?: () => void;
  onToggleEnabled?: () => void;
  onEdit?: () => void;
  onViewDetails?: () => void;
  onDelete?: () => void;
}

interface MenuItemDef {
  label: string;
  icon: IconName;
  onSelect: () => void;
  destructive?: boolean;
}

const PRIORITY_VARIANT: Record<TicketPriority, BadgeVariant> = {
  atrasado: "critical",
  urgente: "error",
  atencao: "warning",
  "no-prazo": "success",
};

const PRIORITY_LABEL: Record<TicketPriority, string> = {
  atrasado: "Atrasado",
  urgente: "Urgente",
  atencao: "Atenção",
  "no-prazo": "No prazo",
};

export function TicketCard({
  title,
  priority,
  deadlineLabel,
  metadata,
  assignee,
  enabled = true,
  onDuplicate,
  onToggleEnabled,
  onEdit,
  onViewDetails,
  onDelete,
}: TicketCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const items: MenuItemDef[] = [];
  if (onDuplicate) items.push({ label: "Duplicar", icon: "copy-simple", onSelect: onDuplicate });
  if (onToggleEnabled) {
    items.push({
      label: enabled ? "Desabilitar" : "Habilitar",
      icon: enabled ? "x-circle" : "check-circle",
      onSelect: onToggleEnabled,
    });
  }
  if (onEdit) items.push({ label: "Editar", icon: "pencil-simple", onSelect: onEdit });
  if (onViewDetails) items.push({ label: "Ver detalhes", icon: "eye", onSelect: onViewDetails });
  if (onDelete) items.push({ label: "Apagar", icon: "trash", onSelect: onDelete, destructive: true });

  const hasMenu = items.length > 0;

  return (
    <Card padding="small">
      <div className={styles.content}>
        <div className={styles.header}>
          <Badge variant={PRIORITY_VARIANT[priority]} icon="flag" label={PRIORITY_LABEL[priority]} />
          {hasMenu && (
            <Popover
              role="menu"
              placement="bottom-end"
              accessibleLabel={`Mais opções para ${title}`}
              open={menuOpen}
              onOpenChange={setMenuOpen}
              content={
                <div className={styles.menu}>
                  {items.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className={`${styles.menuItem} ${item.destructive ? styles.menuItemDestructive : ""}`}
                      onClick={() => {
                        setMenuOpen(false);
                        item.onSelect();
                      }}
                    >
                      <Icon
                        name={item.icon}
                        size="small"
                        color={item.destructive ? "var(--texto-erro)" : "var(--icone-secundario)"}
                        decorative
                      />
                      {item.label}
                    </button>
                  ))}
                </div>
              }
            >
              <button
                type="button"
                className={styles.overflowButton}
                aria-label={`Mais opções para ${title}`}
              >
                <Icon name="dots-three" size="small" color="var(--icone-secundario)" decorative />
              </button>
            </Popover>
          )}
        </div>

        <span className={styles.title}>{title}</span>

        {deadlineLabel && (
          <span className={styles.deadline}>
            <Icon name="hourglass" size="small" color="var(--icone-secundario)" decorative />
            {deadlineLabel}
          </span>
        )}

        {metadata && metadata.length > 0 && (
          <div className={styles.metadata}>
            {metadata.map((row, index) => (
              <div key={index} className={styles.metadataRow}>
                <span className={styles.metadataLabel}>{row.label}</span>
                <span className={styles.metadataValue}>{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {assignee && (
          <div className={styles.footer}>
            <Avatar name={assignee.name} src={assignee.avatarSrc} size="small" />
            <span className={styles.assigneeName}>{assignee.name}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
