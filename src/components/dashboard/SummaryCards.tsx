import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/formatCurrency";
import { useSettingsStore } from "@/store/settingsStore";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const cards = [
  { key: "income", label: "Przychody", icon: "💚", color: "text-green-600 dark:text-green-400" },
  { key: "expense", label: "Wydatki", icon: "🔴", color: "text-red-500 dark:text-red-400" },
  { key: "savings", label: "Oszczędności", icon: "💙", color: "text-blue-600 dark:text-blue-400" },
] as const;

export function SummaryCards({ totalIncome, totalExpense, balance }: SummaryCardsProps) {
  const currency = useSettingsStore((s) => s.currency);
  const values = { income: totalIncome, expense: totalExpense, savings: balance };

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-base">{card.icon}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{card.label}</span>
          </div>
          <p className={`text-base font-bold ${card.color} leading-tight`}>
            {card.key === "expense" ? "-" : values[card.key] >= 0 ? "+" : ""}
            {formatCurrency(Math.abs(values[card.key]), currency)}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
