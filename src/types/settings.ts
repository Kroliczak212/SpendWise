export type Currency = "PLN" | "EUR" | "USD";
export type Theme = "light" | "dark";

export interface AppSettings {
  currency: Currency;
  theme: Theme;
  selectedMonth: string; // "YYYY-MM"
}
