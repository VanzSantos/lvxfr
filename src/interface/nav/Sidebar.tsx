import { GROUP_ORDER, STORIES } from "../stories/registry";
import type { StoryGroup } from "../stories/types";
import { ThemeToggle } from "../theme/ThemeToggle";
import type { Theme } from "../theme/useTheme";
import styles from "./Sidebar.module.css";

export const ICON_LIBRARY_ID = "__icon-library__";

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

export function Sidebar({ selectedId, onSelect, theme, onToggleTheme, onNavigateToPrototable }: SidebarProps) {
  return (
    <nav className={styles.sidebar} aria-label="Navegação de componentes">
      <div className={styles.brand}>DS Playground</div>
      <button type="button" className={styles.moduleSwitch} onClick={onNavigateToPrototable}>
        Ir para ProtoTable →
      </button>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />

      {GROUP_ORDER.map((group) => {
        const items = STORIES.filter((story) => story.group === (group as StoryGroup));
        return (
          <div key={group} className={styles.group}>
            <span className={styles.groupTitle}>{group}</span>
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
          </div>
        );
      })}

      <div className={styles.group}>
        <span className={styles.groupTitle}>Biblioteca de Ícones</span>
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
      </div>
    </nav>
  );
}
