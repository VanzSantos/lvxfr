import { useState, type ReactNode } from "react";
import { SideNav, type SideNavItem } from "../../../components/SideNav/SideNav";
import { Avatar } from "../../../components/Avatar/Avatar";
import { UserCard } from "../../../components/UserCard/UserCard";
import { Breadcrumb, type BreadcrumbItem } from "../../../components/Breadcrumb/Breadcrumb";
import { Icon } from "../../../components/Icon/Icon";
import { Popover } from "../../../components/Popover/Popover";
import { NotificationCenter, type NotificationItem } from "../../../components/NotificationCenter/NotificationCenter";
import styles from "./AppShell.module.css";

export type AppShellNavKey = "inicio" | "dashboard" | "kanban" | "crud" | "config";

const NAV_ITEMS: { key: AppShellNavKey; label: string; href: string; icon: SideNavItem["icon"] }[] = [
  { key: "inicio", label: "Início", href: "/", icon: "house" },
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: "desktop" },
  { key: "kanban", label: "Kanban", href: "/kanban", icon: "columns" },
  { key: "crud", label: "Registros", href: "/registros", icon: "receipt" },
  { key: "config", label: "Configurações", href: "/config", icon: "gear" },
];

const NOTIFICATIONS_INICIAIS: NotificationItem[] = [
  { id: "n1", title: "Relatório de agosto disponível", description: "O relatório mensal já pode ser baixado.", timestamp: "há 2 horas", read: false },
  { id: "n2", title: "Novo comentário em Contratos", description: "Ana Souza comentou no contrato #4521.", timestamp: "há 5 horas", read: false },
  { id: "n3", title: "Backup concluído", description: "O backup diário foi concluído com sucesso.", timestamp: "ontem", read: true },
  { id: "n4", title: "Atualização de sistema agendada", description: "Manutenção programada para domingo, 02h.", timestamp: "há 2 dias", read: true },
];

function LogoIcon() {
  return (
    <span
      style={{
        width: 36,
        height: 36,
        borderRadius: "var(--raio-pp)",
        background: "var(--acao-primaria)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon name="sparkle" size="small" color="var(--acao-primaria-texto)" decorative />
    </span>
  );
}

/** Logo completo (ícone + nome) — vai no slot `header` (painel expandido/
    overlay) e na linha de cima do header mobile. `headerCollapsed` usa só o
    ícone (LogoIcon), sem o nome por extenso, já que o trilho recolhido tem
    só 64px de largura. */
function Logo() {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: "var(--espaco-pp)" }}>
      <LogoIcon />
      <strong style={{ fontSize: 16, color: "var(--texto-primario)" }}>LVXFR</strong>
    </span>
  );
}

function MenuRow({ icon, label }: { icon: "user" | "gear" | "arrow-right"; label: string }) {
  return (
    <button type="button" className={styles.menuRow}>
      <Icon name={icon} size="small" color="var(--icone-secundario)" decorative />
      {label}
    </button>
  );
}

/** Identificação do usuário, no rodapé do SideNav (slot `footer`) — UserCard
    dentro de um Popover com o menu de conta. Usado no painel expandido/
    overlay (desktop) — no Drawer mobile quem aparece é ProfileFooterMobile. */
function ProfileFooter() {
  return (
    <Popover
      placement="top-start"
      accessibleLabel="Menu da conta"
      content={
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 200, padding: "var(--espaco-xp)" }}>
          <MenuRow icon="user" label="Meu perfil" />
          <MenuRow icon="gear" label="Configurações da conta" />
          <div style={{ borderTop: "1px solid var(--borda-base)", margin: "var(--espaco-xp) 0" }} />
          <MenuRow icon="arrow-right" label="Sair" />
        </div>
      }
    >
      <UserCard
        name="Nome do Operador"
        secondaryText="operador@lvxfr.com"
        accessibleLabel="Menu da conta de Nome do Operador"
      />
    </Popover>
  );
}

/** Versão MOBILE do rodapé de identificação (slot `footerMobile` do
    SideNav, só usado dentro do Drawer mobile): o User Card fica no TOPO e o
    menu de conta abre como um COLLAPSE inline logo abaixo (não um Popover
    flutuante) — mesmo padrão de disclosure já usado no groupHeader do
    SideNav. */
function ProfileFooterMobile() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <UserCard
        name="Nome do Operador"
        secondaryText="operador@lvxfr.com"
        accessibleLabel="Menu da conta de Nome do Operador"
        caretDirection={open ? "up" : "down"}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className={styles.userCardCollapsePanel}>
          <MenuRow icon="user" label="Meu perfil" />
          <MenuRow icon="gear" label="Configurações da conta" />
          <div style={{ borderTop: "1px solid var(--borda-base)", margin: "var(--espaco-xp) 0" }} />
          <MenuRow icon="arrow-right" label="Sair" />
        </div>
      )}
    </div>
  );
}

