'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PlacePhoto } from '@/types/database';
import { UploadPlacePhotoModal } from './UploadPlacePhotoModal';

interface CommunityPlacePhotosProps {
  placeId: string;
  placeName: string;
  initialPhotos?: PlacePhoto[];
  currentUserId?: string;
}

export function CommunityPlacePhotos({
  placeId,
  placeName,
  initialPhotos = [],
  currentUserId,
}: CommunityPlacePhotosProps) {
  const [photos, setPhotos] = useState<PlacePhoto[]>(initialPhotos);
  const [activePhoto, setActivePhoto] = useState<PlacePhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());

  const handleReport = async (photoId: string) => {
    if (reportedIds.has(photoId)) return;
    try {
      await fetch('/api/places/photos/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId, reason: 'Community flag' }),
      });
      setReportedIds((prev) => new Set(prev).add(photoId));
    } catch {
      // ignore report error
    }
  };

  const handleUploadSuccess = () => {
    // Refresh photos or notify parent
    window.location.reload();
  };

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
            Community Photos
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {photos.length === 0 ? 'No photos shared yet' : `${photos.length} photo${photos.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
        >
          <span>📷 Add Photo</span>
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 text-center">
          <div className="text-2xl mb-2">📸</div>
          <p className="text-xs text-slate-400">Be the first traveler to share a photo of {placeName}!</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-3 px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-semibold rounded-xl hover:bg-emerald-400 transition-all"
          >
            Upload Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo, index) => {
            const isFirst = index === 0;
            return (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer transition-all hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5"
              >
                <Image
                  src={photo.url_card || photo.url_medium || photo.url_thumb}
                  alt={photo.caption || placeName}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  priority={isFirst}
                  decoding="async"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                  {photo.caption && (
                    <p className="text-[11px] text-slate-200 line-clamp-1 font-medium">
                      {photo.caption}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400">
                    by {photo.attribution_name || 'Community'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-2 right-2 z-10 text-slate-300 hover:text-white bg-slate-900/80 p-2 rounded-full text-sm"
            >
              ✕
            </button>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950">
              <Image
                src={activePhoto.url_medium || activePhoto.url_card}
                alt={activePhoto.caption || placeName}
                fill
                sizes="100vw"
                priority
                className="object-contain"
              />
            </div>
            <div className="w-full mt-3 flex justify-between items-center text-xs text-slate-300">
              <div>
                {activePhoto.caption && <p className="font-semibold text-slate-100">{activePhoto.caption}</p>}
                <p className="text-slate-400 text-[11px]">Photo by {activePhoto.attribution_name || 'Community Member'}</p>
              </div>
              <button
                onClick={() => handleReport(activePhoto.id)}
                disabled={reportedIds.has(activePhoto.id)}
                className="text-slate-500 hover:text-red-400 text-[11px] underline transition-colors"
              >
                {reportedIds.has(activePhoto.id) ? 'Reported' : 'Report Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <UploadPlacePhotoModal
        placeId={placeId}
        placeName={placeName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
