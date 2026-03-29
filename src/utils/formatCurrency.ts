import type { Currency } from "@/types";

const FORMATTERS: Record<Currency, Intl.NumberFormat> = {
  PLN: new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }),
  EUR: new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }),
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
};

export function formatCurrency(amountInCents: number, currency: Currency): string {
  const amount = amountInCents / 100;
  return FORMATTERS[currency].format(amount);
}

export function formatCurrencyCompact(amountInCents: number, currency: Currency): string {
  const amount = amountInCents / 100;
  const formatter = new Intl.NumberFormat(
    currency === "PLN" ? "pl-PL" : currency === "EUR" ? "de-DE" : "en-US",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );
  return formatter.format(amount);
}
