import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TransactionFilters } from "@/types";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/utils/cn";

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onChange: (f: TransactionFilters) => void;
}

export function TransactionFiltersPanel({ filters, onChange }: TransactionFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { categories } = useCategories();

  const update = <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleCategory = (id: string) => {
    const ids = filters.categoryIds.includes(id)
      ? filters.categoryIds.filter((x) => x !== id)
      : [...filters.categoryIds, id];
    update("categoryIds", ids);
  };

  const hasActiveFilters =
    filters.type !== "all" ||
    filters.categoryIds.length > 0 ||
    filters.dateFrom !== null ||
    filters.dateTo !== null ||
    filters.amountMin !== null ||
    filters.amountMax !== null ||
    filters.search.trim() !== "";

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-colors",
            isOpen || hasActiveFilters
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
              : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          )}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filtry
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
          )}
          <svg
            className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Inline search */}
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            placeholder="Szukaj transakcji..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => update("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 space-y-4">
              {/* Type */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Typ</p>
                <div className="flex gap-2">
                  {(["all", "expense", "income"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => update("type", t)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                        filters.type === t
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                      )}
                    >
                      {t === "all" ? "Wszystkie" : t === "expense" ? "Wydatki" : "Przychody"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Kategorie</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-colors",
                        filters.categoryIds.includes(cat.id)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                      )}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Od daty</p>
                  <input
                    type="date"
                    value={filters.dateFrom ?? ""}
                    onChange={(e) => update("dateFrom", e.target.value || null)}
                    className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Do daty</p>
                  <input
                    type="date"
                    value={filters.dateTo ?? ""}
                    onChange={(e) => update("dateTo", e.target.value || null)}
                    className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Amount range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Min kwota (PLN)</p>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="np. 10"
                    value={filters.amountMin ?? ""}
                    onChange={(e) => update("amountMin", e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Max kwota (PLN)</p>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="np. 500"
                    value={filters.amountMax ?? ""}
                    onChange={(e) => update("amountMax", e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Sortowanie</p>
                <select
                  value={filters.sortBy}
                  onChange={(e) => update("sortBy", e.target.value as TransactionFilters["sortBy"])}
                  className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500"
                >
                  <option value="newest">Najnowsze</option>
                  <option value="oldest">Najstarsze</option>
                  <option value="amount_desc">Kwota malejąco</option>
                  <option value="amount_asc">Kwota rosnąco</option>
                </select>
              </div>

              {/* Clear */}
              {hasActiveFilters && (
                <button
                  onClick={() => onChange({ type: "all", categoryIds: [], dateFrom: null, dateTo: null, amountMin: null, amountMax: null, search: "", sortBy: "newest" })}
                  className="w-full py-2 text-sm text-red-500 dark:text-red-400 hover:text-red-600 font-medium"
                >
                  Wyczyść filtry
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
