import { HotAirBalloonLoading } from '@/components/brand/HotAirBalloonLoading';
import { ListCardSkeleton } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <HotAirBalloonLoading
        message="Loading Your Travel Dashboard"
        submessage="Gathering your curated wander lists and saved places..."
        size={120}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ListCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
