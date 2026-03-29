export type CategoryType = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  icon: string; // emoji "🍕"
  color: string; // hex "#EF9F27"
  type: CategoryType;
  isDefault: boolean;
}
