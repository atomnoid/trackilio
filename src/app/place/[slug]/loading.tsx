import { Skeleton } from '@/components/ui/Skeleton';

export default function PlaceLoading() {
  return (
    <div className="pb-24 animate-fade-in">
      {/* Banner skeleton */}
      <div className="w-full h-72 sm:h-96 skeleton-shimmer" />

      {/* Content skeleton */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-8">
        {/* Title block */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-10 w-3/4 rounded-xl" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
          <Skeleton className="h-4 w-4/6 rounded-md" />
        </div>

        {/* Details card */}
        <div className="rounded-2xl bg-white border border-[#E8DECA] p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3 items-center">
              <Skeleton className="h-5 w-5 rounded-md shrink-0" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
