import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`skeleton-shimmer rounded-xl ${className}`}
      {...props}
    />
  );
}

export function ListCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-[#E8DECA] p-5 space-y-4 shadow-2xs overflow-hidden">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4 rounded-lg" />
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-2/3 rounded-md" />
      <div className="flex items-center gap-3 pt-2 border-t border-[#E8DECA]/60">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-3 w-20 rounded-md" />
      </div>
    </div>
  );
}

export function PlaceCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-[#E8DECA] p-4 flex gap-4 shadow-2xs overflow-hidden">
      <Skeleton className="h-20 w-20 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2.5 py-1">
        <Skeleton className="h-5 w-3/5 rounded-lg" />
        <Skeleton className="h-3.5 w-4/5 rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}
