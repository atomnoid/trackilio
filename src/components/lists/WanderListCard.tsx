import React from 'react';
import Link from 'next/link';
import { WanderList } from '@/types/database';
import { MapPin, Globe, Lock, ArrowRight } from 'lucide-react';
import { ListCover } from './ListCover';

interface WanderListCardProps {
  list: WanderList;
}

export function WanderListCard({ list }: WanderListCardProps) {
  return (
    <Link
      href={`/l/${list.slug}`}
      className="group block cozy-card overflow-hidden active-press"
    >
      {/* Vector Illustration Cover */}
      <div className="relative">
        <ListCover
          title={list.title}
          destination={list.destination || ''}
          variant="card"
        />

        {/* Public / Private Badge */}
        <div className="absolute top-3 right-3 z-20">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold shadow-2xs ${
              list.is_public
                ? 'bg-[#F0F5F2] text-[#4A6B5D] border border-[#D5E3DC]'
                : 'bg-[#2C2A29] text-white'
            }`}
          >
            {list.is_public ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            {list.is_public ? 'Public' : 'Private'}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 space-y-2.5">
        {list.destination && (
          <div className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#4A6B5D]">
            <MapPin className="h-3.5 w-3.5" />
            <span>{list.destination}</span>
          </div>
        )}

        <h3 className="font-sans text-lg font-black text-[#2C2A29] group-hover:text-[#4A6B5D] transition-colors line-clamp-1">
          {list.title}
        </h3>

        {list.description && (
          <p className="text-xs text-[#78726D] line-clamp-2 leading-relaxed font-medium">
            {list.description}
          </p>
        )}

        <div className="pt-3 border-t border-[#E6DFD5] flex items-center justify-between text-xs text-[#78726D]">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-[#2C2A29] text-white font-bold text-[10px] flex items-center justify-center">
              {list.owner?.display_name?.charAt(0).toUpperCase() || 'T'}
            </div>
            <span className="font-bold text-[#2C2A29] truncate max-w-[120px]">
              {list.owner?.display_name || 'Traveler'}
            </span>
          </div>

          <span className="font-extrabold text-[#4A6B5D] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
            View <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
