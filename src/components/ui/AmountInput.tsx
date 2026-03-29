import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface AmountInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  onChange: (value: string) => void;
  error?: string;
}

export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  ({ onChange, error, className, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Allow digits, comma, and dot
      const raw = e.target.value;
      const filtered = raw.replace(/[^\d,.]/g, "");
      // Limit to 2 decimal places
      const normalized = filtered.replace(",", ".");
      const parts = normalized.split(".");
      let result = normalized;
      if (parts.length > 2) {
        result = parts[0] + "." + parts.slice(1).join("");
      }
      if (parts[1]?.length > 2) {
        result = parts[0] + "." + parts[1].slice(0, 2);
      }
      onChange(result.replace(".", ","));
    };

    return (
      <div>
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          placeholder="0,00"
          {...props}
          onChange={handleChange}
          className={cn(
            "w-full text-center text-3xl font-bold outline-none bg-transparent",
            "text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600",
            "border-b-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 pb-2",
            "transition-colors",
            error && "border-red-400",
            className
          )}
        />
        {error && <p className="text-xs text-red-500 mt-1 text-center">{error}</p>}
      </div>
    );
  }
);
AmountInput.displayName = "AmountInput";
