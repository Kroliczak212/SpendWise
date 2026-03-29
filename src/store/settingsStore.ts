import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Currency, Theme } from "@/types";
import { getCurrentMonth, addMonths } from "@/utils/dateHelpers";

interface SettingsStore {
  currency: Currency;
  theme: Theme;
  selectedMonth: string;
  setCurrency: (c: Currency) => void;
  setTheme: (t: Theme) => void;
  setSelectedMonth: (m: string) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  initTheme: () => void;
}

function applyTheme(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      currency: "PLN",
      theme: "light",
      selectedMonth: getCurrentMonth(),

      setCurrency: (currency) => set({ currency }),

      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },

      setSelectedMonth: (selectedMonth) => set({ selectedMonth }),

      nextMonth: () => {
        const current = get().selectedMonth;
        const next = addMonths(current, 1);
        const maxMonth = addMonths(getCurrentMonth(), 1);
        if (next <= maxMonth) set({ selectedMonth: next });
      },

      prevMonth: () => {
        const current = get().selectedMonth;
        const prev = addMonths(current, -1);
        const minMonth = addMonths(getCurrentMonth(), -12);
        if (prev >= minMonth) set({ selectedMonth: prev });
      },

      initTheme: () => {
        applyTheme(get().theme);
      },
    }),
    { name: "spendwise-settings" }
  )
);
