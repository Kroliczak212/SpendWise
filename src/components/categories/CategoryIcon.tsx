import { cn } from "@/utils/cn";

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-base",
  md: "w-10 h-10 text-xl",
  lg: "w-12 h-12 text-2xl",
};

export function CategoryIcon({ icon, color, size = "md", className }: CategoryIconProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center shrink-0",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: `${color}25` }}
    >
      <span>{icon}</span>
    </div>
  );
}
