import { z } from "zod";
import { format } from "date-fns";
import type { Transaction, Category, Budget, AppSettings } from "@/types";

const transactionSchema = z.object({
  id: z.string(),
  type: z.enum(["income", "expense"]),
  amount: z.number().int(),
  title: z.string(),
  categoryId: z.string(),
  date: z.string(),
  note: z.string().nullable(),
  createdAt: z.string(),
});

const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  type: z.enum(["income", "expense"]),
  isDefault: z.boolean(),
});

const budgetSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  amount: z.number().int(),
  month: z.string(),
});

const settingsSchema = z.object({
  currency: z.enum(["PLN", "EUR", "USD"]),
  theme: z.enum(["light", "dark"]),
  selectedMonth: z.string(),
});

export const exportSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  data: z.object({
    transactions: z.array(transactionSchema),
    categories: z.array(categorySchema),
    budgets: z.array(budgetSchema),
    settings: settingsSchema,
  }),
});

export type ExportData = z.infer<typeof exportSchema>;

export interface ImportResult {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  settings: AppSettings;
}

export function exportData(
  transactions: Transaction[],
  categories: Category[],
  budgets: Budget[],
  settings: AppSettings
): void {
  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    data: { transactions, categories, budgets, settings },
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const dateStr = format(new Date(), "yyyy-MM-dd");
  const a = document.createElement("a");
  a.href = url;
  a.download = `spendwise-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importData(file: File): Promise<ImportResult> {
  const text = await file.text();
  const raw = JSON.parse(text);
  const parsed = exportSchema.parse(raw);
  return parsed.data;
}
