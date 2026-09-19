'use client';

import React, { useState } from 'react';
import { GooglePhotoMeta } from '@/types/googlePlaces';
import { CameraIcon, ExternalLinkIcon } from '@/components/icons/Icons';

interface GooglePlacePhotosProps {
  googlePlaceId: string;
  photos: GooglePhotoMeta[];
  placeName: string;
}

export function GooglePlacePhotos({
  googlePlaceId,
  photos,
  placeName,
}: GooglePlacePhotosProps) {
  const [failedIndices, setFailedIndices] = useState<Record<number, boolean>>({});

  if (!photos || photos.length === 0) return null;

  const validPhotos = photos.filter((p) => !failedIndices[p.index]);
  if (validPhotos.length === 0) return null;

  const handleImageError = (index: number) => {
    setFailedIndices((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-black text-[#6B6862] uppercase tracking-wider">
          <CameraIcon className="w-3.5 h-3.5 text-[#FA8112]" />
          <span>Photos via Google Places</span>
        </div>
      </div>

      <div
        className={`grid gap-4 ${
          validPhotos.length === 1
            ? 'grid-cols-1'
            : validPhotos.length === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : 'grid-cols-1 sm:grid-cols-3'
        }`}
      >
        {validPhotos.map((photo) => {
          const imgUrl = `/api/places/google/photos?placeId=${encodeURIComponent(
            googlePlaceId
          )}&index=${photo.index}`;

          const primaryAuthor = photo.authorAttributions?.[0];

          return (
            <div
              key={photo.index}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-[#E8DECA] shadow-2xs transition-all hover:shadow-xs"
            >
              {/* Image Container */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-[#FAF3E1]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`${placeName} photo ${photo.index + 1}`}
                  loading={photo.index === 0 ? 'eager' : 'lazy'}
                  onError={() => handleImageError(photo.index)}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Attribution Footer */}
              {primaryAuthor && (
                <div className="px-4 py-2.5 bg-white border-t border-[#E8DECA] flex items-center justify-between text-xs font-bold text-[#6B6862]">
                  <span className="truncate max-w-[200px]">
                    Photo by{' '}
                    {primaryAuthor.uri ? (
                      <a
                        href={primaryAuthor.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#222222] font-black hover:text-[#FA8112] underline decoration-[#E8DECA] underline-offset-2 transition-colors inline-flex items-center gap-1"
                      >
                        {primaryAuthor.displayName}
                        <ExternalLinkIcon className="w-2.5 h-2.5 inline text-[#6B6862]" />
                      </a>
                    ) : (
                      <span className="text-[#222222] font-black">
                        {primaryAuthor.displayName}
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] font-extrabold text-[#6B6862] opacity-80 shrink-0">
                    Google
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
