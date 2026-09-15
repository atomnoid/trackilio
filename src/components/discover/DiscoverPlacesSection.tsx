'use client';

import React, { useState } from 'react';
import { Place } from '@/types/database';
import { PlaceDiscoveryCard } from '@/components/places/PlaceDiscoveryCard';
import { CompassIcon } from '@/components/icons/Icons';

interface DiscoverPlacesSectionProps {
  places: Place[];
  currentUserId?: string;
}

export function DiscoverPlacesSection({ places, currentUserId }: DiscoverPlacesSectionProps) {
  // Show 15 places initially across all devices (phone and desktop), then load 15 more on button click
  const [visibleCount, setVisibleCount] = useState<number>(15);

  if (!places || places.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-[#E8DECA] p-12 text-center space-y-2 max-w-md mx-auto">
        <h3 className="font-sans text-base font-extrabold text-[#222222]">
          No places found
        </h3>
        <p className="text-xs text-[#6B6862]">
          Try searching with broader terms or exploring another city above.
        </p>
      </div>
    );
  }

  const displayedPlaces = places.slice(0, visibleCount);
  const hasMore = visibleCount < places.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 15);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedPlaces.map((place) => (
          <PlaceDiscoveryCard
            key={place.id}
            place={place}
            currentUserId={currentUserId}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex flex-col items-center justify-center pt-4 pb-2">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#222222] hover:bg-[#FA8112] text-white font-extrabold px-8 py-3.5 text-xs shadow-md active-press transition-all cursor-pointer"
          >
            <CompassIcon className="w-4 h-4 text-[#FA8112]" />
            <span>Load more places ({places.length - visibleCount} remaining)</span>
          </button>
        </div>
      )}
    </div>
  );
}
