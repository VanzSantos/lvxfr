import { useState, type ReactNode } from "react";
import { Link } from "../Link/Link";
import { Icon, type IconName } from "../Icon/Icon";
import { Drawer } from "../Drawer/Drawer";
import styles from "./SideNav.module.css";

export interface SideNavItem {
  key: string;
  label: string;
  href?: string;
  icon?: IconName;
  active?: boolean;
  children?: SideNavItem[];
}

export type SideNavWidth = "small" | "medium" | "large";

export interface SideNavProps {
  items: SideNavItem[];
  openKeys?: string[];
  onOpenKeysChange?: (openKeys: string[]) => void;
  accessibleLabel?: string;
  width?: SideNavWidth;
  header?: ReactNode;
  /** Conteúdo mostrado no TOPO do trilho recolhido (ex.: só o ícone da marca,
      sem o nome por extenso) — omitido = topo do trilho some por completo
      (comportamento anterior). Só tem efeito com collapsed=true; no painel
      expandido/overlay, `header` (o normal) que aparece. Mesmo racional de
      footer/footerCollapsed logo abaixo. */
  headerCollapsed?: ReactNode;
  footer?: ReactNode;
  /** Conteúdo mostrado no rodapé do TRILHO recolhido (ex.: só o Avatar do
      cartão de usuário, sem nome/e-mail/chevron) — omitido = rodapé some por
      completo no trilho (comportamento anterior). Só tem efeito com
      collapsed=true; no painel expandido/overlay, `footer` (o normal) que
      aparece. */
  footerCollapsed?: ReactNode;
  /** true = renderiza como trilho só de ícones (64px), painel completo abre por
      cima do conteúdo ao passar o mouse (ver onCollapsedChange). Omitido =
      sempre expandido, sem trilho nem botão de recolher (comportamento
      anterior, sem mudança). */
  collapsed?: boolean;
  /** Presença desta prop é o que ATIVA o botão de recolher/expandir — sem ela,
      collapsed é ignorado e o SideNav nunca mostra o botão (mesmo racional de
      actionLabel/onAction em empty-state.contract.json: as duas metades de um
      recurso opcional só existem juntas). */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Estado controlado (opcional) do Drawer mobile (abaixo de 768px). Ausente
      = comportamento original: SideNav renderiza seu PRÓPRIO botão de
      hambúrguer, com estado interno. Presente (sempre acompanhado de
      onMobileOpenChange) = o hambúrguer embutido PARA de renderizar — o
      consumidor assume o gatilho (ex.: um botão próprio dentro do header da
      página), chamando onMobileOpenChange(true) pra abrir; o Drawer em si
      (a árvore de navegação) continua sendo renderizado pelo SideNav, só o
      BOTÃO que muda de dono. Mesmo racional de controlled/uncontrolled já
      usado em popover.contract.json. */
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  /** Conteúdo alternativo pro rodapé (ex.: User Card), só dentro do DRAWER
      MOBILE — quando presente, substitui TANTO `header` quanto `footer`
      nesse contexto específico: `header` para de aparecer, e footerMobile
      renderiza no TOPO (antes da árvore de itens), não embaixo. Omitido =
      comportamento original do Drawer mobile (header no topo se presente,
      footer embaixo se presente, igual ao painel expandido). Não tem efeito
      nenhum no painel expandido/overlay (desktop) — header/footer normais
      continuam intocados ali. Pensado pro caso de um consumidor querer um
      rodapé com apresentação DIFERENTE no mobile (ex.: um collapse inline
      em vez do Popover usado no desktop) sem duplicar a árvore/Drawer. */
  footerMobile?: ReactNode;
}

const MAX_DEPTH = 4;

function validateItems(items: SideNavItem[], depth: number) {
  if (depth > MAX_DEPTH) {
    throw new Error(`SideNav: items não pode passar de ${MAX_DEPTH} níveis de profundidade (contratos/side-nav.contract.json, forbidden).`);
  }
  for (const item of items) {
    if (!item.key) {
      throw new Error(`SideNav: item "${item.label}" precisa de key (contratos/side-nav.contract.json, forbidden).`);
    }
    if (!item.href && !item.children) {
      throw new Error(`SideNav: item "${item.label}" precisa de href ou children (contratos/side-nav.contract.json, forbidden).`);
    }
    if (item.children) validateItems(item.children, depth + 1);
  }
}


