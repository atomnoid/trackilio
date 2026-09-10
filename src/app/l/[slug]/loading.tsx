import { HotAirBalloonLoading } from '@/components/brand/HotAirBalloonLoading';
import { PlaceCardSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function ListDetailLoading() {
  return (
    <div className="pb-24 space-y-10">
      {/* Header Skeleton */}
      <section className="bg-white/95 border-b border-[#E8DECA] py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-xl" />
          </div>
          <Skeleton className="h-10 w-2/3 rounded-xl" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-4">
            <HotAirBalloonLoading
              message="Opening Travel Guide"
              submessage="Loading saved places, maps, and insider recommendations..."
              size={110}
            />
            {Array.from({ length: 4 }).map((_, i) => (
              <PlaceCardSkeleton key={i} />
            ))}
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl bg-white border border-[#E8DECA] p-6 space-y-3">
              <Skeleton className="h-5 w-1/3 rounded-lg" />
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-4/5 rounded-md" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
