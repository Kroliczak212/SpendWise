import { useSettingsStore } from "@/store/settingsStore";

export function ThemeToggle() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Przełącz motyw"
      title={theme === "dark" ? "Przełącz na jasny" : "Przełącz na ciemny"}
    >
      <span className="text-xl">{theme === "dark" ? "☀️" : "🌙"}</span>
    </button>
  );
}
