import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Budget } from "@/types";

interface BudgetStore {
  budgets: Budget[];
  addBudget: (data: Omit<Budget, "id">) => void;
  updateBudget: (id: string, data: Partial<Omit<Budget, "id">>) => void;
  deleteBudget: (id: string) => void;
  clearBudgets: () => void;
  restoreBudgets: (budgets: Budget[]) => void;
  getBudgetsByMonth: (month: string) => Budget[];
  getBudgetForCategory: (categoryId: string, month: string) => Budget | undefined;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      budgets: [],

      addBudget: (data) =>
        set((state) => ({
          budgets: [
            ...state.budgets,
            { ...data, id: crypto.randomUUID() },
          ],
        })),

      updateBudget: (id, data) =>
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...data } : b
          ),
        })),

      deleteBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        })),

      clearBudgets: () => set({ budgets: [] }),

      restoreBudgets: (budgets) => set({ budgets }),

      getBudgetsByMonth: (month) =>
        get().budgets.filter((b) => b.month === month),

      getBudgetForCategory: (categoryId, month) =>
        get().budgets.find(
          (b) => b.categoryId === categoryId && b.month === month
        ),
    }),
    { name: "spendwise-budgets" }
  )
);
