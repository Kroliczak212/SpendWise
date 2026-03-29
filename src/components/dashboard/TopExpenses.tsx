import type { Transaction } from "@/types";
import { CategoryIcon } from "@/components/categories/CategoryIcon";
import { useCategories } from "@/hooks/useCategories";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatShortDate } from "@/utils/dateHelpers";
import { useSettingsStore } from "@/store/settingsStore";
import { EmptyState } from "@/components/ui/EmptyState";

interface TopExpensesProps {
  expenses: Transaction[];
  onEdit: (t: Transaction) => void;
}

export function TopExpenses({ expenses, onEdit }: TopExpensesProps) {
  const { categories } = useCategories();
  const currency = useSettingsStore((s) => s.currency);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Top 5 wydatków</h3>
      {expenses.length === 0 ? (
        <EmptyState icon="💸" title="Brak wydatków" description="Wydatki pojawią się tutaj" />
      ) : (
        <div className="space-y-2">
          {expenses.map((t) => {
            const cat = categories.find((c) => c.id === t.categoryId);
            return (
              <button
                key={t.id}
                onClick={() => onEdit(t)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
              >
                <CategoryIcon
                  icon={cat?.icon ?? "📦"}
                  color={cat?.color ?? "#888780"}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{t.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatShortDate(t.date)}</p>
                </div>
                <span className="text-sm font-semibold text-red-500 dark:text-red-400 shrink-0">
                  -{formatCurrency(t.amount, currency)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
