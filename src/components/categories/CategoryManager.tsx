import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CategoryIcon } from "./CategoryIcon";
import { CategoryForm } from "./CategoryForm";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/hooks/useToast";
import { useCategories } from "@/hooks/useCategories";
import { useTransactionStore } from "@/store/transactionStore";
import type { Category } from "@/types";

export function CategoryManager() {
  const { categories, deleteCategory } = useCategories();
  const allTransactions = useTransactionStore((s) => s.transactions);
  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [deletingCategory, setDeletingCategory] = useState<Category | undefined>();

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  const countTransactions = (id: string) =>
    allTransactions.filter((t) => t.categoryId === id).length;

  const canDelete = (c: Category) =>
    !c.isDefault && countTransactions(c.id) === 0;

  const handleDelete = () => {
    if (deletingCategory) {
      deleteCategory(deletingCategory.id);
      showToast({ message: "Kategoria usunięta", type: "info" });
    }
  };

  const renderGroup = (title: string, cats: Category[]) => (
    <div className="mb-6">
      <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 px-1">{title}</h3>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-50 dark:divide-gray-700/50">
        <AnimatePresence>
          {cats.map((cat) => {
            const txCount = countTransactions(cat.id);
            const deletable = canDelete(cat);
            return (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 px-4 py-3"
              >
                <CategoryIcon icon={cat.icon} color={cat.color} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{cat.name}</p>
                  {txCount > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{txCount} transakcji</p>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    cat.isDefault
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {cat.isDefault ? "Domyślna" : "Custom"}
                </span>
                <button
                  onClick={() => { setEditingCategory(cat); setIsFormOpen(true); }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition-colors"
                >
                  Edytuj
                </button>
                {!cat.isDefault && (
                  <button
                    onClick={() => deletable ? setDeletingCategory(cat) : undefined}
                    disabled={!deletable}
                    title={!deletable ? `Nie można usunąć — ${txCount} transakcji używa tej kategorii` : undefined}
                    className="text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                  >
                    Usuń
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {renderGroup("Wydatki", expenseCategories)}
      {renderGroup("Przychody", incomeCategories)}

      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingCategory(undefined); }}
        category={editingCategory}
      />

      <ConfirmDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(undefined)}
        onConfirm={handleDelete}
        title="Usuń kategorię"
        description={`Czy na pewno chcesz usunąć kategorię "${deletingCategory?.name}"?`}
        confirmLabel="Usuń"
        variant="danger"
      />
    </>
  );
}
