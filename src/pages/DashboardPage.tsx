import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { SpendingByCategory } from "@/components/dashboard/SpendingByCategory";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { DailySpendingBar } from "@/components/dashboard/DailySpendingBar";
import { TopExpenses } from "@/components/dashboard/TopExpenses";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { PageTransition } from "@/components/ui/PageTransition";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { useStats } from "@/hooks/useStats";
import { useSettingsStore } from "@/store/settingsStore";
import { useTransactionStore } from "@/store/transactionStore";
import type { Transaction } from "@/types";

export default function DashboardPage() {
  const selectedMonth = useSettingsStore((s) => s.selectedMonth);
  const hasHydrated = useTransactionStore((s) => s._hasHydrated);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const {
    totalIncome,
    totalExpense,
    balance,
    momTrend,
    spendingByCategory,
    dailySpending,
    monthlyTrend,
    topExpenses,
  } = useStats(selectedMonth);

  const handleEditTransaction = (t: Transaction) => {
    setEditingTransaction(t);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingTransaction(undefined);
    setIsFormOpen(true);
  };

  return (
    <PageTransition>
      <Header onAddTransaction={handleAdd} />

      {!hasHydrated ? (
        <DashboardSkeleton />
      ) : (
        <div className="p-4 md:p-6 space-y-4 max-w-5xl mx-auto">
          <BalanceCard balance={balance} momTrend={momTrend} month={selectedMonth} />

          <SummaryCards
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            balance={balance}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SpendingByCategory data={spendingByCategory} />
            <MonthlyTrendChart data={monthlyTrend} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DailySpendingBar data={dailySpending} month={selectedMonth} />
            <TopExpenses expenses={topExpenses} onEdit={handleEditTransaction} />
          </div>
        </div>
      )}

      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingTransaction(undefined); }}
        transaction={editingTransaction}
      />
    </PageTransition>
  );
}
