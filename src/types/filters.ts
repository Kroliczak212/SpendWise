import type { TransactionType } from "./transaction";

export type SortOption = "newest" | "oldest" | "amount_desc" | "amount_asc";

export interface TransactionFilters {
  search: string;
  type: TransactionType | "all";
  categoryIds: string[];
  dateFrom: string | null;
  dateTo: string | null;
  amountMin: number | null;
  amountMax: number | null;
  sortBy: SortOption;
}

export const DEFAULT_FILTERS: TransactionFilters = {
  search: "",
  type: "all",
  categoryIds: [],
  dateFrom: null,
  dateTo: null,
  amountMin: null,
  amountMax: null,
  sortBy: "newest",
};
