import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { CategoryIcon } from "./CategoryIcon";
import { useToast } from "@/hooks/useToast";
import { useCategories } from "@/hooks/useCategories";
import { categorySchema, type CategoryFormData } from "@/schemas/categorySchema";
import { cn } from "@/utils/cn";
import type { Category } from "@/types";

const POPULAR_ICONS = ["🍕","🚗","🎬","💡","🛒","💊","📚","📦","💰","💻","💵","🏠","✈️","🎵","🐕","🎮","🍺","🌿","🏋️","🎨","🎁","🍔","☕","🏥","💅","🎓","🏖","🚀","🎯","💎"];
const PRESET_COLORS = ["#EF9F27","#378ADD","#D85A30","#E24B4A","#7F77DD","#1D9E75","#534AB7","#888780","#639922","#5DCAA5","#F472B6","#06B6D4"];

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
}

export function CategoryForm({ isOpen, onClose, category }: CategoryFormProps) {
  const { addCategory, updateCategory } = useCategories();
  const { showToast } = useToast();
  const isEdit = !!category;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", icon: "📦", color: "#888780", type: "expense" },
  });

  const watchedIcon = watch("icon");
  const watchedColor = watch("color");
  const watchedName = watch("name");

  useEffect(() => {
    if (isOpen) {
      if (category) {
        reset({ name: category.name, icon: category.icon, color: category.color, type: category.type });
      } else {
        reset({ name: "", icon: "📦", color: "#888780", type: "expense" });
      }
    }
  }, [isOpen, category, reset]);

  const onSubmit = (data: CategoryFormData) => {
    if (isEdit && category) {
      updateCategory(category.id, { name: data.name, icon: data.icon, color: data.color });
      showToast({ message: "Kategoria zaktualizowana ✓", type: "success" });
    } else {
      addCategory({ name: data.name, icon: data.icon, color: data.color, type: data.type });
      showToast({ message: "Kategoria dodana ✓", type: "success" });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edytuj kategorię" : "Nowa kategoria"} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nazwa</label>
          <input
            {...register("name")}
            placeholder="np. Siłownia"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-blue-500 transition-colors"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Type (only for new) */}
        {!isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Typ</label>
            <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={() => setValue("type", "expense")}
                className={cn(
                  "flex-1 py-2 text-sm font-medium transition-colors",
                  watch("type") === "expense" ? "bg-red-500 text-white" : "bg-transparent text-gray-500 dark:text-gray-400"
                )}
              >
                💸 Wydatek
              </button>
              <button
                type="button"
                onClick={() => setValue("type", "income")}
                className={cn(
                  "flex-1 py-2 text-sm font-medium transition-colors",
                  watch("type") === "income" ? "bg-green-500 text-white" : "bg-transparent text-gray-500 dark:text-gray-400"
                )}
              >
                💰 Przychód
              </button>
            </div>
          </div>
        )}

        {/* Icon picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ikona</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {POPULAR_ICONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setValue("icon", emoji)}
                className={cn(
                  "w-9 h-9 text-xl rounded-lg flex items-center justify-center transition-colors",
                  watchedIcon === emoji
                    ? "bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                {emoji}
              </button>
            ))}
          </div>
          <input
            {...register("icon")}
            placeholder="lub wpisz emoji..."
            maxLength={4}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-blue-500"
          />
          {errors.icon && <p className="text-xs text-red-500 mt-1">{errors.icon.message}</p>}
        </div>

        {/* Color picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kolor</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue("color", color)}
                className={cn(
                  "w-8 h-8 rounded-full transition-transform",
                  watchedColor === color ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <input
            {...register("color")}
            type="color"
            className="h-9 w-full rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer"
          />
          {errors.color && <p className="text-xs text-red-500 mt-1">{errors.color.message}</p>}
        </div>

        {/* Preview */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex items-center gap-3">
          <CategoryIcon icon={watchedIcon || "📦"} color={watchedColor || "#888780"} size="md" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {watchedName || "Podgląd kategorii"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
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
  );
}
