import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { BudgetCard } from "@/components/budgets/BudgetCard";
import { BudgetAlert } from "@/components/budgets/BudgetAlert";
import { BudgetForm } from "@/components/budgets/BudgetForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageTransition } from "@/components/ui/PageTransition";
import { useBudgets } from "@/hooks/useBudgets";
import { useCategories } from "@/hooks/useCategories";
import { useSettingsStore } from "@/store/settingsStore";
import { useTransactionStore } from "@/store/transactionStore";
import { calculateBudgetUsage } from "@/utils/calculations";
import type { Budget } from "@/types";

export default function BudgetsPage() {
  const selectedMonth = useSettingsStore((s) => s.selectedMonth);
  const { getBudgetsByMonth } = useBudgets();
  const { categories } = useCategories();
  const allTransactions = useTransactionStore((s) => s.transactions);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>();
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const budgets = getBudgetsByMonth(selectedMonth);

  const spentMap: Record<string, number> = {};
  for (const b of budgets) {
    spentMap[b.id] = allTransactions
      .filter((t) => t.categoryId === b.categoryId && t.date.startsWith(selectedMonth) && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  }

  const sorted = [...budgets].sort(
    (a, b) =>
      calculateBudgetUsage(spentMap[b.id] ?? 0, b.amount) -
      calculateBudgetUsage(spentMap[a.id] ?? 0, a.amount)
  );

  const handleAdd = () => {
    setEditingBudget(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (b: Budget) => {
    setEditingBudget(b);
    setIsFormOpen(true);
  };

  const handleAlertClick = (budgetId: string) => {
    cardRefs.current[budgetId]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <PageTransition>
      <Header />

      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Budżety</h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Dodaj budżet
          </button>
        </div>

        <BudgetAlert
          budgets={budgets}
          spentMap={spentMap}
          categories={categories}
          onAlertClick={handleAlertClick}
        />

        {sorted.length === 0 ? (
          <EmptyState
            icon="🎯"
            title="Brak budżetów"
            description="Dodaj pierwszy budżet miesięczny aby kontrolować wydatki"
            action={{ label: "Dodaj budżet", onClick: handleAdd }}
          />
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {sorted.map((b) => (
                <motion.div
                  key={b.id}
                  ref={(el) => { cardRefs.current[b.id] = el; }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <BudgetCard
                    budget={b}
                    spent={spentMap[b.id] ?? 0}
                    category={categories.find((c) => c.id === b.categoryId)}
                    onEdit={() => handleEdit(b)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <button
        onClick={handleAdd}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-20"
        aria-label="Dodaj budżet"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <BudgetForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingBudget(undefined); }}
        budget={editingBudget}
      />
    </PageTransition>
  );
}
