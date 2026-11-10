import { Select } from "../../components/Select/Select";
import type { ThemePreference } from "./useTheme";

const OPTIONS = [
  { value: "light", label: "Modo claro" },
  { value: "dark", label: "Modo escuro" },
  { value: "system", label: "Padrão do sistema" },
];

interface ThemeToggleProps {
  preference: ThemePreference;
  onChange: (preference: ThemePreference) => void;
}

/** Seletor de modo de cor — "Padrão do sistema" herda o prefers-color-scheme do SO. */
export function ThemeToggle({ preference, onChange }: ThemeToggleProps) {
  return (
    <Select
      label="Modo de cor"
      options={OPTIONS}
      value={preference}
      onChange={(value) => onChange(value as ThemePreference)}
    />
  );
}
