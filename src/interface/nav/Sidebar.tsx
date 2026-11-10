import { useState } from "react";
import { SideNav, type SideNavItem } from "../../components/SideNav/SideNav";
import { Button } from "../../components/Button/Button";
import { Icon } from "../../components/Icon/Icon";
import { GROUP_ORDER, STORIES } from "../stories/registry";
import type { StoryGroup } from "../stories/types";
import { ThemeToggle } from "../theme/ThemeToggle";
import type { ThemePreference } from "../theme/useTheme";
import styles from "./Sidebar.module.css";

export const ICON_LIBRARY_ID = "__icon-library__";

/** Href de cada tela do Playground — hash da URL, o que dá link direto pra cada
    componente sem biblioteca de rotas (SideNav só navega por href). */
export function hrefForStory(id: string) {
  return `#/${encodeURIComponent(id)}`;
}

function buildItems(selectedId: string): SideNavItem[] {
  const groups: SideNavItem[] = GROUP_ORDER.map((group) => ({
    key: `grupo-${group}`,
    label: group,
    children: STORIES.filter((story) => story.group === (group as StoryGroup)).map((story) => ({
      key: story.id,
      label: story.title,
      href: hrefForStory(story.id),
      active: selectedId === story.id,
    })),
  })).filter((group) => group.children!.length > 0);

  groups.push({
    key: "grupo-icones",
    label: "Biblioteca de Ícones",
    children: [
      {
        key: ICON_LIBRARY_ID,
        label: "Ícones (Phosphor)",
        href: hrefForStory(ICON_LIBRARY_ID),
        active: selectedId === ICON_LIBRARY_ID,
      },
    ],
  });
  return groups;
}

interface SidebarProps {
  selectedId: string;
  themePreference: ThemePreference;
  onThemePreferenceChange: (preference: ThemePreference) => void;
  /** Navega pro módulo ProtoTable (índice de protótipos) — módulo irmão
      deste, mesma estrutura visual, dados totalmente separados (ver
      App.tsx). */
  onNavigateToPrototable: () => void;
}

/** Marca do SeleneSDK — usada no topo do menu dos dois módulos. */
export function Brand({ icon, name }: { icon: "moon" | "pencil-ruler"; name: string }) {
  return (
    <div className={styles.brand}>
      <Icon name={icon} size="medium" color="var(--texto-primario)" weight="fill" decorative />
      {name}
    </div>
  );
}

/** Rodapé fixo do menu — modo de cor + atalho pro outro módulo. */
export function SidebarFooter({
  themePreference,
  onThemePreferenceChange,
  moduleLabel,
  moduleIcon,
  moduleDirection,
  onNavigate,
}: {
  themePreference: ThemePreference;
  onThemePreferenceChange: (preference: ThemePreference) => void;
  moduleLabel: string;
  moduleIcon: "moon" | "pencil-ruler";
  moduleDirection: "forward" | "back";
  onNavigate: () => void;
}) {
  return (
    <div className={styles.footer}>
      <ThemeToggle preference={themePreference} onChange={onThemePreferenceChange} />
      <Button
        variant="neutral"
        outlined
        fullWidth
        label={moduleLabel}
        leftIcon={moduleIcon}
        rightIcon={moduleDirection === "forward" ? "arrow-right" : undefined}
        onPress={onNavigate}
      />
    </div>
  );
}

export function Sidebar({ selectedId, themePreference, onThemePreferenceChange, onNavigateToPrototable }: SidebarProps) {
  // Todos os grupos começam expandidos.
  const [openKeys, setOpenKeys] = useState<string[]>(() => buildItems(selectedId).map((item) => item.key));

  return (
    <SideNav
      items={buildItems(selectedId)}
      openKeys={openKeys}
      onOpenKeysChange={setOpenKeys}
      accessibleLabel="Navegação de componentes"
      header={<Brand icon="moon" name="SeleneSDK" />}
      footer={
        <SidebarFooter
          themePreference={themePreference}
          onThemePreferenceChange={onThemePreferenceChange}
          moduleLabel="ProtoTable"
          moduleIcon="pencil-ruler"
          moduleDirection="forward"
          onNavigate={onNavigateToPrototable}
        />
      }
    />
  );
}
