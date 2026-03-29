export interface Budget {
  id: string;
  categoryId: string;
  amount: number; // limit w GROSZACH
  month: string; // "YYYY-MM" np. "2026-03"
}
