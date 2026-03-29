import { useCategoryStore } from "@/store/categoryStore";

export function useCategories() {
  const store = useCategoryStore();

  const expenseCategories = store.categories.filter((c) => c.type === "expense");
  const incomeCategories = store.categories.filter((c) => c.type === "income");

  return {
    categories: store.categories,
    expenseCategories,
    incomeCategories,
    addCategory: store.addCategory,
    updateCategory: store.updateCategory,
    deleteCategory: store.deleteCategory,
    resetToDefaults: store.resetToDefaults,
    setCategories: store.setCategories,
  };
}
