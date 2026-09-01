import { Icon } from "../../components/Icon/Icon";
import type { Theme } from "./useTheme";
import styles from "./ThemeToggle.module.css";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
    >
      <Icon name={isDark ? "moon" : "sun"} size="small" color="var(--texto-secundario)" decorative />
      {isDark ? "Escuro" : "Claro"}
    </button>
  );
}
