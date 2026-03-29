import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/hooks/useToast";
import { useTransactionStore } from "@/store/transactionStore";
import { useBudgetStore } from "@/store/budgetStore";
import { useCategoryStore } from "@/store/categoryStore";
import { DEFAULT_CATEGORIES } from "@/utils/defaultCategories";

export function ResetData() {
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();

  const clearTransactions = useTransactionStore((s) => s.clearTransactions);
  const clearBudgets = useBudgetStore((s) => s.clearBudgets);
  const setCategories = useCategoryStore((s) => s.setCategories);

  const handleReset = () => {
    clearTransactions();
    clearBudgets();
    setCategories([...DEFAULT_CATEGORIES]);
    showToast({ message: "Wszystkie dane zostały wyczyszczone", type: "info" });
  };

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Strefa niebezpieczna</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900/50">
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Wyczyść wszystkie dane</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Usuwa wszystkie transakcje, budżety i custom kategorie
            </p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
          >
            🗑 Wyczyść
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleReset}
        title="Wyczyść wszystkie dane"
        description="Czy na pewno? Wszystkie transakcje, budżety i niestandardowe kategorie zostaną usunięte. Tej operacji nie można cofnąć."
        confirmLabel="Wyczyść wszystko"
        variant="danger"
      />
    </div>
  );
}
