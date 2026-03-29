import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().int().positive("Kwota musi być większa niż 0"),
  title: z.string().min(2, "Min. 2 znaki").max(100, "Max. 100 znaków"),
  categoryId: z.string().min(1, "Wybierz kategorię"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Nieprawidłowy format daty"),
  note: z.string().max(200, "Max. 200 znaków").nullable(),
});

// Schema dla React Hook Form — amount jako string (przed konwersją)
export const transactionFormSchema = z.object({
  type: z.enum(["income", "expense"]),
  amountStr: z
    .string()
    .min(1, "Podaj kwotę")
    .refine((val) => {
      const num = parseFloat(val.replace(",", "."));
      return !isNaN(num) && num > 0;
    }, "Kwota musi być większa niż 0"),
  title: z.string().min(2, "Min. 2 znaki").max(100, "Max. 100 znaków"),
  categoryId: z.string().min(1, "Wybierz kategorię"),
  date: z.string().min(1, "Wybierz datę"),
  note: z.string().max(200, "Max. 200 znaków").nullable(),
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>;

export function amountStrToGroszeAmount(amountStr: string): number {
  const normalized = amountStr.replace(",", ".");
  const float = parseFloat(normalized);
  return Math.round(float * 100);
}
