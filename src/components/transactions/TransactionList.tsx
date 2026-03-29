import { AnimatePresence, motion } from "framer-motion";
import type { Transaction } from "@/types";
import { TransactionItem } from "./TransactionItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCategories } from "@/hooks/useCategories";
import { groupTransactionsByDay, formatDayHeader } from "@/utils/dateHelpers";
import { formatCurrency } from "@/utils/formatCurrency";
import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/utils/cn";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onAdd?: () => void;
}

export function TransactionList({ transactions, onEdit, onAdd }: TransactionListProps) {
  const { categories } = useCategories();
  const currency = useSettingsStore((s) => s.currency);

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon="💸"
        title="Brak transakcji"
        description="Dodaj pierwszą transakcję w tym miesiącu"
        action={onAdd ? { label: "Dodaj transakcję", onClick: onAdd } : undefined}
      />
    );
  }

  const grouped = groupTransactionsByDay(transactions);

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {Array.from(grouped.entries()).map(([day, dayTransactions]) => {
          const dayBalance = dayTransactions.reduce((sum, t) => {
            return sum + (t.type === "income" ? t.amount : -t.amount);
          }, 0);

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700"
            >
              {/* Day Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 capitalize">
                  {formatDayHeader(day)}
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    dayBalance >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  )}
                >
                  {dayBalance >= 0 ? "+" : ""}
                  {formatCurrency(Math.abs(dayBalance), currency)}
                </span>
              </div>

              {/* Transactions */}
              <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                <AnimatePresence>
                  {dayTransactions.map((t) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                    >
                      <TransactionItem
                        transaction={t}
                        category={categories.find((c) => c.id === t.categoryId)}
                        onEdit={onEdit}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
