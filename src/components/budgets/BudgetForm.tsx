import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { AmountInput } from "@/components/ui/AmountInput";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/hooks/useToast";
import { useBudgets } from "@/hooks/useBudgets";
import { useCategories } from "@/hooks/useCategories";
import { useSettingsStore } from "@/store/settingsStore";
import { budgetFormSchema, type BudgetFormData } from "@/schemas/budgetSchema";
import { amountStrToGroszeAmount } from "@/schemas/transactionSchema";
import type { Budget } from "@/types";

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  budget?: Budget;
}

export function BudgetForm({ isOpen, onClose, budget }: BudgetFormProps) {
  const { addBudget, updateBudget, deleteBudget, getBudgetsByMonth } = useBudgets();
  const { expenseCategories } = useCategories();
  const { showToast } = useToast();
  const selectedMonth = useSettingsStore((s) => s.selectedMonth);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isEdit = !!budget;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: { categoryId: "", amountStr: "", month: selectedMonth },
  });

  // Categories that don't already have a budget this month (except the one being edited)
  const existingBudgets = getBudgetsByMonth(selectedMonth);
  const availableCategories = expenseCategories.filter(
    (c) =>
      !existingBudgets.some(
        (b) => b.categoryId === c.id && b.id !== budget?.id
      )
  );

  useEffect(() => {
    if (isOpen) {
      if (budget) {
        reset({
          categoryId: budget.categoryId,
          amountStr: (budget.amount / 100).toFixed(2).replace(".", ","),
          month: budget.month,
        });
      } else {
        reset({ categoryId: "", amountStr: "", month: selectedMonth });
      }
    }
  }, [isOpen, budget, reset, selectedMonth]);

  const onSubmit = (data: BudgetFormData) => {
    const amount = amountStrToGroszeAmount(data.amountStr);
    const payload = { categoryId: data.categoryId, amount, month: data.month };

    if (isEdit && budget) {
      updateBudget(budget.id, payload);
      showToast({ message: "Budżet zaktualizowany ✓", type: "success" });
    } else {
      addBudget(payload);
      showToast({ message: "Budżet dodany ✓", type: "success" });
    }
    onClose();
  };

  const handleDelete = () => {
    if (budget) {
      deleteBudget(budget.id);
      showToast({ message: "Budżet usunięty", type: "info" });
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edytuj budżet" : "Nowy budżet"} size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kategoria
            </label>
            <select
              {...register("categoryId")}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Wybierz kategorię</option>
              {availableCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Limit miesięczny
            </label>
            <Controller
              name="amountStr"
              control={control}
              render={({ field }) => (
                <AmountInput
                  {...field}
                  onChange={field.onChange}
                  error={errors.amountStr?.message}
                />
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            {isEdit && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2.5 text-sm font-medium rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                🗑 Usuń
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              {isEdit ? "Zapisz" : "Dodaj"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Usuń budżet"
        description="Czy na pewno chcesz usunąć ten budżet? Tej operacji nie można cofnąć."
        confirmLabel="Usuń"
        variant="danger"
      />
    </>
  );
}
