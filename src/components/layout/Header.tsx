import { MonthPicker } from "@/components/ui/MonthPicker";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface HeaderProps {
  onAddTransaction?: () => void;
}

export function Header({ onAddTransaction }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
      <MonthPicker />
      <div className="flex items-center gap-2">
        {onAddTransaction && (
          <button
            onClick={onAddTransaction}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Dodaj</span>
          </button>
        )}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
