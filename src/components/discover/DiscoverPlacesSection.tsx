'use client';

import React, { useState } from 'react';
import { Place } from '@/types/database';
import { PlaceDiscoveryCard } from '@/components/places/PlaceDiscoveryCard';

interface DiscoverPlacesSectionProps {
  places: Place[];
  currentUserId?: string;
}

export function DiscoverPlacesSection({ places, currentUserId }: DiscoverPlacesSectionProps) {
  // Show 15 places initially across all devices (phone and desktop), then load 15 more on button click
  const [visibleCount, setVisibleCount] = useState<number>(15);

  // Empty state is handled at the server level (page.tsx) via NoPlacesEmptyState
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
        <div
          suppressHydrationWarning
          className="flex flex-col items-center justify-center pt-4 pb-2"
        >
          <button
            onClick={handleLoadMore}
            suppressHydrationWarning
            className="group relative inline-flex items-center gap-2.5 rounded-xl bg-white border border-[#E8DECA] hover:border-[#222222] px-6 py-3 text-xs font-extrabold text-[#222222] shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-base group-hover:rotate-12 transition-transform duration-200">✨</span>
            <span>Show more places</span>
            <span
              suppressHydrationWarning
              className="ml-1 rounded-full bg-[#F5E7C6] text-[#FA8112] px-2 py-0.5 text-[11px] font-black group-hover:bg-[#FA8112] group-hover:text-white transition-colors"
            >
              +{places.length - visibleCount}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
