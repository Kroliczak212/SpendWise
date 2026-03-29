import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/utils/cn";
import type { Currency } from "@/types";

const OPTIONS: { value: Currency; label: string; flag: string }[] = [
  { value: "PLN", label: "Polski złoty", flag: "🇵🇱" },
  { value: "EUR", label: "Euro", flag: "🇪🇺" },
  { value: "USD", label: "Dolar US", flag: "🇺🇸" },
];

export function CurrencySelect() {
  const currency = useSettingsStore((s) => s.currency);
  const setCurrency = useSettingsStore((s) => s.setCurrency);

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Waluta</h2>
      <div className="flex gap-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setCurrency(opt.value)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-colors text-sm font-medium",
              currency === opt.value
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500"
            )}
          >
            <span className="text-2xl">{opt.flag}</span>
            <span>{opt.value}</span>
            <span className="text-xs opacity-70">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
