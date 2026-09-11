'use client';

import React from 'react';
import Link from 'next/link';
import { Place } from '@/types/database';
import { SavePlaceButton } from './SavePlaceButton';
import { PinIcon, ArrowRightIcon, ExternalLinkIcon } from '@/components/icons/Icons';

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
  Waterfall: '🌊',
  Mountain: '⛰️',
  Forest: '🌲',
  'Spiritual Sight': '🛕',
  Spiritual: '🛕',
  Temple: '🛕',
  Bar: '🍸',
  Nightlife: '🍸',
  Park: '🌿',
  Nature: '🌲',
  Sight: '🏛️',
  Sightseeing: '🏛️',
  Attraction: '🎡',
  Shopping: '🛍️',
  Hotel: '🏨',
  'Date Spot': '❤️',
  'Hidden Gem': '💎',
  Beach: '🏖️',
  Activity: '🥾',
};

export function PlaceDiscoveryCard({ place, currentUserId, initialSaved }: PlaceDiscoveryCardProps) {
  const category = place.category || 'Place';
  const emoji = CATEGORY_EMOJIS[category] || '📍';
  const slug = place.slug || place.id;
  const locationText = place.city || place.location || place.country || '';
  const upvotes = place.upvotes_count ?? 0;

  const hasMapUrl = Boolean(
    place.maps_url &&
    place.maps_url.trim().length > 0 &&
    /^https?:\/\//i.test(place.maps_url.trim())
  );

  return (
    <div className="group relative block rounded-2xl bg-white border border-[#E8DECA] p-5 hover:border-[#222222] transition-all duration-200 space-y-3">
      {/* Top Header: Category Tag + Save Action */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF3E1] border border-[#E8DECA] px-2.5 py-0.5 text-[11px] font-bold text-[#222222]">
            <span>{emoji}</span>
            <span>{category}</span>
          </span>

          {place.tags && place.tags.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-[#F5E7C6] px-2 py-0.5 text-[10px] font-bold text-[#222222]">
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
      <Link href={`/place/${slug}`} className="block space-y-1">
        <h3 className="font-sans text-base font-black text-[#222222] group-hover:text-[#FA8112] transition-colors line-clamp-1">
          {place.name}
        </h3>

        {locationText && (
          <div className="flex items-center gap-1 text-xs font-semibold text-[#6B6862] truncate">
            <PinIcon className="w-3 h-3 text-[#FA8112] shrink-0" />
            <span className="truncate">{locationText}</span>
          </div>
        )}

        {place.description && (
          <p className="text-xs text-[#6B6862] line-clamp-2 leading-relaxed pt-0.5">
            {place.description}
          </p>
        )}
      </Link>

      {/* Card Footer: Upvotes Count + See on Map + View CTA */}
      <div className="pt-3 border-t border-[#E8DECA]/60 flex items-center justify-between gap-2 text-xs text-[#6B6862]">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1 font-bold text-[#222222]">
            <span className="text-[#FA8112]">▲</span>
            <span className="font-mono font-black">{upvotes}</span>
          </span>

          {hasMapUrl && (
            <a
              href={place.maps_url!}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Open location directly on Google Maps"
              className="inline-flex items-center gap-1 rounded-xl bg-[#FAF3E1] hover:bg-[#222222] hover:text-white text-[#222222] px-2.5 py-1 text-[11px] font-bold border border-[#E8DECA] transition-all cursor-pointer"
            >
              <PinIcon className="w-3 h-3 text-[#FA8112]" />
              <span>See on map</span>
            </a>
          )}
        </div>

        <Link
          href={`/place/${slug}`}
          className="font-extrabold text-[#222222] inline-flex items-center gap-1 hover:text-[#FA8112] transition-colors ml-auto"
        >
          View <ArrowRightIcon className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
