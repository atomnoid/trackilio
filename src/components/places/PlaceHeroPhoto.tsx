'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface PlaceHeroPhotoProps {
  imageUrl?: string | null;
  placeName: string;
}

/**
 * Client component that renders the hero photo banner on the place detail page.
 * Uses optimized Next.js Image with high fetch priority and lazy error handling.
 */
export function PlaceHeroPhoto({ imageUrl, placeName }: PlaceHeroPhotoProps) {
  const [hidden, setHidden] = useState(false);

  if (!imageUrl || hidden) return null;

  return (
    <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden rounded-2xl bg-[#FAF3E1] border border-[#E8DECA] shadow-2xs">
      <Image
        src={imageUrl}
        alt={placeName}
        fill
        priority
        decoding="async"
        sizes="(max-width: 1024px) 100vw, 960px"
        className="object-cover"
        onError={() => setHidden(true)}
      />
    </div>
  );
}
