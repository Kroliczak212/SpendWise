import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatMonthLabel, addMonths } from "@/utils/dateHelpers";
import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/utils/cn";
import type { MoMTrend } from "@/utils/calculations";

interface BalanceCardProps {
  balance: number;
  momTrend: MoMTrend;
  month: string;
}

export function BalanceCard({ balance, momTrend, month }: BalanceCardProps) {
  const currency = useSettingsStore((s) => s.currency);
  const prevMonth = addMonths(month, -1);
  const prevMonthLabel = formatMonthLabel(prevMonth);

  const trendIcon = momTrend.direction === "up" ? "↑" : momTrend.direction === "down" ? "↓" : "→";
  const trendColor =
    momTrend.direction === "up"
      ? "text-green-600 dark:text-green-400"
      : momTrend.direction === "down"
      ? "text-red-500 dark:text-red-400"
      : "text-gray-500 dark:text-gray-400";

  const trendLabel =
    momTrend.direction === "same"
      ? `→ bez zmian vs ${prevMonthLabel}`
      : `${trendIcon} ${momTrend.percentage}% ${momTrend.direction === "up" ? "więcej" : "mniej"} niż w ${prevMonthLabel}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm"
    >
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Saldo miesięczne</p>
      <p
        className={cn(
          "text-4xl font-bold leading-tight",
          balance >= 0
            ? "text-green-600 dark:text-green-400"
            : "text-red-500 dark:text-red-400"
        )}
      >
        {balance >= 0 ? "+" : ""}
        {formatCurrency(balance, currency)}
      </p>
      <p className={cn("text-sm mt-2", trendColor)}>{trendLabel}</p>
    </motion.div>
  );
}
