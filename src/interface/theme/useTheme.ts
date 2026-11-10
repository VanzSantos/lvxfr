import { useLayoutEffect, useState } from "react";

/** Tema efetivamente aplicado (o que vai pro data-theme do <html>). */
export type Theme = "light" | "dark";
/** Preferência escolhida pela pessoa — "system" herda o tema do sistema operacional. */
export type ThemePreference = Theme | "system";

const STORAGE_KEY = "ds-playground-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function readInitialPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {
    // localStorage indisponível — cai no padrão abaixo.
  }
  return "system";
}

function systemTheme(): Theme {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(readInitialPreference);
  const [system, setSystem] = useState<Theme>(systemTheme);

  // Acompanha mudanças do tema do sistema enquanto a página está aberta.
  useLayoutEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia(DARK_QUERY);
    const onChange = () => setSystem(media.matches ? "dark" : "light");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const theme: Theme = preference === "system" ? system : preference;

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // ignora — a preferência só não persiste.
    }
  }, [theme, preference]);

  return { theme, preference, setPreference };
}
