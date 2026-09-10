import { HotAirBalloonLoading } from '@/components/brand/HotAirBalloonLoading';
import { ListCardSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Skeleton */}
      <div className="rounded-3xl bg-white border border-[#E8DECA] p-8 space-y-6 shadow-2xs">
        <div className="flex items-center gap-5">
          <Skeleton className="h-20 w-20 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-7 w-48 rounded-lg" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
        </div>
      </div>

      <HotAirBalloonLoading
        message="Loading Traveler Profile"
        submessage="Fetching public wander lists and curated places..."
        size={110}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <ListCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
