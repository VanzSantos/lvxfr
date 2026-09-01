import { useState } from "react";
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
} from "@floating-ui/react";
import { Icon, type IconName } from "../Icon/Icon";
import { Link } from "../Link/Link";
import styles from "./Breadcrumb.module.css";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Ícone antes do label do primeiro item (ex.: 'house'). Dev escolhe qual — nenhum ícone fixo por padrão. */
  firstItemIcon?: IconName;
  /** A partir de quantos items a trilha colapsa os do meio atrás de reticências clicáveis. Default 3 (colapsa com 4+). */
  collapseThreshold?: number;
}

function EllipsisMenu({ items }: { items: BreadcrumbItem[] }) {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    middleware: [offset(4), flip(), shift({ padding: 8 })],
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "menu" });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  return (
    <>
      <button
        type="button"
        ref={refs.setReference}
        {...getReferenceProps()}
        className={styles.ellipsisButton}
        aria-label="Mostrar caminhos intermediários"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Icon name="dots-three" size="small" color="var(--icone-secundario)" decorative />
      </button>
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={styles.menu}
          >
            {items.map((item, index) => (
              <Link key={`${item.label}-${index}`} href={item.href!} label={item.label} />
            ))}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}

export function Breadcrumb({ items, firstItemIcon, collapseThreshold = 3 }: BreadcrumbProps) {
  const lastIndex = items.length - 1;

  items.forEach((item, index) => {
    if (index !== lastIndex && !item.href) {
      throw new Error(
        `Breadcrumb: item "${item.label}" precisa de href — só o último item pode ficar sem.`
      );
    }
  });

  const isCollapsed = items.length > collapseThreshold;
  // Colapsado: primeiro item + reticências (itens do meio) + últimos 2 (pai imediato + atual).
  const hiddenItems = isCollapsed ? items.slice(1, items.length - 2) : [];
  const visibleTailStart = isCollapsed ? items.length - 2 : 1;

  function renderItem(item: BreadcrumbItem, index: number) {
    const isLast = index === lastIndex;
    const isFirst = index === 0;
    return (
      <li key={`${item.label}-${index}`} className={styles.item}>
        {isLast ? (
          <span className={styles.current} aria-current="page">
            {item.label}
          </span>
        ) : (
          <Link href={item.href!} label={item.label} leftIcon={isFirst ? firstItemIcon : undefined} />
        )}
        {!isLast && <Icon name="caret-right" size="small" color="var(--icone-secundario)" decorative />}
      </li>
    );
  }

  return (
    <nav aria-label="trilha de navegação" className={styles.nav}>
      <ol className={styles.list}>
        {renderItem(items[0], 0)}
        {isCollapsed && (
          <li className={styles.item}>
            <EllipsisMenu items={hiddenItems} />
            <Icon name="caret-right" size="small" color="var(--icone-secundario)" decorative />
          </li>
        )}
        {items.slice(visibleTailStart).map((item, offsetIndex) => renderItem(item, visibleTailStart + offsetIndex))}
      </ol>
    </nav>
  );
}
