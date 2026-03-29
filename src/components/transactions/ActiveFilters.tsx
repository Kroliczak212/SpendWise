import type { TransactionFilters } from "@/types";
import { DEFAULT_FILTERS } from "@/types";
import { useCategories } from "@/hooks/useCategories";

interface ActiveFiltersProps {
  filters: TransactionFilters;
  onRemove: (key: keyof TransactionFilters, value?: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
  const { categories } = useCategories();

  const badges: { label: string; onRemove: () => void }[] = [];

  if (filters.type !== DEFAULT_FILTERS.type) {
    badges.push({
      label: filters.type === "expense" ? "Wydatki" : "Przychody",
      onRemove: () => onRemove("type"),
    });
  }

  for (const id of filters.categoryIds) {
    const cat = categories.find((c) => c.id === id);
    if (cat) {
      badges.push({
        label: `${cat.icon} ${cat.name}`,
        onRemove: () => onRemove("categoryIds", id),
      });
    }
  }

  if (filters.dateFrom) {
    badges.push({ label: `od ${filters.dateFrom}`, onRemove: () => onRemove("dateFrom") });
  }
  if (filters.dateTo) {
    badges.push({ label: `do ${filters.dateTo}`, onRemove: () => onRemove("dateTo") });
  }
  if (filters.amountMin !== null) {
    badges.push({ label: `min ${filters.amountMin} PLN`, onRemove: () => onRemove("amountMin") });
  }
  if (filters.amountMax !== null) {
    badges.push({ label: `max ${filters.amountMax} PLN`, onRemove: () => onRemove("amountMax") });
  }
  if (filters.search.trim()) {
    badges.push({ label: `"${filters.search}"`, onRemove: () => onRemove("search") });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {badges.map((badge, i) => (
        <span
          key={i}
          className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg"
        >
          {badge.label}
          <button
            onClick={badge.onRemove}
            className="ml-0.5 opacity-70 hover:opacity-100 text-sm leading-none"
          >
            ×
          </button>
        </span>
      ))}
      {badges.length > 1 && (
        <button
          onClick={onClearAll}
          className="px-2.5 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
        >
          Wyczyść wszystkie
        </button>
      )}
    </div>
  );
}
