import { Header } from "@/components/layout/Header";
import { CurrencySelect } from "@/components/settings/CurrencySelect";
import { ExportImport } from "@/components/settings/ExportImport";
import { ResetData } from "@/components/settings/ResetData";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { PageTransition } from "@/components/ui/PageTransition";
import { useSettingsStore } from "@/store/settingsStore";

export default function SettingsPage() {
  const theme = useSettingsStore((s) => s.theme);

  return (
    <PageTransition>
      <Header />

      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-8">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Ustawienia</h1>

        <CurrencySelect />

        {/* Theme */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Motyw</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {theme === "dark" ? "Ciemny motyw" : "Jasny motyw"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Zmień wygląd aplikacji</p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <ExportImport />

        <ResetData />

        <div className="text-center text-xs text-gray-400 dark:text-gray-500 pb-4">
          <p className="font-semibold text-gray-600 dark:text-gray-400 mb-1">💰 SpendWise</p>
          <p>Tracker finansów osobistych · Dane przechowywane lokalnie</p>
        </div>
      </div>
    </PageTransition>
  );
}
