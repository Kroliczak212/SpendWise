import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category } from "@/types";
import { DEFAULT_CATEGORIES } from "@/utils/defaultCategories";

interface CategoryStore {
  categories: Category[];
  addCategory: (data: Omit<Category, "id" | "isDefault">) => void;
  updateCategory: (id: string, data: Partial<Omit<Category, "id" | "isDefault">>) => void;
  deleteCategory: (id: string) => void;
  resetToDefaults: () => void;
  setCategories: (categories: Category[]) => void;
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],

      addCategory: (data) =>
        set((state) => ({
          categories: [
            ...state.categories,
            { ...data, id: crypto.randomUUID(), isDefault: false },
          ],
        })),

      updateCategory: (id, data) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),

      deleteCategory: (id) => {
        const cat = get().categories.find((c) => c.id === id);
        if (cat?.isDefault) return;
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },

      resetToDefaults: () =>
        set((state) => ({
          categories: [
            ...DEFAULT_CATEGORIES,
            ...state.categories.filter((c) => !c.isDefault),
          ],
        })),

      setCategories: (categories) => set({ categories }),
    }),
    {
      name: "spendwise-categories",
      onRehydrateStorage: () => (state) => {
        if (state && state.categories.length === 0) {
          state.setCategories([...DEFAULT_CATEGORIES]);
        }
      },
    }
  )
);
