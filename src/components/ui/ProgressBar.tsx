import { cn } from "@/utils/cn";
import { getBudgetStatus } from "@/utils/calculations";

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ value, showLabel = false, className }: ProgressBarProps) {
  const status = getBudgetStatus(value);
  const capped = Math.min(value, 100);

  const barColor = {
    safe: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-orange-500",
    exceeded: "bg-red-500 animate-pulse",
  }[status];

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${capped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">{value}%</span>
      )}
    </div>
  );
}
