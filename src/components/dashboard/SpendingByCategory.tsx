import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCategories } from "@/hooks/useCategories";
import { formatCurrency } from "@/utils/formatCurrency";
import { useSettingsStore } from "@/store/settingsStore";
import type { CategorySpending } from "@/utils/calculations";

interface SpendingByCategoryProps {
  data: CategorySpending[];
}

export function SpendingByCategory({ data }: SpendingByCategoryProps) {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const currency = useSettingsStore((s) => s.currency);

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Wydatki per kategoria</h3>
        <EmptyState icon="🥧" title="Brak wydatków" description="Dodaj wydatki aby zobaczyć wykres" />
      </div>
    );
  }

  const chartData = data.map((d) => {
    const cat = categories.find((c) => c.id === d.categoryId);
    return {
      ...d,
      name: cat ? `${cat.icon} ${cat.name}` : "Inne",
      color: cat?.color ?? "#888780",
    };
  });

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: typeof chartData[0] }[] }) => {
    if (active && payload?.length) {
      const entry = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-xs shadow-lg">
          <p className="font-semibold text-gray-800 dark:text-gray-100">{entry.name}</p>
          <p className="text-gray-600 dark:text-gray-400">
            {formatCurrency(entry.total, currency)} ({entry.percentage}%)
          </p>
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
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Wydatki per kategoria</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={85}
            dataKey="total"
            onClick={(entry) => {
              navigate("/transactions", { state: { categoryFilter: entry.categoryId } });
            }}
            style={{ cursor: "pointer" }}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 space-y-1.5">
        {chartData.slice(0, 5).map((entry, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-700 dark:text-gray-300">{entry.name}</span>
            </div>
            <span className="font-medium text-gray-600 dark:text-gray-400">
              {formatCurrency(entry.total, currency)}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
