'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Place, ListPlace } from '@/types/database';
import { SavePlaceButton } from './SavePlaceButton';
import { PinIcon, ArrowRightIcon } from '@/components/icons/Icons';

interface PlaceCardProps {
  place?: Place;
  listPlace?: ListPlace;
  currentUserId?: string;
  initialSaved?: boolean;
  canEdit?: boolean;
}

/**
 * Safely parse tags — Postgres arrays can arrive as either a JS string[]
 * OR as a raw '{tag1,tag2}' string depending on the rendering context.
 */
function parseTags(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean) as string[];
  if (typeof raw === 'string') {
    const cleaned = raw.replace(/^\{|\}$/g, '').trim();
    if (!cleaned) return [];
    return cleaned.split(',').map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

const CATEGORY_EMOJIS: Record<string, string> = {
  Cafe: '☕',
  Café: '☕',
  Restaurant: '🍽️',
  Food: '🍜',
  Sea: '🏖️',
  'Sea & Beaches': '🏖️',
  Beach: '🏖️',
  Beaches: '🏖️',
  Lake: '🌊',
  Lakes: '🌊',
  Ocean: '🌊',
  Park: '🪴',
  Garden: '🪴',
  'Park / Garden': '🪴',
  Parks: '🪴',
  Gardens: '🪴',
  Waterfall: '🏞️',
  Mountain: '⛰️',
  Forest: '🌲',
  'Spiritual Sight': '🛕',
  Spiritual: '🛕',
  Temple: '🛕',
  Bar: '🍸',
  Nightlife: '🍸',
  Nature: '🌿',
  Sight: '🏛️',
  Sightseeing: '🏛️',
  Attraction: '🎡',
  Shopping: '🛍️',
  Hotel: '🏨',
  'Date Spot': '❤️',
  'Hidden Gem': '💎',
  Activity: '🥾',
};

export function PlaceCard({ place: inputPlace, listPlace, currentUserId, initialSaved }: PlaceCardProps) {
  const [mounted, setMounted] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rawPlace = inputPlace || listPlace?.place;
  const place = Array.isArray(rawPlace) ? rawPlace[0] : rawPlace;
  if (!place || typeof place !== 'object') return null;

  const category = (place as any).category || 'Place';
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
    <div suppressHydrationWarning className="group relative flex flex-col justify-between rounded-2xl bg-white border border-[#E8DECA] p-4 sm:p-5 hover:border-[#222222] transition-all duration-200 space-y-3 h-full">
      {/* Top Header: Category Tag + Save Action */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
          <span
            suppressHydrationWarning
            className="inline-flex items-center gap-1 rounded-full bg-[#FAF3E1] border border-[#E8DECA] px-2.5 py-0.5 text-[11px] font-bold text-[#222222]"
          >
            <span suppressHydrationWarning>{emoji}</span>
            <span suppressHydrationWarning>{category}</span>
          </span>

          {parseTags(place.tags).slice(0, 1).map((tag) => (
            <span
              key={tag}
              suppressHydrationWarning
              className="inline-flex items-center rounded-full bg-[#F5E7C6] px-2 py-0.5 text-[10px] font-bold text-[#222222]"
            >
              {tag}
            </span>
          ))}
        </div>

        <SavePlaceButton
          placeId={place.id}
          initialSaved={initialSaved ?? place.is_saved}
          currentUserId={currentUserId}
        />
      </div>

      {/* Main Place Content (Google Photo + Place Details) */}
      <Link href={`/place/${slug}`} className="block space-y-3 flex-1">
        {/* Place Photo Banner */}
        {mounted && (place.image_url || (place.photos && place.photos.length > 0)) && !photoError && (
          <div className="relative aspect-[2/1] sm:aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#FAF3E1] border border-[#E8DECA] transition-all">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={(place.photos && place.photos.length > 0 ? place.photos[0].url_card : place.image_url) || ''}
              alt={place.name}
              loading="lazy"
              decoding="async"
              onError={() => setPhotoError(true)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Place Main Info */}
        <div className="space-y-1">
          <h3 className="font-sans text-base font-black text-[#222222] group-hover:text-[#FA8112] transition-colors line-clamp-1">
            {place.name}
          </h3>

          {locationText && (
            <span className="flex items-center gap-1 text-xs font-semibold text-[#6B6862] truncate">
              <PinIcon className="w-3 h-3 text-[#FA8112] shrink-0" />
              <span className="truncate">{locationText}</span>
            </span>
          )}

          {place.note ? (
            <span className="mt-1.5 block rounded-xl bg-[#FAF3E1]/80 border border-[#E8DECA] p-2.5 text-xs space-y-0.5">
              <span className="flex items-center gap-1 text-[11px] font-black text-[#FA8112]">
                <span>💬</span>
                <span>Traveler Note</span>
              </span>
              <p className="text-[#222222] font-medium italic line-clamp-2 leading-snug">
                &ldquo;{place.note}&rdquo;
              </p>
            </span>
          ) : place.description ? (
            <p className="text-xs text-[#6B6862] line-clamp-2 leading-relaxed pt-0.5">
              {place.description}
            </p>
          ) : null}
        </div>
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

// Re-export for backwards compatibility
export { PlaceCard as PlaceDiscoveryCard };
