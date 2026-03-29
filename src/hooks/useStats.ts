import { useMemo } from "react";
import { useTransactionStore } from "@/store/transactionStore";
import {
  sumTransactions,
  calculateBalance,
  calculateMoMTrend,
  groupSpendingByCategory,
  getDailySpending,
  getMonthlyTrend,
  getTopExpenses,
} from "@/utils/calculations";
import { addMonths, getLastNMonths } from "@/utils/dateHelpers";

export function useStats(month: string) {
  const allTransactions = useTransactionStore((s) => s.transactions);

  return useMemo(() => {
    const monthTransactions = allTransactions.filter((t) => t.date.startsWith(month));

    const prevMonth = addMonths(month, -1);
    const prevMonthTransactions = allTransactions.filter((t) => t.date.startsWith(prevMonth));

    const totalIncome = sumTransactions(monthTransactions, "income");
    const totalExpense = sumTransactions(monthTransactions, "expense");
    const balance = calculateBalance(monthTransactions);

    const prevBalance = calculateBalance(prevMonthTransactions);
    const prevTotalExpense = sumTransactions(prevMonthTransactions, "expense");

    const momTrend = calculateMoMTrend(totalExpense, prevTotalExpense);

    const spendingByCategory = groupSpendingByCategory(monthTransactions);
    const dailySpending = getDailySpending(monthTransactions, month);

    const last6Months = getLastNMonths(6);
    const monthlyTrend = getMonthlyTrend(allTransactions, last6Months);

    const topExpenses = getTopExpenses(monthTransactions);

    return {
      totalIncome,
      totalExpense,
      balance,
      prevMonthBalance: prevBalance,
      momTrend,
      spendingByCategory,
      dailySpending,
      monthlyTrend,
      topExpenses,
    };
  }, [allTransactions, month]);
}
