import { motion } from "framer-motion";
import type { Budget, Category } from "@/types";
import { CategoryIcon } from "@/components/categories/CategoryIcon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/utils/formatCurrency";
import { calculateBudgetUsage, getBudgetStatus } from "@/utils/calculations";
import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/utils/cn";

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  category: Category | undefined;
  onEdit: () => void;
}

export function BudgetCard({ budget, spent, category, onEdit }: BudgetCardProps) {
  const currency = useSettingsStore((s) => s.currency);
  const percentage = calculateBudgetUsage(spent, budget.amount);
  const status = getBudgetStatus(percentage);
  const remaining = budget.amount - spent;
  const isExceeded = remaining < 0;

  const cat = category ?? { icon: "📦", color: "#888780", name: "Nieznana" };

  const percentColor = {
    safe: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    danger: "text-orange-600 dark:text-orange-400",
    exceeded: "text-red-600 dark:text-red-400",
  }[status];

  return (
    <motion.button
      layout
      onClick={onEdit}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm text-left transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <CategoryIcon icon={cat.icon} color={cat.color} size="md" />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{cat.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Limit: {formatCurrency(budget.amount, currency)}
            </p>
          </div>
        </div>
        <span className={cn("text-xl font-bold", percentColor)}>{percentage}%</span>
      </div>

      <ProgressBar value={percentage} className="mb-2" />

      <div className="flex justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">
          Wydano: <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(spent, currency)}</span>
        </span>
        <span className={isExceeded ? "text-red-500 font-medium" : "text-gray-500 dark:text-gray-400"}>
          {isExceeded
            ? `Przekroczono o ${formatCurrency(Math.abs(remaining), currency)}`
            : `Pozostało: ${formatCurrency(remaining, currency)}`}
        </span>
      </div>
    </motion.button>
  );
}
