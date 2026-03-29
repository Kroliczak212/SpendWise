import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useStats } from "@/hooks/useStats";
import { useSettingsStore } from "@/store/settingsStore";
import { formatCurrency } from "@/utils/formatCurrency";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "📊", end: true },
  { to: "/transactions", label: "Transakcje", icon: "📋", end: false },
  { to: "/budgets", label: "Budżety", icon: "🎯", end: false },
  { to: "/categories", label: "Kategorie", icon: "🏷", end: false },
  { to: "/settings", label: "Ustawienia", icon: "⚙️", end: false },
];

export function Sidebar() {
  const selectedMonth = useSettingsStore((s) => s.selectedMonth);
  const currency = useSettingsStore((s) => s.currency);
  const { balance } = useStats(selectedMonth);

  return (
    <aside className="fixed left-0 top-0 h-full w-16 md:w-60 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col z-30">
      {/* Logo */}
      <div className="p-4 md:px-5 md:py-5 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="hidden md:block text-lg font-bold text-gray-900 dark:text-gray-100">
            SpendWise
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 md:p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-2 md:px-3 py-2.5 rounded-xl transition-colors text-sm font-medium",
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              )
            }
          >
            <span className="text-lg shrink-0">{item.icon}</span>
            <span className="hidden md:block">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Balance + Theme */}
      <div className="p-3 md:p-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
        <div className="hidden md:block">
          <p className="text-xs text-gray-500 dark:text-gray-400">Saldo miesięczne</p>
          <p
            className={cn(
              "text-base font-bold",
              balance >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-500 dark:text-red-400"
            )}
          >
            {balance >= 0 ? "+" : ""}
            {formatCurrency(balance, currency)}
          </p>
        </div>
        <div className="flex justify-center md:justify-start">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
