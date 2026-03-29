import { useTransactionStore } from "@/store/transactionStore";
import { useSettingsStore } from "@/store/settingsStore";

export function useTransactions() {
  const store = useTransactionStore();
  const selectedMonth = useSettingsStore((s) => s.selectedMonth);

  return {
    transactions: store.transactions,
    addTransaction: store.addTransaction,
    updateTransaction: store.updateTransaction,
    deleteTransaction: store.deleteTransaction,
    clearTransactions: store.clearTransactions,
    getByMonth: store.getTransactionsByMonth,
    getByCategory: store.getTransactionsByCategory,
    monthTransactions: store.getTransactionsByMonth(selectedMonth),
  };
}
