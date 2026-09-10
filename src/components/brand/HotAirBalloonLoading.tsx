import React from 'react';
import { TrackilioBalloonLogo } from './TrackilioBalloonLogo';

interface HotAirBalloonLoadingProps {
  message?: string;
  submessage?: string;
  fullScreen?: boolean;
  size?: number;
  showSkeletonCards?: boolean;
  cardsCount?: number;
}

export function HotAirBalloonLoading({
  message = 'Finding authentic places...',
  submessage = 'Taking flight across your travel spots',
  fullScreen = false,
  size = 130,
  showSkeletonCards = false,
  cardsCount = 3,
}: HotAirBalloonLoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center select-none">
      {/* Hot Air Balloon with smooth medium-speed waving animation */}
      <div className="relative mb-6">
        <TrackilioBalloonLogo size={size} animated={true} showClouds={true} showSparks={true} />
      </div>

      {/* Loading message */}
      <div className="space-y-1.5 max-w-sm">
        <h3 className="font-sans text-base sm:text-lg font-black text-[#222222] tracking-tight">
          {message}
        </h3>
        {submessage && (
          <p className="text-xs sm:text-sm text-[#6B6862] font-normal leading-relaxed">
            {submessage}
          </p>
        )}
      </div>

      {/* Optional Skeleton Shimmer Previews */}
      {showSkeletonCards && (
        <div className="w-full max-w-2xl mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: cardsCount }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-[#E8DECA] p-4 space-y-3 shadow-2xs overflow-hidden"
            >
              <div className="w-full h-28 rounded-xl skeleton-shimmer" />
              <div className="h-4 w-3/4 rounded-lg skeleton-shimmer" />
              <div className="h-3 w-1/2 rounded-lg skeleton-shimmer" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF3E1]">
        {content}
      </div>
    );
  }

  return content;
}
