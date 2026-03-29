import { cn } from "@/utils/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700",
        className
      )}
    />
  );
}

export function TransactionListSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((group) => (
        <div
          key={group}
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 flex justify-between">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3.5 w-16" />
          </div>
          {[0, 1, 2].slice(0, group + 1).map((item) => (
            <div key={item} className="flex items-center gap-3 px-4 py-3 border-b last:border-0 border-gray-50 dark:border-gray-700/50">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="space-y-1.5 text-right">
                <Skeleton className="h-3.5 w-20 ml-auto" />
                <Skeleton className="h-3 w-12 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-4 max-w-5xl mx-auto">
      {/* Balance card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
        <Skeleton className="h-3.5 w-32 mb-2" />
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-3.5 w-40" />
      </div>
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <Skeleton className="h-3 w-20 mb-3" />
            <Skeleton className="h-6 w-28" />
          </div>
        ))}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <Skeleton className="h-4 w-36 mb-4" />
            <Skeleton className="h-52 w-full" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <Skeleton className="h-4 w-36 mb-4" />
            <Skeleton className="h-44 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
