import { useBudgetStore } from "@/store/budgetStore";

export function useBudgets() {
  const store = useBudgetStore();
  return {
    budgets: store.budgets,
    addBudget: store.addBudget,
    updateBudget: store.updateBudget,
    deleteBudget: store.deleteBudget,
    clearBudgets: store.clearBudgets,
    getBudgetsByMonth: store.getBudgetsByMonth,
    getBudgetForCategory: store.getBudgetForCategory,
  };
}
