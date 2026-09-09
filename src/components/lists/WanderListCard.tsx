import React from 'react';
import Link from 'next/link';
import { WanderList } from '@/types/database';
import { ListCover } from './ListCover';
import { ArrowRightIcon } from '@/components/icons/Icons';

interface WanderListCardProps {
  list: WanderList;
  showCollabBadge?: boolean;
}

export function WanderListCard({ list, showCollabBadge = false }: WanderListCardProps) {
  const profileIdentifier = list.owner?.username || list.owner_id;
  const profileUrl = profileIdentifier ? `/u/${profileIdentifier}` : null;
  const placesCount = list.places_count ?? 0;

  return (
    <div className="group relative block bg-white rounded-2xl border border-[#E8DECA] hover:border-[#222222] overflow-hidden transition-all duration-200">
      {/* Visual Cover */}
      <Link href={`/l/${list.slug}`} className="block relative">
        <ListCover
          title={list.title}
          destination={list.destination || ''}
          variant="card"
        />

        {/* Status Badges */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          {showCollabBadge && (
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black bg-[#222222] text-white">
              Collab
            </span>
          )}

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
              list.is_public
                ? 'bg-[#FAF3E1] text-[#222222] border-[#E8DECA]'
                : 'bg-[#222222] text-white border-transparent'
            }`}
          >
            {list.is_public ? 'Public' : 'Private'}
          </span>
        </div>

        {/* Count Badge on Cover */}
        <div className="absolute bottom-3 left-3 z-20">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black bg-[#222222]/80 text-[#FAF3E1] border border-white/20">
            {placesCount} {placesCount === 1 ? 'place' : 'places'}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 space-y-2">
        <Link href={`/l/${list.slug}`} className="block space-y-1.5">
          {list.destination && (
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#FA8112]">
              {list.destination}
            </div>
          )}

          <h3 className="font-sans text-base font-black text-[#222222] group-hover:text-[#FA8112] transition-colors line-clamp-1">
            {list.title}
          </h3>

          {list.description && (
            <p className="text-xs text-[#6B6862] line-clamp-2 leading-relaxed">
              {list.description}
            </p>
          )}
        </Link>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E8DECA]/60 flex items-center justify-between text-xs">
          {profileUrl ? (
            <Link
              href={profileUrl}
              className="flex items-center gap-2 group/author hover:opacity-80 transition-opacity"
              title={`View ${list.owner?.display_name || 'Traveler'}'s profile`}
            >
              <div className="h-6 w-6 rounded-lg bg-[#222222] text-white font-bold text-[10px] flex items-center justify-center">
                {list.owner?.display_name?.charAt(0).toUpperCase() || 'T'}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#222222] truncate max-w-[120px]">
                  {list.owner?.display_name || 'Traveler'}
                </span>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-[#222222] text-white font-bold text-[10px] flex items-center justify-center">
                {list.owner?.display_name?.charAt(0).toUpperCase() || 'T'}
              </div>
              <span className="font-bold text-[#222222] truncate max-w-[120px]">
                {list.owner?.display_name || 'Traveler'}
              </span>
            </div>
          )}

          <Link
            href={`/l/${list.slug}`}
            className="font-extrabold text-[#222222] inline-flex items-center gap-1 hover:text-[#FA8112] transition-colors"
          >
            <span>Explore</span>
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
