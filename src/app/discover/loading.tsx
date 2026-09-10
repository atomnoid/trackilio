import { HotAirBalloonLoading } from '@/components/brand/HotAirBalloonLoading';
import { ListCardSkeleton } from '@/components/ui/Skeleton';

export default function DiscoverLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center space-y-3">
        <HotAirBalloonLoading
          message="Discovering Authentic Travel Lists"
          submessage="Scanning community guides, cafes, viewpoints, and hidden gems..."
          size={120}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ListCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
