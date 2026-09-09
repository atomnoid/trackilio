import React from 'react';
import Link from 'next/link';
import { WanderList } from '@/types/database';
import { MapPin, Globe, Lock, ArrowRight, Users } from 'lucide-react';
import { ListCover } from './ListCover';

interface WanderListCardProps {
  list: WanderList;
  showCollabBadge?: boolean;
}

export function WanderListCard({ list, showCollabBadge = false }: WanderListCardProps) {
  const profileIdentifier = list.owner?.username || list.owner_id;
  const profileUrl = profileIdentifier ? `/u/${profileIdentifier}` : null;

  return (
    <div className="group relative block bg-white/95 backdrop-blur-md rounded-3xl border border-[#E7E0EE] hover:border-[#C5ADC5] overflow-hidden hover:-translate-y-1 hover:shadow-sm transition-all duration-300">
      {/* Vector Illustration Cover */}
      <Link href={`/l/${list.slug}`} className="block relative">
        <ListCover
          title={list.title}
          destination={list.destination || ''}
          variant="card"
        />

        {/* Badges Container */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          {showCollabBadge && (
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold bg-[#6469AC] text-white shadow-2xs">
              <Users className="h-3 w-3" />
              <span>Collab</span>
            </span>
          )}

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold shadow-2xs backdrop-blur-md ${
              list.is_public
                ? 'bg-white/90 text-[#6469AC] border border-[#E7E0EE]'
                : 'bg-[#2A2735]/90 text-white'
            }`}
          >
            {list.is_public ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            {list.is_public ? 'Public' : 'Private'}
          </span>
        </div>
      </Link>

      {/* Card Content Body */}
      <div className="p-5 space-y-2.5">
        <Link href={`/l/${list.slug}`} className="block space-y-2.5">
          {list.destination && (
            <div className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#8E6D8E]">
              <MapPin className="h-3.5 w-3.5" />
              <span>{list.destination}</span>
            </div>
          )}

          <h3 className="font-sans text-lg font-black text-[#2A2735] group-hover:text-[#6469AC] transition-colors line-clamp-1">
            {list.title}
          </h3>

          {list.description && (
            <p className="text-xs text-[#595567] line-clamp-2 leading-relaxed font-medium">
              {list.description}
            </p>
          )}
        </Link>

        {/* Card Footer */}
        <div className="pt-3 border-t border-[#F3EFF7] flex items-center justify-between text-xs text-[#847F95]">
          {profileUrl ? (
            <Link
              href={profileUrl}
              className="flex items-center gap-2 group/author hover:opacity-85 transition-opacity"
              title={`View ${list.owner?.display_name || 'Traveler'}'s profile`}
            >
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#C5ADC5] to-[#B2B5E0] text-white font-bold text-[10px] flex items-center justify-center group-hover/author:scale-105 transition-all shadow-2xs">
                {list.owner?.display_name?.charAt(0).toUpperCase() || 'T'}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#2A2735] truncate max-w-[120px] group-hover/author:text-[#6469AC] transition-colors">
                  {list.owner?.display_name || 'Traveler'}
                </span>
                {list.owner?.username && (
                  <span className="text-[10px] text-[#8E6D8E] leading-none">
                    @{list.owner.username}
                  </span>
                )}
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#C5ADC5] to-[#B2B5E0] text-white font-bold text-[10px] flex items-center justify-center shadow-2xs">
                {list.owner?.display_name?.charAt(0).toUpperCase() || 'T'}
              </div>
              <span className="font-bold text-[#2A2735] truncate max-w-[120px]">
                {list.owner?.display_name || 'Traveler'}
              </span>
            </div>
          )}

          <Link
            href={`/l/${list.slug}`}
            className="font-extrabold text-[#6469AC] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 hover:underline"
          >
            <span>Explore</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
