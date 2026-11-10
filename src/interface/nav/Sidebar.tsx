import { useState } from "react";
import { Icon } from "../../components/Icon/Icon";
import { GROUP_ORDER, STORIES } from "../stories/registry";
import type { StoryGroup } from "../stories/types";
import { ThemeToggle } from "../theme/ThemeToggle";
import type { Theme } from "../theme/useTheme";
import styles from "./Sidebar.module.css";

export const ICON_LIBRARY_ID = "__icon-library__";

const ICON_LIBRARY_GROUP = "Biblioteca de Ícones";

interface SidebarProps {
  selectedId: string;
  onSelect: (id: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
  /** Navega pro módulo ProtoTable (índice de protótipos) — módulo irmão
      deste, mesma estrutura visual, dados totalmente separados (ver
      App.tsx). */
  onNavigateToPrototable: () => void;
}

interface GroupSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function GroupSection({ title, expanded, onToggle, children }: GroupSectionProps) {
  const panelId = `sidebar-group-${title.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className={styles.group}>
      <button
        type="button"
        className={styles.groupHeader}
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
      >
        <span className={styles.groupTitle}>{title}</span>
        <Icon
          name={expanded ? "caret-down" : "caret-right"}
          size="small"
          color="var(--texto-secundario)"
          decorative
        />
      </button>
      {expanded && <div id={panelId}>{children}</div>}
    </div>
  );
}

export function Sidebar({ selectedId, onSelect, theme, onToggleTheme, onNavigateToPrototable }: SidebarProps) {
  // Grupos recolhidos (todos começam expandidos) — estado só de UI, não persistido.
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());

  function toggle(group: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  }

  return (
    <nav className={styles.sidebar} aria-label="Navegação de componentes">
      <div className={styles.brand}>SeleneSDK</div>

      <div className={styles.scroll}>
        {GROUP_ORDER.map((group) => {
          const items = STORIES.filter((story) => story.group === (group as StoryGroup));
          return (
            <GroupSection key={group} title={group} expanded={!collapsed.has(group)} onToggle={() => toggle(group)}>
              {items.length === 0 ? (
                <span className={styles.empty}>Nenhum contrato ainda</span>
              ) : (
                <ul className={styles.list}>
                  {items.map((story) => (
                    <li key={story.id}>
                      <button
                        type="button"
                        className={`${styles.item} ${selectedId === story.id ? styles.itemActive : ""}`}
                        onClick={() => onSelect(story.id)}
                        aria-current={selectedId === story.id ? "page" : undefined}
                      >
                        {story.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </GroupSection>
          );
        })}

        <GroupSection
          title={ICON_LIBRARY_GROUP}
          expanded={!collapsed.has(ICON_LIBRARY_GROUP)}
          onToggle={() => toggle(ICON_LIBRARY_GROUP)}
        >
          <ul className={styles.list}>
            <li>
              <button
                type="button"
                className={`${styles.item} ${selectedId === ICON_LIBRARY_ID ? styles.itemActive : ""}`}
                onClick={() => onSelect(ICON_LIBRARY_ID)}
                aria-current={selectedId === ICON_LIBRARY_ID ? "page" : undefined}
              >
                Ícones (Phosphor)
              </button>
            </li>
          </ul>
        </GroupSection>
      </div>

      {/* Rodapé fixo — fora da área rolável, sempre visível. */}
      <div className={styles.footer}>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <button type="button" className={styles.moduleCard} onClick={onNavigateToPrototable}>
          <span className={styles.moduleIcon}>
            <Icon name="desktop" size="medium" color="var(--acao-primaria)" decorative />
          </span>
          <span className={styles.moduleText}>
            <span className={styles.moduleTitle}>ProtoTable</span>
            <span className={styles.moduleDescription}>Protótipos e telas de produto</span>
          </span>
          <Icon name="arrow-right" size="small" color="var(--texto-secundario)" decorative />
        </button>
      </div>
    </nav>
  );
}
