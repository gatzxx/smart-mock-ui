import { THEME_STORAGE_KEY, type ThemeMode } from "@/constants/theme";

export function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}
