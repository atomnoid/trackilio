'use client';

import React, { useState, useEffect } from 'react';
import { isPlaceUpvotedLocally, toggleLocalPlaceUpvote } from '@/lib/upvotes';

interface UpvoteButtonProps {
  placeId: string;
  slug?: string | null;
  listPlaceId?: string;
  initialUpvotes?: number;
  initialUpvoted?: boolean;
  showText?: boolean;
  className?: string;
}

export function UpvoteButton({
  placeId,
  slug,
  listPlaceId,
  initialUpvotes = 0,
  initialUpvoted = false,
  showText = false,
  className = '',
}: UpvoteButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [upvoted, setUpvoted] = useState(initialUpvoted);
  const [count, setCount] = useState(initialUpvotes);
  const [isBouncing, setIsBouncing] = useState(false);

  // Sync with localStorage on client mount to remember votes across sessions
  useEffect(() => {
    setMounted(true);
    const locallyUpvoted = isPlaceUpvotedLocally(placeId) || isPlaceUpvotedLocally(slug);

    if (locallyUpvoted) {
      setUpvoted(true);
      // If the server-rendered baseline didn't account for this local vote yet, increment count
      if (!initialUpvoted) {
        setCount((c) => Math.max(c, initialUpvotes + 1));
      }
    } else if (initialUpvoted) {
      setUpvoted(true);
    }
  }, [placeId, slug, initialUpvoted, initialUpvotes]);

  // Listen to cross-component sync events so all cards with the same place stay in sync
  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ placeId?: string; alternateIdOrSlug?: string; upvoted: boolean }>;
      const detail = customEvent.detail;
      if (!detail) return;

      const matches =
        detail.placeId === placeId ||
        detail.alternateIdOrSlug === placeId ||
        (slug && (detail.placeId === slug || detail.alternateIdOrSlug === slug));

      if (matches) {
        setUpvoted(detail.upvoted);
        setCount((prev) => {
          if (detail.upvoted) {
            return prev === initialUpvotes ? prev + 1 : prev;
          } else {
            return prev > initialUpvotes ? prev - 1 : Math.max(0, prev - 1);
          }
        });
      }
    };

    window.addEventListener('trackilio_upvote_changed', handleSync);
    return () => window.removeEventListener('trackilio_upvote_changed', handleSync);
  }, [placeId, slug, initialUpvotes]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextUpvoted = !upvoted;
    setUpvoted(nextUpvoted);
    setCount((prev) => Math.max(0, nextUpvoted ? prev + 1 : prev - 1));

    // Trigger subtle bounce feedback
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 300);

    // Save to local storage as long memory for all visitors
    toggleLocalPlaceUpvote(placeId, slug);

    // Also notify server (handles authenticated users into Supabase votes, and succeeds for guests)
    try {
      await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId,
          listPlaceId,
          voteType: 'up',
        }),
      });
    } catch (err) {
      // Non-blocking: local storage retains client memory regardless of network
      console.warn('Could not sync upvote with server:', err);
    }
  };

  const isHighlighted = mounted ? upvoted : initialUpvoted;
  const displayCount = mounted ? count : initialUpvotes;

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isHighlighted}
      aria-label={isHighlighted ? 'Remove upvote' : 'Upvote this place'}
      title={isHighlighted ? 'Upvoted! Click to remove upvote' : 'Upvote this place'}
      className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all duration-150 select-none cursor-pointer active:scale-95 ${
        isHighlighted
          ? 'bg-[#FA8112] text-white border border-[#FA8112] shadow-xs'
          : 'bg-[#FAF3E1] hover:bg-[#F5E7C6] text-[#222222] border border-[#E8DECA] hover:border-[#FA8112]/60'
      } ${className}`}
    >
      <span
        className={`inline-block transition-transform duration-200 text-xs ${
          isHighlighted ? 'text-white' : 'text-[#FA8112]'
        } ${isBouncing ? '-translate-y-0.5 scale-125' : ''}`}
      >
        ▲
      </span>

      {showText && (
        <span className="font-sans font-bold">
          {isHighlighted ? 'Upvoted' : 'Upvote'}
        </span>
      )}

      <span
        className={`font-mono font-black ${
          isHighlighted ? 'text-white' : 'text-[#222222]'
        }`}
      >
        {displayCount}
      </span>
    </button>
  );
}
