import { useState } from "react";
import { SideNav } from "../../../components/SideNav/SideNav";
import { Avatar } from "../../../components/Avatar/Avatar";
import { StackedText } from "../../../components/StackedText/StackedText";
import { UserCard } from "../../../components/UserCard/UserCard";
import { Icon, type IconName } from "../../../components/Icon/Icon";
import { Popover } from "../../../components/Popover/Popover";
import styles from "../Demo.module.css";

/** Só o ícone do logo (sem nome/URL) — vai no slot `headerCollapsed`, pro
    logo continuar visível mesmo com o trilho recolhido a 64px (o slot
    `header` normal não cabe reduzido, por isso o par de slots separado —
    contratos/side-nav.contract.json, anatomy). */
function WorkspaceLogoIcon() {
  return (
    <span
      style={{
        width: 32,
        height: 32,
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

/** Composição de exemplo pro slot `header` — logo + nome/URL da loja + botão de
    expandir/recolher (mesma estética das referências anexadas pelo usuário:
    workspace switcher no topo). Só demonstração — SideNav não sabe nada disso,
    header é um slot 100% livre (contratos/side-nav.contract.json). */
function WorkspaceHeader() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--espaco-pp)" }}>
      <WorkspaceLogoIcon />
      <StackedText primaryText="LVXFR" secondaryText="lvxfr.com" />
    </div>
  );
}

function MenuRow({ icon, label, tone = "default" }: { icon: IconName; label: string; tone?: "default" | "active" }) {
  const active = tone === "active";
  return (
    <button
      type="button"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--espaco-pp)",
        width: "100%",
        padding: "var(--espaco-p)",
        border: "none",
        borderRadius: "var(--raio-pp)",
        background: active ? "var(--fundo-invertido)" : "none",
        color: active ? "var(--texto-invertido)" : "var(--texto-primario)",
        cursor: "pointer",
        textAlign: "left",
        font: "inherit",
      }}
    >
      <Icon name={icon} size="small" color={active ? "var(--texto-invertido)" : "var(--icone-secundario)"} decorative />
      {label}
    </button>
  );
}

/** Composição de exemplo pro slot `footer` — UserCard (Avatar + nome + e-mail
    + caret) que abre um Popover com o menu de conta ao clicar, mesma
    estética das referências. UserCard já resolve sozinho o fundo (igual ao
    da página, não do SideNav ao redor) e a ausência de borda — o Popover
    por fora só decide o QUE abre (content), mesmo racional documentado em
    contratos/user-card.contract.json. */
function ProfileFooter() {
  return (
    <Popover
      placement="top-start"
      accessibleLabel="Menu da conta"
      content={
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 220, padding: "var(--espaco-xp)" }}>
          <MenuRow icon="user" label="My profile" />
          <MenuRow icon="gear" label="Account settings" tone="active" />
          <MenuRow icon="device-mobile" label="Device management" />
          <div style={{ borderTop: "1px solid var(--borda-base)", margin: "var(--espaco-xp) 0" }} />
          <MenuRow icon="arrow-right" label="Log out" />
        </div>
      }
    >
      <UserCard name="Tuhel Rana" secondaryText="tuhelrana@gmail.com" accessibleLabel="Menu da conta de Tuhel Rana" />
    </Popover>
  );
}

