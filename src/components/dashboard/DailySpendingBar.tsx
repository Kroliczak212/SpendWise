import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/formatCurrency";
import { useSettingsStore } from "@/store/settingsStore";
import { formatMonthLabel } from "@/utils/dateHelpers";
import { EmptyState } from "@/components/ui/EmptyState";
import type { DailySpending } from "@/utils/calculations";

interface DailySpendingBarProps {
  data: DailySpending[];
  month: string;
}

export function DailySpendingBar({ data, month }: DailySpendingBarProps) {
  const currency = useSettingsStore((s) => s.currency);
  const monthLabel = formatMonthLabel(month);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: DailySpending }[];
  }) => {
    if (active && payload?.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-xs shadow-lg">
          <p className="font-semibold text-gray-800 dark:text-gray-100">
            {d.day} {monthLabel}
          </p>
          <p className="text-red-500 dark:text-red-400">{formatCurrency(d.amount, currency)}</p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Wydatki dzienne</h3>
        <EmptyState icon="📊" title="Brak wydatków" description="Wydatki pojawią się tutaj" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm"
    >
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Wydatki dzienne</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v) => (v / 100).toFixed(0)}
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" fill="#3b82f6" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
