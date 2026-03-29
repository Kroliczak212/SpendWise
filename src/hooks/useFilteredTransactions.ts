import { useMemo } from "react";
import { useTransactionStore } from "@/store/transactionStore";
import type { TransactionFilters } from "@/types";
import { DEFAULT_FILTERS } from "@/types";

export function useFilteredTransactions(filters: TransactionFilters, month: string) {
  const allTransactions = useTransactionStore((s) => s.transactions);

  return useMemo(() => {
    let result = allTransactions.filter((t) => t.date.startsWith(month));

    // Type filter
    if (filters.type !== "all") {
      result = result.filter((t) => t.type === filters.type);
    }

    // Category filter
    if (filters.categoryIds.length > 0) {
      result = result.filter((t) => filters.categoryIds.includes(t.categoryId));
    }

    // Date range filter
    if (filters.dateFrom) {
      result = result.filter((t) => t.date >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      result = result.filter((t) => t.date <= filters.dateTo!);
    }

    // Amount filter (in cents) — use Math.round to avoid float precision issues
    if (filters.amountMin !== null) {
      result = result.filter((t) => t.amount >= Math.round(filters.amountMin! * 100));
    }
    if (filters.amountMax !== null) {
      result = result.filter((t) => t.amount <= Math.round(filters.amountMax! * 100));
    }

    // Search filter
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        result = [...result].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "oldest":
        result = [...result].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "amount_desc":
        result = [...result].sort((a, b) => b.amount - a.amount);
        break;
      case "amount_asc":
        result = [...result].sort((a, b) => a.amount - b.amount);
        break;
    }

    const hasActiveFilters =
      filters.type !== DEFAULT_FILTERS.type ||
      filters.categoryIds.length > 0 ||
      filters.dateFrom !== null ||
      filters.dateTo !== null ||
      filters.amountMin !== null ||
      filters.amountMax !== null ||
      filters.search.trim() !== "";

    return {
      filteredTransactions: result,
      totalCount: result.length,
      hasActiveFilters,
    };
  }, [allTransactions, filters, month]);
}