export function SideNavDemo() {
  const [rota, setRota] = useState("/pedidos");
  const [openKeys, setOpenKeys] = useState<string[]>(["documentos"]);
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const flatItems = [
    { key: "inicio", label: "Início", href: "/", icon: "house" as const },
    { key: "pedidos", label: "Pedidos", href: "/pedidos", icon: "shopping-cart" as const },
    { key: "relatorios", label: "Relatórios", href: "/relatorios", icon: "receipt" as const },
  ].map((item) => ({ ...item, active: item.href === rota }));

  const treeItems = [
    { key: "inicio", label: "Início", href: "/", icon: "house" as const, active: "/" === rota },
    {
      key: "documentos",
      label: "Documentos",
      icon: "shopping-cart" as const,
      children: [
        { key: "contratos", label: "Contratos", href: "/documentos/contratos", active: "/documentos/contratos" === rota },
        {
          key: "relatorios",
          label: "Relatórios",
          children: [
            { key: "financeiro", label: "Financeiro", href: "/documentos/relatorios/financeiro", active: "/documentos/relatorios/financeiro" === rota },
            {
              key: "juridico",
              label: "Jurídico",
              children: [
                { key: "recibos", label: "Recibos", href: "/documentos/relatorios/juridico/recibos" },
                { key: "notas-fiscais", label: "Notas fiscais", href: "/documentos/relatorios/juridico/notas-fiscais" },
              ],
            },
          ],
        },
      ],
    },
    { key: "sobre", label: "Sobre", href: "/sobre", icon: "info" as const, active: "/sobre" === rota },
  ];

  return (
    <div className={styles.column} style={{ maxWidth: "none" }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Um nível só (flat) — com Icon por item</span>
        <div style={{ height: 280, border: "1px solid var(--borda-base)", borderRadius: "var(--raio-pp)", overflow: "hidden", display: "flex" }}>
          <SideNav
            items={flatItems}
            header={<strong style={{ fontSize: 16 }}>LVXFR</strong>}
            footer={<Avatar name="Ana Souza" size="small" />}
          />
          <div className={styles.pageArea} style={{ flex: 1, padding: 16 }}>
            <button type="button" className={styles.trigger} onClick={() => setRota("/")}>
              Simular rota: /
            </button>{" "}
            <button type="button" className={styles.trigger} onClick={() => setRota("/pedidos")}>
              Simular rota: /pedidos
            </button>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>
          Multi-nível (até 4) — árvore expansível indentada; header/footer compostos com
          Avatar+StackedText+Popover, estética inspirada nas referências (workspace no topo,
          cartão de perfil com menu no rodapé)
        </span>
        <div style={{ height: 480, border: "1px solid var(--borda-base)", borderRadius: "var(--raio-pp)", overflow: "hidden", display: "flex" }}>
          <SideNav
            items={treeItems}
            openKeys={openKeys}
            onOpenKeysChange={setOpenKeys}
            header={<WorkspaceHeader />}
            footer={<ProfileFooter />}
            width="large"
          />
          <div className={styles.pageArea} style={{ flex: 1, padding: 16 }}>
            Conteúdo da página ao lado.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>
          Recolhido (collapsed) — trilho só de ícones; passe o mouse por cima pra ver o painel
          completo (mesmo header/footer compostos acima) abrir sobre o conteúdo, sem empurrar o
          layout
        </span>
        <div style={{ height: 480, border: "1px solid var(--borda-base)", borderRadius: "var(--raio-pp)", overflow: "hidden", display: "flex", position: "relative" }}>
          <SideNav
            items={treeItems}
            openKeys={openKeys}
            onOpenKeysChange={setOpenKeys}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            header={<WorkspaceHeader />}
            headerCollapsed={<WorkspaceLogoIcon />}
            footer={<ProfileFooter />}
            footerCollapsed={<Avatar name="Tuhel Rana" size="small" />}
            width="large"
          />
          <div className={styles.pageArea} style={{ flex: 1, padding: 16 }}>
            Conteúdo da página ao lado.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>width="small" (200px, mesma escala small/medium/large do Drawer)</span>
        <div style={{ height: 280, border: "1px solid var(--borda-base)", borderRadius: "var(--raio-pp)", overflow: "hidden", display: "flex" }}>
          <SideNav
            items={flatItems}
            width="small"
            header={<strong style={{ fontSize: 16 }}>LVXFR</strong>}
            footer={<Avatar name="Ana Souza" size="small" />}
          />
          <div className={styles.pageArea} style={{ flex: 1, padding: 16 }}>
            Conteúdo da página ao lado.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>
          mobileOpen/onMobileOpenChange — modo controlado: o hambúrguer embutido some, o
          consumidor desenha o próprio gatilho (botão abaixo) e controla o mesmo Drawer por fora
        </span>
        <div className={styles.pageArea} style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
          <button type="button" className={styles.trigger} onClick={() => setMobileOpen(true)}>
            Abrir navegação (gatilho próprio do consumidor)
          </button>
          <SideNav items={flatItems} mobileOpen={mobileOpen} onMobileOpenChange={setMobileOpen} header={<strong style={{ fontSize: 16 }}>LVXFR</strong>} />
        </div>
      </div>
    </div>
  );
}
