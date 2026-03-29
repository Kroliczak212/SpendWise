import type { Budget, Category } from "@/types";
import { calculateBudgetUsage, getBudgetStatus } from "@/utils/calculations";
import { formatCurrency } from "@/utils/formatCurrency";
import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/utils/cn";

interface BudgetAlertProps {
  budgets: Budget[];
  spentMap: Record<string, number>;
  categories: Category[];
  onAlertClick: (budgetId: string) => void;
}

export function BudgetAlert({ budgets, spentMap, categories, onAlertClick }: BudgetAlertProps) {
  const currency = useSettingsStore((s) => s.currency);

  const alerts = budgets
    .map((b) => {
      const spent = spentMap[b.id] ?? 0;
      const percentage = calculateBudgetUsage(spent, b.amount);
      const status = getBudgetStatus(percentage);
      return { budget: b, spent, percentage, status };
    })
    .filter((a) => a.status === "danger" || a.status === "exceeded")
    .sort((a, b) => b.percentage - a.percentage);

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {alerts.map(({ budget, spent, percentage, status }) => {
        const cat = categories.find((c) => c.id === budget.categoryId);
        const exceeded = status === "exceeded";
        const overAmount = spent - budget.amount;

        return (
          <button
            key={budget.id}
            onClick={() => onAlertClick(budget.id)}
            className={cn(
              "w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-left transition-opacity hover:opacity-90",
              exceeded
                ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                : "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800"
            )}
          >
            <span>{exceeded ? "🚨" : "⚠️"}</span>
            <span>
              {exceeded
                ? `Budżet na ${cat?.name ?? "kategorię"} przekroczony o ${formatCurrency(overAmount, currency)}!`
                : `Budżet na ${cat?.name ?? "kategorię"} wykorzystany w ${percentage}%!`}
            </span>
          </button>
        );
      })}
    </div>
  );
}
