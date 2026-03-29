import type { Transaction, TransactionType } from "@/types";
import { isDateInMonth, getLastNMonths } from "./dateHelpers";

export function sumTransactions(transactions: Transaction[], type: TransactionType): number {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateBalance(transactions: Transaction[]): number {
  const income = sumTransactions(transactions, "income");
  const expense = sumTransactions(transactions, "expense");
  return income - expense;
}

export function calculateBudgetUsage(spent: number, limit: number): number {
  if (limit === 0) return 0;
  return Math.round((spent / limit) * 100);
}

export type BudgetStatus = "safe" | "warning" | "danger" | "exceeded";

export function getBudgetStatus(percentage: number): BudgetStatus {
  if (percentage >= 100) return "exceeded";
  if (percentage >= 80) return "danger";
  if (percentage >= 60) return "warning";
  return "safe";
}

export interface MoMTrend {
  percentage: number;
  direction: "up" | "down" | "same";
}

export function calculateMoMTrend(current: number, previous: number): MoMTrend {
  if (previous === 0 && current === 0) {
    return { percentage: 0, direction: "same" };
  }
  if (previous === 0) {
    // No prior month data — treat as 100% increase
    return { percentage: 100, direction: "up" };
  }
  const diff = current - previous;
  const percentage = Math.abs(Math.round((diff / previous) * 100));
  const direction = diff > 0 ? "up" : diff < 0 ? "down" : "same";
  return { percentage, direction };
}

export interface CategorySpending {
  categoryId: string;
  total: number;
  percentage: number;
}

export function groupSpendingByCategory(transactions: Transaction[]): CategorySpending[] {
  const expenses = transactions.filter((t) => t.type === "expense");
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  const map = new Map<string, number>();
  for (const t of expenses) {
    map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
  }

  return Array.from(map.entries())
    .map(([categoryId, total]) => ({
      categoryId,
      total,
      percentage: totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export interface DailySpending {
  day: number;
  amount: number;
  dateStr: string;
}

export function getDailySpending(transactions: Transaction[], month: string): DailySpending[] {
  const expenses = transactions.filter(
    (t) => t.type === "expense" && isDateInMonth(t.date, month)
  );

  const map = new Map<string, number>();
  for (const t of expenses) {
    map.set(t.date, (map.get(t.date) ?? 0) + t.amount);
  }

  return Array.from(map.entries())
    .map(([dateStr, amount]) => ({
      day: parseInt(dateStr.split("-")[2], 10),
      amount,
      dateStr,
    }))
    .sort((a, b) => a.day - b.day);
}

export interface MonthlyTrendPoint {
  month: string;
  income: number;
  expense: number;
}

export function getMonthlyTrend(
  transactions: Transaction[],
  months: string[]
): MonthlyTrendPoint[] {
  return months.map((month) => {
    const monthTransactions = transactions.filter((t) => isDateInMonth(t.date, month));
    return {
      month,
      income: sumTransactions(monthTransactions, "income"),
      expense: sumTransactions(monthTransactions, "expense"),
    };
  });
}

export function getTopExpenses(transactions: Transaction[], limit = 5): Transaction[] {
  return transactions
    .filter((t) => t.type === "expense")
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

export { getLastNMonths };
