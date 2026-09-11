import { ListCardSkeleton } from '@/components/ui/Skeleton';

export default function DiscoverLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Header skeleton */}
      <div className="space-y-3 text-center">
        <div className="skeleton-shimmer h-8 w-64 rounded-full mx-auto" />
        <div className="skeleton-shimmer h-4 w-80 rounded-full mx-auto" />
      </div>

      {/* Filter bar skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-8 w-20 rounded-full shrink-0" />
        ))}
      </div>

      {/* List grid skeleton — 9 cards matching the page */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <ListCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
