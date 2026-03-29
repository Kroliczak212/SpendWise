import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { formatShortMonthLabel, formatMonthLabel } from "@/utils/dateHelpers";
import { formatCurrency } from "@/utils/formatCurrency";
import { useSettingsStore } from "@/store/settingsStore";
import type { MonthlyTrendPoint } from "@/utils/calculations";

interface MonthlyTrendChartProps {
  data: MonthlyTrendPoint[];
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const currency = useSettingsStore((s) => s.currency);

  const chartData = data.map((d) => ({
    ...d,
    label: formatShortMonthLabel(d.month),
  }));

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { value: number; name: string }[];
    label?: string;
  }) => {
    if (active && payload?.length) {
      const month = data.find((d) => formatShortMonthLabel(d.month) === label);
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-xs shadow-lg">
          <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1 capitalize">
            {month ? formatMonthLabel(month.month) : label}
          </p>
          {payload.map((p, i) => (
            <p key={i} className={p.name === "income" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}>
              {p.name === "income" ? "Przychody" : "Wydatki"}: {formatCurrency(p.value, currency)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm"
    >
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Trend miesięczny (6 mies.)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v) => (v / 100).toFixed(0)}
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} fill="url(#incomeGrad)" />
          <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#expenseGrad)" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3 justify-center">
        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
          <div className="w-3 h-0.5 bg-green-500 rounded" />
          Przychody
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
          <div className="w-3 h-0.5 bg-red-500 rounded" />
          Wydatki
        </div>
      </div>
    </motion.div>
  );
}
