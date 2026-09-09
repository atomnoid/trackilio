'use client';

import React from 'react';
import Link from 'next/link';
import { Place } from '@/types/database';
import { MapPin, Flame, ArrowRight, Layers } from 'lucide-react';
import { SavePlaceButton } from './SavePlaceButton';

interface PlaceDiscoveryCardProps {
  place: Place;
  currentUserId?: string;
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

export function PlaceDiscoveryCard({ place, currentUserId }: PlaceDiscoveryCardProps) {
  const category = place.category || 'Place';
  const emoji = CATEGORY_EMOJIS[category] || '📍';
  const slug = place.slug || place.id;
  const locationText = place.city || place.location || place.country || '';
  const score = place.community_score ?? 0;

  return (
    <div className="group relative block rounded-3xl bg-white border border-[#E6DFD5] p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-200 space-y-3.5">
      {/* Top Header: Category Badge + Save Button */}
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3ECE1] border border-[#E6DFD5] px-3 py-1 text-[11px] font-bold text-[#4A4643]">
          <span>{emoji}</span>
          <span>{category}</span>
        </span>

        <SavePlaceButton
          placeId={place.id}
          initialSaved={place.is_saved}
          currentUserId={currentUserId}
        />
      </div>

      {/* Place Main Info */}
      <Link href={`/place/${slug}`} className="block space-y-1.5">
        <h3 className="font-sans text-lg font-black text-[#2C2A29] group-hover:text-[#4A6B5D] transition-colors line-clamp-1">
          {place.name}
        </h3>

        {locationText && (
          <div className="flex items-center gap-1 text-xs font-semibold text-[#78726D] truncate">
            <MapPin className="h-3.5 w-3.5 text-[#4A6B5D] shrink-0" />
            <span className="truncate">{locationText}</span>
          </div>
        )}

        {place.description && (
          <p className="text-xs text-[#78726D] font-medium line-clamp-2 leading-relaxed pt-1">
            {place.description}
          </p>
        )}
      </Link>

      {/* Card Footer: Community Stats + Detail CTA */}
      <div className="pt-3 border-t border-[#F3ECE1] flex items-center justify-between text-xs text-[#78726D]">
        <div className="flex items-center gap-3">
          {score > 0 && (
            <span className="inline-flex items-center gap-1 font-extrabold text-[#D96B43]">
              <Flame className="h-3.5 w-3.5 fill-current" />
              <span>+{score}</span>
            </span>
          )}

          {(place.lists_count ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1 font-semibold text-[#78726D]">
              <Layers className="h-3.5 w-3.5 text-[#4A6B5D]" />
              <span>In {place.lists_count} list{place.lists_count !== 1 ? 's' : ''}</span>
            </span>
          )}
        </div>

        <Link
          href={`/place/${slug}`}
          className="font-extrabold text-[#4A6B5D] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 hover:underline ml-auto"
        >
          View <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
