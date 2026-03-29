export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number; // W GROSZACH! 1234 = 12,34 PLN
  title: string;
  categoryId: string;
  date: string; // ISO "2026-03-28"
  note: string | null;
  createdAt: string; // ISO timestamp
}
