import { motion } from "framer-motion";
import type { Transaction, Category } from "@/types";
import { CategoryIcon } from "@/components/categories/CategoryIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatShortDate } from "@/utils/dateHelpers";
import { useSettingsStore } from "@/store/settingsStore";

interface TransactionItemProps {
  transaction: Transaction;
  category: Category | undefined;
  onEdit: (t: Transaction) => void;
}

export function TransactionItem({ transaction, category, onEdit }: TransactionItemProps) {
  const currency = useSettingsStore((s) => s.currency);

  const fallbackCategory = {
    icon: "📦",
    color: "#888780",
    name: "Nieznana",
  };

  const cat = category ?? fallbackCategory;

  return (
    <motion.button
      layout
      onClick={() => onEdit(transaction)}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left group"
    >
      <CategoryIcon icon={cat.icon} color={cat.color} size="md" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {transaction.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cat.name}</p>
      </div>

      <div className="text-right shrink-0">
        <p
          className={`text-sm font-semibold ${
            transaction.type === "income"
              ? "text-green-600 dark:text-green-400"
              : "text-red-500 dark:text-red-400"
          }`}
        >
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrency(transaction.amount, currency)}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {formatShortDate(transaction.date)}
        </p>
      </div>
    </motion.button>
  );
}