interface TreeProps {
  items: SideNavItem[];
  depth: number;
  openKeys: string[];
  onOpenKeysChange: (openKeys: string[]) => void;
}

/** Árvore recursiva — item-folha é Link, item com children vira um botão
    expansível (mesmo padrão exato do Accordion) com os filhos indentados um
    passo a mais por nível (contratos/side-nav.contract.json, anatomy). */
function SideNavTree({ items, depth, openKeys, onOpenKeysChange }: TreeProps) {
  function toggle(key: string, isOpen: boolean) {
    onOpenKeysChange(isOpen ? openKeys.filter((k) => k !== key) : [...openKeys, key]);
  }

  return (
    <ul className={styles.list} style={{ paddingLeft: depth > 1 ? "var(--espaco-m)" : 0 }}>
      {items.map((item) => {
        if (item.children) {
          const isOpen = openKeys.includes(item.key);
          const headerId = `sidenav-${item.key}-header`;
          const panelId = `sidenav-${item.key}-panel`;

          return (
            <li key={item.key} className={styles.item}>
              <button
                type="button"
                id={headerId}
                className={styles.groupHeader}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.key, isOpen)}
              >
                <span className={styles.groupLabel}>
                  {item.icon && <Icon name={item.icon} size="small" color="var(--icone-secundario)" decorative />}
                  {item.label}
                </span>
                <span className={isOpen ? styles.caretOpen : styles.caret}>
                  <Icon name="caret-down" size="small" color="var(--icone-secundario)" decorative />
                </span>
              </button>
              {isOpen && (
                <div id={panelId} role="region" aria-labelledby={headerId}>
                  <SideNavTree
                    items={item.children}
                    depth={depth + 1}
                    openKeys={openKeys}
                    onOpenKeysChange={onOpenKeysChange}
                  />
                </div>
              )}
            </li>
          );
        }

        return (
          <li key={item.key} className={styles.item}>
            <Link href={item.href!} label={item.label} leftIcon={item.icon} current={item.active} />
          </li>
        );
      })}
    </ul>
  );
}

