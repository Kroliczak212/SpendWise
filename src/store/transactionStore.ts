import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Transaction } from "@/types";

interface TransactionStore {
  transactions: Transaction[];
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  addTransaction: (data: Omit<Transaction, "id" | "createdAt">) => void;
  updateTransaction: (id: string, data: Partial<Omit<Transaction, "id" | "createdAt">>) => void;
  deleteTransaction: (id: string) => void;
  clearTransactions: () => void;
  restoreTransactions: (transactions: Transaction[]) => void;
  getTransactionsByMonth: (month: string) => Transaction[];
  getTransactionsByCategory: (categoryId: string, month: string) => Transaction[];
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      addTransaction: (data) =>
        set((state) => ({
          transactions: [
            ...state.transactions,
            {
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateTransaction: (id, data) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      clearTransactions: () => set({ transactions: [] }),

      restoreTransactions: (transactions) => set({ transactions }),

      getTransactionsByMonth: (month) =>
        get().transactions.filter((t) => t.date.startsWith(month)),

      getTransactionsByCategory: (categoryId, month) =>
        get().transactions.filter(
          (t) => t.categoryId === categoryId && t.date.startsWith(month)
        ),
    }),
    {
      name: "spendwise-transactions",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