export interface AppShellProps {
  embedded?: boolean;
  /** Qual item do SideNav fica marcado como ativo (aria-current). */
  activeNavKey: AppShellNavKey;
  /** Trilha do Breadcrumb do header — mínimo 2 items (o contrato do
      Breadcrumb proíbe trilha de 1 item só, ver breadcrumb.contract.json). */
  breadcrumbItems: BreadcrumbItem[];
  /** 'scroll' (padrão) = página cresce com o conteúdo, .body tem padding e
      rola por conta própria — serve a maioria das telas. 'fixed' = altura
      trava em 100dvh/100% (sem scroll externo), .body vira flex:1 sem
      padding — pensado pra conteúdo que já gerencia o próprio scroll
      interno (ex.: KanbanTemplate, cujo board rola horizontal e cada
      coluna rola vertical por conta própria). */
  layout?: "scroll" | "fixed";
  /** REGRA a pedido do usuário, vale pra qualquer página construída sobre o
      AppShell: o conteúdo real da página deve ficar SEMPRE dentro de um
      card (superfície fundo-superficie/borda-base/raio-p, ocupando a área
      central da tela — mesmo padrão do `.emptyCard` do BackofficeTemplate),
      nunca solto direto sobre o fundo da página (fundo-secundario/
      fundo-superficie, o par mais ESCURO, ver .page/.pageEmbedded). Isso
      vale mesmo quando o conteúdo é um Datatable: o `.wrapper` dele só
      desenha borda ao redor da `<table>` — título/toolbar do Datatable
      ficam FORA dessa borda, soltos, então mesmo um Datatable precisa do
      wrapper de card da página por fora (ver CrudTemplate.contentCard; sem
      usar o átomo Card, que sempre tem borda própria — duplicaria a do
      Datatable). Exceção só com direção explícita em contrário; um Modal
      continua sendo overlay, fora dessa regra. */
  children: ReactNode;
}

/** Casca de página compartilhada por todos os templates de backoffice do
    harness (extraída do BackofficeTemplate original, primeiro consumidor) —
    SideNav à esquerda (logo, navegação, identificação do usuário) + header
    responsivo no topo (Breadcrumb + NotificationCenter, logo próprio e
    hambúrguer no mobile) + área de conteúdo livre (`children`). Não é um
    componente do design system (sem contrato próprio, mesma régua de
    qualquer outro arquivo em `interface/screens`) — é infraestrutura de
    PÁGINA compartilhada entre os templates deste harness, não um átomo/
    molécula/organismo reutilizável por produtos externos. */
export function AppShell({ embedded = false, activeNavKey, breadcrumbItems, layout = "scroll", children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS_INICIAIS);

  function markAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function deleteMany(ids: string[]) {
    const idSet = new Set(ids);
    setNotifications((prev) => prev.filter((n) => !idSet.has(n.id)));
  }

  const items: SideNavItem[] = NAV_ITEMS.map((item) => ({ ...item, active: item.key === activeNavKey }));

  return (
    <div className={embedded ? styles.pageEmbedded : styles.page} data-layout={layout}>
      <SideNav
        items={items}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        header={<Logo />}
        headerCollapsed={<LogoIcon />}
        footer={<ProfileFooter />}
        footerCollapsed={<Avatar name="Nome do Operador" size="small" />}
        footerMobile={<ProfileFooterMobile />}
        accessibleLabel="Navegação do backoffice"
        mobileOpen={mobileNavOpen}
        onMobileOpenChange={setMobileNavOpen}
      />

      <div className={styles.main}>
        <header className={styles.topBar}>
          <div className={styles.topRow}>
            <span className={styles.mobileLogo}>
              <Logo />
            </span>
            <span className={styles.desktopBreadcrumb}>
              <Breadcrumb firstItemIcon="house" items={breadcrumbItems} />
            </span>
            <div className={styles.topBarActions}>
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onDeleteMany={deleteMany}
              />
              <button
                type="button"
                className={styles.mobileMenuButton}
                aria-label="Abrir menu de navegação"
                aria-expanded={mobileNavOpen}
                onClick={() => setMobileNavOpen(true)}
              >
                <Icon name="list" size="medium" color="var(--icone-secundario)" decorative />
              </button>
            </div>
          </div>

          <div className={styles.mobileBreadcrumbRow}>
            <Breadcrumb firstItemIcon="house" items={breadcrumbItems} />
          </div>
        </header>

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