export function SideNav({
  items,
  openKeys = [],
  onOpenKeysChange = () => {},
  accessibleLabel = "Navegação lateral",
  width = "medium",
  header,
  headerCollapsed,
  footer,
  footerCollapsed,
  collapsed = false,
  onCollapsedChange,
  mobileOpen: mobileOpenProp,
  onMobileOpenChange,
  footerMobile,
}: SideNavProps) {
  validateItems(items, 1);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const mobileControlled = onMobileOpenChange !== undefined;
  const mobileOpen = mobileControlled ? mobileOpenProp! : internalMobileOpen;
  const setMobileOpen = mobileControlled ? onMobileOpenChange! : setInternalMobileOpen;
  const [hovering, setHovering] = useState(false);
  const canCollapse = Boolean(onCollapsedChange);

  const toggleButton = canCollapse && (
    <button
      type="button"
      className={styles.collapseToggle}
      aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
      onClick={() => onCollapsedChange!(!collapsed)}
    >
      <Icon name={collapsed ? "caret-right" : "caret-left"} size="small" color="var(--icone-secundario)" decorative />
    </button>
  );

  const bodyAndFooter = (
    <>
      <div className={styles.body}>
        <SideNavTree items={items} depth={1} openKeys={openKeys} onOpenKeysChange={onOpenKeysChange} />
      </div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </>
  );

  // AJUSTADO a pedido do usuário — o botão de recolher/expandir fica na MESMA
  // linha do header, à direita (não numa linha própria acima). header+toggle
  // só convivem no painel expandido/overlay; dentro do Drawer mobile o header
  // aparece sozinho (recolher/expandir não é um conceito mobile — ver
  // decisions do contrato).
  const headerRow = (header || toggleButton) && (
    <div className={styles.header}>
      <div className={styles.headerRow}>
        {header}
        {toggleButton}
      </div>
    </div>
  );

  const mobileTrigger = (
    <>
      {/* AJUSTADO a pedido do usuário — o botão de hambúrguer embutido só
          renderiza no modo NÃO controlado. Quando o consumidor assume o
          controle (mobileOpen/onMobileOpenChange), ele é responsável por
          desenhar/posicionar o próprio gatilho (ex.: dentro do header da
          página) — SideNav continua dono só do Drawer/árvore de navegação. */}
      {!mobileControlled && (
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

      {/* AJUSTADO a pedido do usuário — padding menor no Drawer mobile
          (padding='small' em vez do padrão 'large' do próprio Drawer) — só
          afeta o menu mobile, o painel expandido/overlay usa o padding
          próprio de .header/.body/.footer em SideNav.module.css,
          intocado. */}
      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} accessibleLabel={accessibleLabel} size="small" padding="small">
        {footerMobile ? (
          <>
            <div className={styles.footerMobile}>{footerMobile}</div>
            <div className={styles.body}>
              <SideNavTree items={items} depth={1} openKeys={openKeys} onOpenKeysChange={onOpenKeysChange} />
            </div>
          </>
        ) : (
          <>
            {header && <div className={styles.header}>{header}</div>}
            {bodyAndFooter}
          </>
        )}
      </Drawer>
    </>
  );

  if (collapsed && canCollapse) {
    return (
      <>
        <div
          className={styles.collapsedWrapper}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHovering(false);
          }}
        >
          {/* AJUSTADO a pedido do usuário — sem o botão de recolher/expandir no
              trilho em repouso (só ícones, sem interação de recolhimento
              visível). O botão só aparece dentro do headerRow do painel
              completo, que só existe quando `hovering` (ver abaixo) — ou
              seja, a única forma de expandir/pinar o SideNav é passar o
              mouse por cima primeiro. */}
          <nav aria-label={accessibleLabel} className={styles.rail}>
            {/* AJUSTADO a pedido do usuário — headerCollapsed (tipicamente só
                o ícone da marca, sem o nome) fica fixado no topo do trilho —
                mesmo racional de footerCollapsed, só que no topo em vez do
                rodapé. */}
            {headerCollapsed && <div className={styles.railHeader}>{headerCollapsed}</div>}
            <ul className={styles.railList}>
              {/* Só o 1º nível vira ícone do trilho (mesmo padrão de "mini
                  sidebar" já usado em VS Code/admin dashboards) — item com
                  filhos não tenta se achatar numa lista de folhas (isso
                  faria ícones de itens sem icon próprio ficarem vazios/sem
                  sentido); passar o mouse já revela a árvore completa,
                  incluindo os filhos, no overlay (contratos/side-nav.contract.json,
                  decisions). */}
              {items.map((item) =>
                item.children ? (
                  <li key={item.key}>
                    <button type="button" className={styles.railItem} aria-label={item.label}>
                      {item.icon && <Icon name={item.icon} size="medium" color="var(--texto-primario)" decorative />}
                    </button>
                  </li>
                ) : (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      className={styles.railItem}
                      aria-label={item.label}
                      aria-current={item.active ? "page" : undefined}
                    >
                      {/* Cor sempre texto-primario aqui — hover/ativo (verde +
                          branco) é resolvido via CSS (.railItem:hover/[aria-current],
                          mesmo mecanismo de override de fill em SideNav.module.css). */}
                      {item.icon && <Icon name={item.icon} size="medium" color="var(--texto-primario)" decorative />}
                    </a>
                  </li>
                )
              )}
            </ul>

            {/* AJUSTADO a pedido do usuário — no trilho recolhido, o rodapé
                normal (footer) some, mas footerCollapsed (tipicamente só o
                Avatar do cartão de usuário, sem nome/e-mail/chevron) continua
                aparecendo, fixado embaixo do trilho. */}
            {footerCollapsed && <div className={styles.railFooter}>{footerCollapsed}</div>}
          </nav>

          {hovering && (
            <nav aria-label={accessibleLabel} className={`${styles.nav} ${styles[width]} ${styles.overlay}`}>
              {headerRow}
              {bodyAndFooter}
            </nav>
          )}
        </div>

        {mobileTrigger}
      </>
    );
  }

  return (
    <>
      <nav aria-label={accessibleLabel} className={`${styles.nav} ${styles[width]}`}>
        {headerRow}
        {bodyAndFooter}
      </nav>

      {mobileTrigger}
    </>
  );
}
