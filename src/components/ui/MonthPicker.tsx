import { useSettingsStore } from "@/store/settingsStore";
import { formatMonthLabel, getCurrentMonth, addMonths } from "@/utils/dateHelpers";

export function MonthPicker() {
  const selectedMonth = useSettingsStore((s) => s.selectedMonth);
  const nextMonth = useSettingsStore((s) => s.nextMonth);
  const prevMonth = useSettingsStore((s) => s.prevMonth);

  const current = getCurrentMonth();
  const maxMonth = addMonths(current, 1);
  const minMonth = addMonths(current, -12);

  const canGoNext = selectedMonth < maxMonth;
  const canGoPrev = selectedMonth > minMonth;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={prevMonth}
        disabled={!canGoPrev}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Poprzedni miesiąc"
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <span className="min-w-[160px] text-center font-semibold text-gray-800 dark:text-gray-100 capitalize">
        {formatMonthLabel(selectedMonth)}
      </span>

      <button
        onClick={nextMonth}
        disabled={!canGoNext}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Następny miesiąc"
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
