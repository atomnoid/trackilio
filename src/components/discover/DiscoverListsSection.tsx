'use client';

import React, { useState, useEffect } from 'react';
import { WanderList } from '@/types/database';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { SparklesIcon, CompassIcon } from '@/components/icons/Icons';
import Link from 'next/link';

interface DiscoverListsSectionProps {
  lists: WanderList[];
}

export function DiscoverListsSection({ lists }: DiscoverListsSectionProps) {
  // Mobile initial: 6, Desktop initial: 9
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setVisibleCount(6);
    }
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  if (!lists || lists.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-[#E8DECA] p-12 text-center space-y-3 max-w-md mx-auto">
        <h3 className="font-sans text-base font-extrabold text-[#222222]">
          No lists found
        </h3>
        <p className="text-xs text-[#6B6862]">
          Be the first traveler to create a list for this destination!
        </p>
        <Link
          href="/create"
          className="inline-block rounded-xl bg-[#FA8112] text-white font-extrabold px-5 py-2 text-xs active-press transition-colors"
        >
          Create a list
        </Link>
      </div>
    );
  }

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
        <div className="flex flex-col items-center justify-center pt-4 pb-2">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#222222] hover:bg-[#FA8112] text-white font-extrabold px-8 py-3.5 text-xs shadow-md active-press transition-all cursor-pointer"
          >
            <CompassIcon className="w-4 h-4 text-[#FA8112] group-hover:text-white" />
            <span>Load more lists ({lists.length - visibleCount} remaining)</span>
          </button>
        </div>
      )}
    </div>
  );
}
