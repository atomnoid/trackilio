'use client';

import React, { useState } from 'react';
import { WanderList } from '@/types/database';
import { WanderListCard } from '@/components/lists/WanderListCard';

interface DiscoverListsSectionProps {
  lists: WanderList[];
}

export function DiscoverListsSection({ lists }: DiscoverListsSectionProps) {
  // Show 9 lists initially on all devices (phone & desktop), then load 9 more on click
  const [visibleCount, setVisibleCount] = useState<number>(9);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  const displayedLists = lists.slice(0, visibleCount);
  const hasMore = visibleCount < lists.length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedLists.map((list) => (
          <WanderListCard key={list.id} list={list} />
        ))}
      </div>

      {hasMore && (
        <div className="flex flex-col items-center justify-center pt-6 pb-2">
          <button
            onClick={handleLoadMore}
            suppressHydrationWarning
            className="group relative inline-flex items-center gap-2.5 rounded-xl bg-white border border-[#E8DECA] hover:border-[#222222] px-6 py-3 text-xs font-extrabold text-[#222222] shadow-2xs hover:shadow-xs active-press transition-all cursor-pointer"
          >
            <span className="text-base group-hover:rotate-12 transition-transform duration-200">🗺️</span>
            <span>Show more guides</span>
            <span
              suppressHydrationWarning
              className="ml-1 rounded-full bg-[#F5E7C6] text-[#FA8112] px-2 py-0.5 text-[11px] font-black group-hover:bg-[#FA8112] group-hover:text-white transition-colors"
            >
              +{lists.length - visibleCount}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
