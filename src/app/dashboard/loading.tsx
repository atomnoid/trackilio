import { ListCardSkeleton } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Page header skeleton */}
      <div className="space-y-3">
        <div className="skeleton-shimmer h-9 w-48 rounded-xl" />
        <div className="skeleton-shimmer h-4 w-64 rounded-lg" />
      </div>

      {/* Stats row */}
      <div className="flex gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-16 w-28 rounded-2xl" />
        ))}
      </div>

      {/* Lists grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ListCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
