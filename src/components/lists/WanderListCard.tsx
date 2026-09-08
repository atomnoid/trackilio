import React from 'react';
import Link from 'next/link';
import { WanderList } from '@/types/database';
import { MapPin, Globe, Lock, User, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { ListCover } from './ListCover';

interface WanderListCardProps {
  list: WanderList;
}

export function WanderListCard({ list }: WanderListCardProps) {
  return (
    <Link
      href={`/l/${list.slug}`}
      className="group block rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-500/10 card-tactile transition-all duration-300 active-press"
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
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold backdrop-blur-md shadow-md ${
              list.is_public
                ? 'bg-emerald-500/90 text-white border border-emerald-300/40'
                : 'bg-slate-900/90 text-slate-200 border border-slate-700/50'
            }`}
          >
            {list.is_public ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            {list.is_public ? 'Public List' : 'Private List'}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 space-y-3">
        {list.destination && (
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-600">
            <MapPin className="h-3.5 w-3.5" />
            <span>{list.destination}</span>
          </div>
        )}

        <h3 className="font-display text-xl font-extrabold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-1">
          {list.title}
        </h3>

        {list.description && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
            {list.description}
          </p>
        )}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-violet-100 text-violet-700 font-bold text-[10px] flex items-center justify-center border border-violet-200">
              {list.owner?.display_name?.charAt(0).toUpperCase() || 'T'}
            </div>
            <span className="font-semibold text-slate-700 truncate max-w-[120px]">
              {list.owner?.display_name || 'Traveler'}
            </span>
          </div>

          <span className="font-bold text-violet-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
            View <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
