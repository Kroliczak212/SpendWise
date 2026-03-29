import { z } from "zod";

export const budgetSchema = z.object({
  categoryId: z.string().min(1, "Wybierz kategorię"),
  amount: z.number().int().positive("Limit musi być większy niż 0"),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Nieprawidłowy format miesiąca"),
});

export const budgetFormSchema = z.object({
  categoryId: z.string().min(1, "Wybierz kategorię"),
  amountStr: z
    .string()
    .min(1, "Podaj kwotę")
    .refine((val) => {
      const num = parseFloat(val.replace(",", "."));
      return !isNaN(num) && num > 0;
    }, "Limit musi być większy niż 0"),
  month: z.string().min(1, "Wybierz miesiąc"),
});

export type BudgetFormData = z.infer<typeof budgetFormSchema>;
