import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { AmountInput } from "@/components/ui/AmountInput";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/hooks/useToast";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { transactionFormSchema, type TransactionFormData, amountStrToGroszeAmount } from "@/schemas/transactionSchema";
import { getTodayISO } from "@/utils/dateHelpers";
import { cn } from "@/utils/cn";
import type { Transaction } from "@/types";

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction;
}

export function TransactionForm({ isOpen, onClose, transaction }: TransactionFormProps) {
  const { addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { expenseCategories, incomeCategories } = useCategories();
  const { showToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isEdit = !!transaction;
  const prevTypeRef = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: "expense",
      amountStr: "",
      title: "",
      categoryId: "",
      date: getTodayISO(),
      note: null,
    },
  });

  const selectedType = watch("type");
  const currentCategoryId = watch("categoryId");
  const noteValue = watch("note") ?? "";
  const categories = selectedType === "income" ? incomeCategories : expenseCategories;

  // Clear categoryId when type changes and selected category doesn't belong to new type
  useEffect(() => {
    if (prevTypeRef.current !== null && prevTypeRef.current !== selectedType) {
      const categoryBelongsToNewType = categories.some((c) => c.id === currentCategoryId);
      if (!categoryBelongsToNewType) {
        setValue("categoryId", "");
      }
    }
    prevTypeRef.current = selectedType;
  }, [selectedType, categories, currentCategoryId, setValue]);

  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        const amountStr = (transaction.amount / 100).toFixed(2).replace(".", ",");
        reset({
          type: transaction.type,
          amountStr,
          title: transaction.title,
          categoryId: transaction.categoryId,
          date: transaction.date,
          note: transaction.note,
        });
      } else {
        reset({
          type: "expense",
          amountStr: "",
          title: "",
          categoryId: "",
          date: getTodayISO(),
          note: null,
        });
      }
    }
  }, [isOpen, transaction, reset]);

  const onSubmit = (data: TransactionFormData) => {
    const amount = amountStrToGroszeAmount(data.amountStr);
    const payload = {
      type: data.type,
      amount,
      title: data.title,
      categoryId: data.categoryId,
      date: data.date,
      note: data.note || null,
    };

    if (isEdit && transaction) {
      updateTransaction(transaction.id, payload);
      showToast({ message: "Transakcja zaktualizowana ✓", type: "success" });
    } else {
      addTransaction(payload);
      showToast({ message: "Transakcja dodana ✓", type: "success" });
    }
    onClose();
  };

  const handleDelete = () => {
    if (transaction) {
      deleteTransaction(transaction.id);
      showToast({ message: "Transakcja usunięta", type: "info" });
      onClose();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEdit ? "Edytuj transakcję" : "Nowa transakcja"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Type toggle */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <>
                  <button
                    type="button"
                    onClick={() => field.onChange("expense")}
                    className={cn(
                      "flex-1 py-2.5 text-sm font-semibold transition-colors",
                      field.value === "expense"
                        ? "bg-red-500 text-white"
                        : "bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    )}
                  >
                    💸 Wydatek
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange("income")}
                    className={cn(
                      "flex-1 py-2.5 text-sm font-semibold transition-colors",
                      field.value === "income"
                        ? "bg-green-500 text-white"
                        : "bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    )}
                  >
                    💰 Przychód
                  </button>
                </>
              )}
            />
          </div>

          {/* Amount */}
          <div>
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

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tytuł
            </label>
            <input
              {...register("title")}
              placeholder="np. Zakupy w Biedronce"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-blue-500 transition-colors"
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

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
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data
            </label>
            <input
              {...register("date")}
              type="date"
              max={getTodayISO()}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-blue-500 transition-colors"
            />
            {errors.date && (
              <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notatka{" "}
              <span className="text-gray-400 font-normal text-xs">
                ({noteValue?.length ?? 0}/200)
              </span>
            </label>
            <textarea
              {...register("note")}
              rows={2}
              placeholder="Opcjonalna notatka..."
              maxLength={200}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-blue-500 transition-colors resize-none"
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
        title="Usuń transakcję"
        description={`Czy na pewno chcesz usunąć "${transaction?.title}"? Tej operacji nie można cofnąć.`}
        confirmLabel="Usuń"
        variant="danger"
      />
    </>
  );
}
