import type { Category } from "@/types";

export const DEFAULT_CATEGORIES: Category[] = [
  // WYDATKI
  { id: "food", name: "Jedzenie", icon: "🍕", color: "#EF9F27", type: "expense", isDefault: true },
  { id: "transport", name: "Transport", icon: "🚗", color: "#378ADD", type: "expense", isDefault: true },
  { id: "entertainment", name: "Rozrywka", icon: "🎬", color: "#D85A30", type: "expense", isDefault: true },
  { id: "bills", name: "Rachunki", icon: "💡", color: "#E24B4A", type: "expense", isDefault: true },
  { id: "shopping", name: "Zakupy", icon: "🛒", color: "#7F77DD", type: "expense", isDefault: true },
  { id: "health", name: "Zdrowie", icon: "💊", color: "#1D9E75", type: "expense", isDefault: true },
  { id: "education", name: "Edukacja", icon: "📚", color: "#534AB7", type: "expense", isDefault: true },
  { id: "other_expense", name: "Inne wydatki", icon: "📦", color: "#888780", type: "expense", isDefault: true },

  // PRZYCHODY
  { id: "salary", name: "Wynagrodzenie", icon: "💰", color: "#639922", type: "income", isDefault: true },
  { id: "freelance", name: "Freelance", icon: "💻", color: "#0F6E56", type: "income", isDefault: true },
  { id: "other_income", name: "Inne przychody", icon: "💵", color: "#5DCAA5", type: "income", isDefault: true },
];
