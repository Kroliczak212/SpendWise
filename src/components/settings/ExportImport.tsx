import { useRef, useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/hooks/useToast";
import { exportData, importData } from "@/utils/exportImport";
import { useTransactionStore } from "@/store/transactionStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useBudgetStore } from "@/store/budgetStore";
import { useSettingsStore } from "@/store/settingsStore";

export function ExportImport() {
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const transactions = useTransactionStore((s) => s.transactions);
  const restoreTransactions = useTransactionStore((s) => s.restoreTransactions);
  const categories = useCategoryStore((s) => s.categories);
  const setCategories = useCategoryStore((s) => s.setCategories);
  const budgets = useBudgetStore((s) => s.budgets);
  const restoreBudgets = useBudgetStore((s) => s.restoreBudgets);
  const settings = useSettingsStore((s) => ({
    currency: s.currency,
    theme: s.theme,
    selectedMonth: s.selectedMonth,
  }));
  const setCurrency = useSettingsStore((s) => s.setCurrency);
  const setTheme = useSettingsStore((s) => s.setTheme);

  const handleExport = () => {
    exportData(transactions, categories, budgets, settings);
    showToast({ message: "Dane wyeksportowane pomyślnie", type: "success" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPendingFile(file);
    e.target.value = "";
  };

  const handleImportConfirm = async () => {
    if (!pendingFile) return;
    try {
      const result = await importData(pendingFile);
      // Restore with original IDs preserved
      restoreTransactions(result.transactions);
      setCategories(result.categories);
      restoreBudgets(result.budgets);
      setCurrency(result.settings.currency);
      setTheme(result.settings.theme);
      showToast({
        message: `Zaimportowano pomyślnie (${result.transactions.length} transakcji, ${result.budgets.length} budżetów)`,
        type: "success",
      });
    } catch {
      showToast({ message: "Nieprawidłowy format pliku backup", type: "error" });
    }
    setPendingFile(null);
  };

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Dane</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
        {/* Export */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Eksportuj dane</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pobierz wszystkie dane jako plik JSON</p>
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            📥 Eksportuj
          </button>
        </div>
        {/* Import */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Importuj dane</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Wczytaj dane z pliku backup JSON</p>
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
          >
            📤 Importuj
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!pendingFile}
        onClose={() => setPendingFile(null)}
        onConfirm={handleImportConfirm}
        title="Importuj dane"
        description="Ta operacja zastąpi wszystkie aktualne dane (transakcje, budżety, kategorie). Tej operacji nie można cofnąć. Czy kontynuować?"
        confirmLabel="Importuj"
        variant="danger"
      />
    </div>
  );
}
