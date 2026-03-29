import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionFiltersPanel } from "@/components/transactions/TransactionFilters";
import { ActiveFilters } from "@/components/transactions/ActiveFilters";
import { PageTransition } from "@/components/ui/PageTransition";
import { TransactionListSkeleton } from "@/components/ui/Skeleton";
import { useFilteredTransactions } from "@/hooks/useFilteredTransactions";
import { useSettingsStore } from "@/store/settingsStore";
import { useTransactionStore } from "@/store/transactionStore";
import { DEFAULT_FILTERS } from "@/types";
import type { Transaction, TransactionFilters } from "@/types";

export default function TransactionsPage() {
  const selectedMonth = useSettingsStore((s) => s.selectedMonth);
  const hasHydrated = useTransactionStore((s) => s._hasHydrated);
  const location = useLocation();

  const [filters, setFilters] = useState<TransactionFilters>(() => {
    // Pick up category filter passed from PieChart click
    const state = location.state as { categoryFilter?: string } | null;
    if (state?.categoryFilter) {
      return { ...DEFAULT_FILTERS, categoryIds: [state.categoryFilter] };
    }
    return DEFAULT_FILTERS;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  // Clear location state after reading it so back-navigation doesn't re-apply filter
  useEffect(() => {
    if (location.state) {
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const { filteredTransactions, totalCount } = useFilteredTransactions(filters, selectedMonth);

  const handleAdd = () => {
    setEditingTransaction(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (t: Transaction) => {
    setEditingTransaction(t);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  const handleRemoveFilter = (key: keyof TransactionFilters, value?: string) => {
    if (key === "categoryIds" && value) {
      setFilters((f) => ({ ...f, categoryIds: f.categoryIds.filter((id) => id !== value) }));
    } else {
      setFilters((f) => ({ ...f, [key]: DEFAULT_FILTERS[key] }));
    }
  };

  return (
    <PageTransition>
      <Header onAddTransaction={handleAdd} />

      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Transakcje{" "}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({totalCount})
            </span>
          </h1>
        </div>

        <TransactionFiltersPanel filters={filters} onChange={setFilters} />

        <ActiveFilters
          filters={filters}
          onRemove={handleRemoveFilter}
          onClearAll={() => setFilters(DEFAULT_FILTERS)}
        />

        {!hasHydrated ? (
          <TransactionListSkeleton />
        ) : (
          <TransactionList
            transactions={filteredTransactions}
            onEdit={handleEdit}
            onAdd={handleAdd}
          />
        )}
      </div>

      {/* FAB */}
      <button
        onClick={handleAdd}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-20"
        aria-label="Dodaj transakcję"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleClose}
        transaction={editingTransaction}
      />
    </PageTransition>
  );
}
