'use client';

import React from 'react';
import Link from 'next/link';
import { Place } from '@/types/database';
import { MapPin, ArrowRight, Layers, ArrowBigUp } from 'lucide-react';
import { SavePlaceButton } from './SavePlaceButton';

interface PlaceDiscoveryCardProps {
  place: Place;
  currentUserId?: string;
  initialSaved?: boolean;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  Cafe: '☕',
  Café: '☕',
  Restaurant: '🍽️',
  Food: '🍜',
  Bar: '🍸',
  Nightlife: '✨',
  Park: '🌿',
  Nature: '🌲',
  Sight: '🏛️',
  Sightseeing: '🏛️',
  Attraction: '🎡',
  Shopping: '🛍️',
  Hotel: '🏨',
  'Date Spot': '❤️',
  'Hidden Gem': '💎',
};

export function PlaceDiscoveryCard({ place, currentUserId, initialSaved }: PlaceDiscoveryCardProps) {
  const category = place.category || 'Place';
  const emoji = CATEGORY_EMOJIS[category] || '📍';
  const slug = place.slug || place.id;
  const locationText = place.city || place.location || place.country || '';
  const upvotes = place.upvotes_count ?? 0;

  return (
    <div className="group relative block rounded-3xl bg-white border border-gray-100 p-5 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-200 space-y-3.5">
      {/* Top Header: Category Badge + Tags + Save Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEAE6] border border-[#FFD3CC] px-3 py-1 text-[11px] font-bold text-[#FF5841]">
            <span>{emoji}</span>
            <span>{category}</span>
          </span>

          {place.tags && place.tags.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF4F8] border border-[#F4CDDF] px-2.5 py-0.5 text-[10px] font-extrabold text-[#C53678]">
              {place.tags[0]}
            </span>
          )}
        </div>

        <SavePlaceButton
          placeId={place.id}
          initialSaved={initialSaved ?? place.is_saved}
          currentUserId={currentUserId}
        />
      </div>

      {/* Place Main Info */}
      <Link href={`/place/${slug}`} className="block space-y-1.5">
        <h3 className="font-sans text-lg font-black text-gray-900 group-hover:text-[#FF5841] transition-colors line-clamp-1">
          {place.name}
        </h3>

        {locationText && (
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 truncate">
            <MapPin className="h-3.5 w-3.5 text-[#FF5841] shrink-0" />
            <span className="truncate">{locationText}</span>
          </div>
        )}

        {place.description && (
          <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed pt-1">
            {place.description}
          </p>
        )}
      </Link>

      {/* Card Footer: Real Upvotes Count + Lists Count + Detail CTA */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 font-bold text-gray-600">
            <ArrowBigUp className="h-4 w-4 text-[#FF5841] fill-[#FF5841]" />
            <span className="font-mono font-black text-gray-900">{upvotes}</span>
            <span className="text-[11px] text-gray-400">upvote{upvotes !== 1 ? 's' : ''}</span>
          </span>

          {(place.lists_count ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1 font-semibold text-gray-400">
              <Layers className="h-3.5 w-3.5 text-[#C53678]" />
              <span>In {place.lists_count} list{place.lists_count !== 1 ? 's' : ''}</span>
            </span>
          )}
        </div>

        <Link
          href={`/place/${slug}`}
          className="font-extrabold text-[#C53678] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 hover:text-[#FF5841] ml-auto"
        >
          View <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
