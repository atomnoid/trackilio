'use client';

import React, { useState } from 'react';
import { ListPlace, VoteType } from '@/types/database';
import {
  MapPin,
  ExternalLink,
  ArrowBigUp,
  ArrowBigDown,
  Flame,
  Compass,
} from 'lucide-react';

interface PlaceCardProps {
  listPlace: ListPlace;
  currentUserId?: string;
  canEdit?: boolean;
}

export function PlaceCard({ listPlace, currentUserId }: PlaceCardProps) {
  const place = listPlace.place;
  const [votesCount, setVotesCount] = useState(listPlace.votes_count ?? 0);
  const [userVote, setUserVote] = useState<VoteType | null>(
    listPlace.user_vote_type ?? (listPlace.user_has_voted ? 'up' : null)
  );
  const [animateVote, setAnimateVote] = useState<'up' | 'down' | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null);

  const handleVote = async (targetType: VoteType) => {
    if (!currentUserId) {
      setVoteError('Please log in to vote on places.');
      setTimeout(() => setVoteError(null), 3000);
      return;
    }

    setVoteError(null);
    const prevVote = userVote;
    const prevCount = votesCount;

    let nextVote: VoteType | null = null;
    let nextCount = prevCount;

    if (prevVote === targetType) {
      // Toggle off
      nextVote = null;
      nextCount = targetType === 'up' ? prevCount - 1 : prevCount + 1;
    } else if (prevVote === null) {
      // New vote
      nextVote = targetType;
      nextCount = targetType === 'up' ? prevCount + 1 : prevCount - 1;
    } else {
      // Switch vote (up → down or down → up)
      nextVote = targetType;
      nextCount = targetType === 'up' ? prevCount + 2 : prevCount - 2;
    }

    setUserVote(nextVote);
    setVotesCount(nextCount);
    setAnimateVote(targetType);
    setTimeout(() => setAnimateVote(null), 300);

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listPlaceId: listPlace.id, voteType: targetType }),
      });

      if (!res.ok) {
        setUserVote(prevVote);
        setVotesCount(prevCount);
        setVoteError('Vote failed. Please try again.');
        setTimeout(() => setVoteError(null), 3000);
      }
    } catch {
      setUserVote(prevVote);
      setVotesCount(prevCount);
      setVoteError('Network error. Please try again.');
      setTimeout(() => setVoteError(null), 3000);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'must_visit':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFEAE6] text-[#FF5841] px-2.5 py-0.5 text-[11px] font-extrabold border border-[#FFD3CC]">
            <Flame className="h-3 w-3 fill-[#FF5841]" /> Must Visit
          </span>
        );
      case 'want_to_visit':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 px-2.5 py-0.5 text-[11px] font-bold border border-amber-200">
            <Compass className="h-3 w-3" /> Want to Visit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-600 px-2.5 py-0.5 text-[11px] font-bold">
            Maybe
          </span>
        );
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-gray-100 p-5 sm:p-6 space-y-3.5 shadow-2xs hover:border-[#FF5841]/20 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            {getPriorityBadge(listPlace.priority)}
            {place?.category && (
              <span className="rounded-full bg-[#F6F4F8] text-[#1A1723] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {place.category}
              </span>
            )}
            {/* Place Tags */}
            {place?.tags && place.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {place.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-[#FDF4F8] border border-[#F4CDDF] px-2.5 py-0.5 text-[10px] font-extrabold text-[#C53678]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <h4 className="font-sans text-xl font-extrabold text-gray-900">
            {place?.name || 'Unnamed Place'}
          </h4>

          {place?.location && (
            <p className="flex items-center gap-1 text-xs text-gray-500 font-medium">
              <MapPin className="h-3.5 w-3.5 text-[#FF5841]" />
              {place.location}
              {place.country ? `, ${place.country}` : ''}
            </p>
          )}
        </div>

        {place?.maps_url && (
          <a
            href={place.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-[#FF5841]/40 px-3 py-1.5 text-xs font-bold text-gray-800 active-press transition-colors self-start shrink-0"
          >
            Open in Maps
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      {listPlace.note && (
        <p className="text-xs text-gray-700 font-medium italic border-l-2 border-[#FF5841] pl-3 py-1 bg-[#FFF5F3] rounded-r-xl">
          &ldquo;{listPlace.note}&rdquo;
        </p>
      )}

      {/* Vote error message */}
      {voteError && (
        <p className="text-[11px] text-[#FF5841] font-bold bg-[#FFEAE6] border border-[#FFD3CC] rounded-xl px-3 py-1.5">
          {voteError}
        </p>
      )}

      {/* Action Footer */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-4 text-xs">
        <div className="inline-flex items-center rounded-xl bg-gray-50 border border-gray-200 p-0.5 shadow-2xs">
          {/* Upvote Button */}
          <button
            onClick={() => handleVote('up')}
            title="Upvote this spot"
            aria-label="Upvote"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-extrabold transition-all active-press ${
              userVote === 'up'
                ? 'bg-[#FF5841] text-white shadow-xs'
                : 'text-gray-500 hover:text-[#FF5841] hover:bg-white'
            } ${animateVote === 'up' ? 'scale-110' : ''}`}
          >
            <ArrowBigUp className={`h-4 w-4 ${userVote === 'up' ? 'fill-current' : ''}`} />
            <span className="text-[11px] hidden sm:inline">Upvote</span>
          </button>

          {/* Net Score */}
          <span
            className={`px-2 py-1 font-mono font-black text-xs ${
              votesCount > 0
                ? 'text-[#FF5841]'
                : votesCount < 0
                ? 'text-gray-400'
                : 'text-gray-400'
            }`}
          >
            {votesCount > 0 ? `+${votesCount}` : votesCount}
          </span>

          {/* Downvote Button */}
          <button
            onClick={() => handleVote('down')}
            title="Downvote this spot"
            aria-label="Downvote"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-extrabold transition-all active-press ${
              userVote === 'down'
                ? 'bg-gray-800 text-white shadow-xs'
                : 'text-gray-400 hover:text-gray-700 hover:bg-white'
            } ${animateVote === 'down' ? 'scale-110' : ''}`}
          >
            <ArrowBigDown className={`h-4 w-4 ${userVote === 'down' ? 'fill-current' : ''}`} />
            <span className="text-[11px] hidden sm:inline">Downvote</span>
          </button>
        </div>
      </div>
    </div>
  );
}
