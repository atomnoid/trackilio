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
      className="group block editorial-card overflow-hidden active-press"
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
                ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                : 'bg-[#18181B] text-white'
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
          <div className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#E0533C]">
            <MapPin className="h-3.5 w-3.5" />
            <span>{list.destination}</span>
          </div>
        )}

        <h3 className="font-sans text-lg font-black text-[#18181B] group-hover:text-[#E0533C] transition-colors line-clamp-1">
          {list.title}
        </h3>

        {list.description && (
          <p className="text-xs text-[#71717A] line-clamp-2 leading-relaxed font-medium">
            {list.description}
          </p>
        )}

        <div className="pt-3 border-t border-[#E8E3D8] flex items-center justify-between text-xs text-[#71717A]">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-[#18181B] text-white font-bold text-[10px] flex items-center justify-center">
              {list.owner?.display_name?.charAt(0).toUpperCase() || 'T'}
            </div>
            <span className="font-bold text-[#18181B] truncate max-w-[120px]">
              {list.owner?.display_name || 'Traveler'}
            </span>
          </div>

          <span className="font-extrabold text-[#E0533C] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
            View <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
