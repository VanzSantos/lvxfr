import { useState, type ReactNode } from "react";
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";
import { Link } from "../Link/Link";
import { Icon } from "../Icon/Icon";
import { Drawer } from "../Drawer/Drawer";
import styles from "./NavBar.module.css";

export interface NavBarItem {
  label: string;
  href?: string;
  active?: boolean;
  children?: NavBarItem[];
}

export interface NavBarProps {
  brand?: ReactNode;
  items: NavBarItem[];
  actions?: ReactNode;
  accessibleLabel?: string;
  sticky?: boolean;
}

const MAX_DEPTH = 4;

function validateItems(items: NavBarItem[], depth: number) {
  if (depth > MAX_DEPTH) {
    throw new Error(`NavBar: items não pode passar de ${MAX_DEPTH} níveis de profundidade (contratos/navbar.contract.json, forbidden).`);
  }
  for (const item of items) {
    if (!item.href && !item.children) {
      throw new Error(`NavBar: item "${item.label}" precisa de href ou children (contratos/navbar.contract.json, forbidden).`);
    }
    if (item.children) validateItems(item.children, depth + 1);
  }
}

/** Item com filhos — dropdown ancorado (@floating-ui/react), nível 1 abre
    abaixo do gatilho, níveis 2+ abrem em cascata à direita do nível anterior
    (contratos/navbar.contract.json, decisions). */
function NavBarDropdown({ item, depth }: { item: NavBarItem; depth: number }) {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: depth === 1 ? "bottom-start" : "right-start",
    whileElementsMounted: autoUpdate,
    middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "dialog" });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        className={`${styles.itemButton} ${item.active ? styles.active : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        {...getReferenceProps()}
      >
        {item.label}
        <Icon name="caret-down" size="small" color="var(--icone-secundario)" decorative />
      </button>

      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className={styles.dropdown}
              aria-label={item.label}
              {...getFloatingProps()}
            >
              <ul className={styles.dropdownList}>
                {item.children!.map((child) => (
                  <li key={child.label} className={styles.dropdownItem}>
                    {child.children ? (
                      <NavBarDropdown item={child} depth={depth + 1} />
                    ) : (
                      <Link href={child.href!} label={child.label} current={child.active} />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}

function NavBarItemsList({ items, vertical }: { items: NavBarItem[]; vertical?: boolean }) {
  return (
    <ul className={vertical ? styles.mobileList : styles.list}>
      {items.map((item) => (
        <li key={item.label} className={styles.item}>
          {item.children ? (
            vertical ? (
              <MobileGroup item={item} />
            ) : (
              <NavBarDropdown item={item} depth={1} />
            )
          ) : (
            <Link href={item.href!} label={item.label} current={item.active} />
          )}
        </li>
      ))}
    </ul>
  );
}

/** Dentro do Drawer mobile, item com filhos vira um grupo expansível em
    árvore indentada (mesmo padrão do SideNav) em vez de dropdown em cascata
    — cascata não cabe num painel estreito (contratos/navbar.contract.json,
    anatomy). */
function MobileGroup({ item }: { item: NavBarItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.mobileGroup}>
      <button
        type="button"
        className={styles.mobileGroupHeader}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {item.label}
        <span className={open ? styles.caretOpen : ""}>
          <Icon name="caret-down" size="small" color="var(--icone-secundario)" decorative />
        </span>
      </button>
      {open && (
        <div className={styles.mobileGroupPanel}>
          <NavBarItemsList items={item.children!} vertical />
        </div>
      )}
    </div>
  );
}

export function NavBar({
  brand,
  items,
  actions,
  accessibleLabel = "Navegação principal",
  sticky = false,
}: NavBarProps) {
  validateItems(items, 1);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav aria-label={accessibleLabel} className={`${styles.nav} ${sticky ? styles.sticky : ""}`}>
      {brand && <div className={styles.brand}>{brand}</div>}

      {items.length > 0 && (
        <div className={styles.desktopList}>
          <NavBarItemsList items={items} />
        </div>
      )}

      {items.length > 0 && (
        <button
          type="button"
          className={styles.hamburger}
          aria-label="Abrir menu de navegação"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          <Icon name="list" size="medium" color="var(--icone-secundario)" decorative />
        </button>
      )}

      {actions && <div className={styles.actions}>{actions}</div>}

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        accessibleLabel={accessibleLabel}
        size="small"
      >
        <NavBarItemsList items={items} vertical />
      </Drawer>
    </nav>
  );
}
