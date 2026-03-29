import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "📊", end: true },
  { to: "/transactions", label: "Transakcje", icon: "📋", end: false },
  { to: "/budgets", label: "Budżety", icon: "🎯", end: false },
  { to: "/categories", label: "Kategorie", icon: "🏷", end: false },
  { to: "/settings", label: "Więcej", icon: "⚙️", end: false },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex md:hidden">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors",
              isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            )
          }
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
