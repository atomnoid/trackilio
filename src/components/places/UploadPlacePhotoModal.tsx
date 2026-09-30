'use client';

import React, { useState } from 'react';
import { compressImageVariants } from '@/lib/clientImageCompressor';

interface UploadPlacePhotoModalProps {
  placeId: string;
  placeName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UploadPlacePhotoModal({
  placeId,
  placeName,
  isOpen,
  onClose,
  onSuccess,
}: UploadPlacePhotoModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [attributionName, setAttributionName] = useState('');
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 15 * 1024 * 1024) {
        setError('Image file must be smaller than 15MB');
        return;
      }
      setFile(selected);
      setError(null);
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file');
      return;
    }
    if (!rightsConfirmed) {
      setError('You must confirm that you own or have permission to share this photo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Client-side Canvas compression to 3 WebP variants (Thumb, Card, Medium)
      const variants = await compressImageVariants(file);

      // 2. Prepare FormData payload
      const formData = new FormData();
      formData.append('placeId', placeId);
      formData.append('caption', caption);
      formData.append('attributionName', attributionName);
      formData.append('rightsConfirmed', 'true');
      formData.append('thumb', variants.thumbBlob, 'thumb.webp');
      formData.append('card', variants.cardBlob, 'card.webp');
      formData.append('medium', variants.mediumBlob, 'medium.webp');

      // 3. POST upload route with magic-byte verification on server
      const res = await fetch('/api/places/photos/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload photo');
      }

      setFile(null);
      setPreviewUrl(null);
      setCaption('');
      setRightsConfirmed(false);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error processing photo upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Add Photo</h3>
            <p className="text-xs text-slate-400 mt-0.5">Share a photo for {placeName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-xl font-bold p-1 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* File Picker */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Select Photo (JPEG, PNG, WebP)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 cursor-pointer"
            />
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-950 border border-slate-800 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            </div>
          )}

          {/* Caption */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Caption (Optional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Sunset view from the main terrace"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Attribution Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Your Display Name / Credit
            </label>
            <input
              type="text"
              value={attributionName}
              onChange={(e) => setAttributionName(e.target.value)}
              placeholder="Your name or handle"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Rights confirmation checkbox */}
          <div className="flex items-start space-x-3 pt-2">
            <input
              type="checkbox"
              id="rights"
              checked={rightsConfirmed}
              onChange={(e) => setRightsConfirmed(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/30"
            />
            <label htmlFor="rights" className="text-xs text-slate-400 leading-snug">
              I confirm that I own or have permission to upload this photo under community terms.
              No copyrighted or watermarked material from third parties.
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !file || !rightsConfirmed}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/10"
            >
              {loading ? 'Compressing & Uploading...' : 'Upload Photo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
