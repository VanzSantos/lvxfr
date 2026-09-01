import { UserCard } from "../../../components/UserCard/UserCard";
import { Popover } from "../../../components/Popover/Popover";
import { Icon, type IconName } from "../../../components/Icon/Icon";
import styles from "../Demo.module.css";

function MenuRow({ icon, label }: { icon: IconName; label: string }) {
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
        background: "none",
        color: "var(--texto-primario)",
        cursor: "pointer",
        textAlign: "left",
        font: "inherit",
      }}
    >
      <Icon name={icon} size="small" color="var(--icone-secundario)" decorative />
      {label}
    </button>
  );
}

export function UserCardDemo() {
  return (
    <div className={styles.column} style={{ maxWidth: 320 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Sozinho (sem Popover — não abre nada, só demonstração visual)</span>
        <UserCard name="Tuhel Rana" secondaryText="tuhelrana@gmail.com" />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Uso real — como gatilho de um Popover com menu de conta (mesmo padrão usado no rodapé do SideNav)</span>
        <Popover
          placement="top-start"
          accessibleLabel="Menu da conta"
          content={
            <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 220, padding: "var(--espaco-xp)" }}>
              <MenuRow icon="user" label="My profile" />
              <MenuRow icon="gear" label="Account settings" />
              <div style={{ borderTop: "1px solid var(--borda-base)", margin: "var(--espaco-xp) 0" }} />
              <MenuRow icon="arrow-right" label="Log out" />
            </div>
          }
        >
          <UserCard name="Ana Souza" secondaryText="ana.souza@lvxfr.com" accessibleLabel="Menu da conta de Ana Souza" />
        </Popover>
      </div>
    </div>
  );
}
