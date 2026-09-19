'use client';

import React, { useState } from 'react';

interface PlaceHeroPhotoProps {
  googlePlaceId: string;
  placeName: string;
}

/**
 * Client component that renders the hero photo banner on the place detail page.
 * Hides itself on image load error — requires 'use client' for the onError handler.
 */
export function PlaceHeroPhoto({ googlePlaceId, placeName }: PlaceHeroPhotoProps) {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden rounded-2xl bg-[#FAF3E1] border border-[#E8DECA] shadow-2xs">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/places/google/photos?placeId=${encodeURIComponent(googlePlaceId)}&index=0`}
        alt={placeName}
        className="h-full w-full object-cover"
        onError={() => setHidden(true)}
      />
    </div>
  );
}
