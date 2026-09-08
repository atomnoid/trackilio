import React from 'react';
import Link from 'next/link';
import { WanderList } from '@/types/database';
import { MapPin, Globe, Lock, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface WanderListCardProps {
  list: WanderList;
}

export function WanderListCard({ list }: WanderListCardProps) {
  const defaultImage =
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';

  return (
    <Link
      href={`/l/${list.slug}`}
      className="group block rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
    >
      <div className="relative h-48 w-full overflow-hidden bg-stone-100">
        <img
          src={list.cover_image || defaultImage}
          alt={list.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-md ${
              list.is_public
                ? 'bg-emerald-950/70 text-emerald-100 border border-emerald-500/30'
                : 'bg-stone-900/70 text-stone-200 border border-stone-700/50'
            }`}
          >
            {list.is_public ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            {list.is_public ? 'Public' : 'Private'}
          </span>
        </div>
      </div>

      <div className="p-5">
        {list.destination && (
          <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>{list.destination}</span>
          </div>
        )}

        <h3 className="text-xl font-bold font-editorial text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
          {list.title}
        </h3>

        {list.description && (
          <p className="mt-2 text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {list.description}
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5 font-medium text-stone-700">
            <User className="h-3.5 w-3.5 text-stone-400" />
            <span>{list.owner?.display_name || 'Traveler'}</span>
          </div>
          <span>Updated {formatDate(list.updated_at)}</span>
        </div>
      </div>
    </Link>
  );
}
