'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PriorityLevel, VisitStatus } from '@/types/database';
import { EditIcon, TrashIcon, CloseIcon, SpinnerIcon, AlertTriangleIcon, TagIcon } from '@/components/icons/Icons';

interface EditPlaceModalProps {
  listPlaceId: string;
  initialName: string;
  initialLocation?: string | null;
  initialCategory?: string | null;
  initialTags?: string[] | null;
  initialNote?: string | null;
  initialPriority?: PriorityLevel;
  initialStatus?: VisitStatus;
  initialMapsUrl?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AVAILABLE_TAGS = [
  { label: 'Cafés', emoji: '☕' },
  { label: 'Restaurants', emoji: '🍽️' },
  { label: 'Waterfall', emoji: '🌊' },
  { label: 'Mountain', emoji: '⛰️' },
  { label: 'Forest', emoji: '🌲' },
  { label: 'Spiritual Sights', emoji: '🛕' },
  { label: 'Hidden Gems', emoji: '💎' },
  { label: 'Date Spots', emoji: '❤️' },
  { label: 'Sightseeing', emoji: '🏛️' },
  { label: 'Nature', emoji: '🌿' },
  { label: 'Beach', emoji: '🏖️' },
  { label: 'Bars & Nightlife', emoji: '🍸' },
  { label: 'Shopping', emoji: '🛍️' },
  { label: 'Weekend Trips', emoji: '🚗' },
];

export function EditPlaceModal({
  listPlaceId,
  initialName,
  initialLocation = '',
  initialCategory = 'Cafe',
  initialTags = [],
  initialNote = '',
  initialPriority = 'must_visit',
  initialStatus = 'saved',
  initialMapsUrl = '',
  isOpen,
  onClose,
  onSuccess,
}: EditPlaceModalProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [location, setLocation] = useState(initialLocation || '');
  const [category, setCategory] = useState(initialCategory || 'Cafe');
  const [tags, setTags] = useState<string[]>(initialTags || []);
  const [note, setNote] = useState(initialNote || '');
  const [priority, setPriority] = useState<PriorityLevel>(initialPriority);
  const [status, setStatus] = useState<VisitStatus>(initialStatus);
  const [mapsUrl, setMapsUrl] = useState(initialMapsUrl || '');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleTag = (tagText: string) => {
    if (tags.includes(tagText)) {
      setTags(tags.filter((t) => t !== tagText));
    } else {
      if (tags.length >= 3) {
        setError('Maximum of 3 tags allowed.');
        setTimeout(() => setError(null), 3000);
        return;
      }
      setTags([...tags, tagText]);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/places/manage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listPlaceId,
          name: name.trim(),
          location: location.trim(),
          category,
          tags,
          note: note.trim(),
          priority,
          status,
          mapsUrl: mapsUrl.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update place.');
      } else {
        if (onSuccess) onSuccess();
        onClose();
        router.refresh();
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch('/api/places/manage', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listPlaceId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to remove place.');
        setDeleting(false);
      } else {
        if (onSuccess) onSuccess();
        onClose();
        router.refresh();
      }
    } catch {
      setError('Network error while deleting.');
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg my-auto bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-colors"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <div className="space-y-1 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEAE6] text-[#FF5841] text-xs font-black">
            <EditIcon className="h-3.5 w-3.5" />
            <span>Place Settings</span>
          </div>
          <h2 className="font-sans text-2xl font-black text-gray-900 tracking-tight">
            Edit Place Details
          </h2>
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-bold text-rose-800">
            {error}
          </div>
        )}

        {showDeleteConfirm ? (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangleIcon className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-sans text-sm font-black text-rose-900">
                  Remove &ldquo;{name}&rdquo; from this list?
                </h4>
                <p className="text-xs text-rose-700 font-medium leading-relaxed">
                  This will remove this place and your custom notes from this itinerary.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 py-2.5 px-4 rounded-xl border border-rose-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Keep Place
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black py-2.5 px-4 transition-colors disabled:opacity-50"
              >
                {deleting ? <SpinnerIcon className="h-3.5 w-3.5 animate-spin" /> : <TrashIcon className="h-3.5 w-3.5" />}
                <span>{deleting ? 'Removing…' : 'Yes, Remove Place'}</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Place Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arabica Coffee Kyoto"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/20 focus:bg-white focus:border-[#FF5841] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/20 focus:border-[#FF5841]"
                >
                  <option value="Cafe">☕ Cafe</option>
                  <option value="Restaurant">🍽️ Restaurant</option>
                  <option value="Waterfall">🌊 Waterfall</option>
                  <option value="Mountain">⛰️ Mountain & Hills</option>
                  <option value="Forest">🌲 Forest & Nature</option>
                  <option value="Spiritual Sight">🛕 Spiritual Sight / Sacred</option>
                  <option value="Sight">🏛️ Sight / Landmark</option>
                  <option value="Hidden Gem">💎 Hidden Gem</option>
                  <option value="Hotel">🏨 Hotel / Stay</option>
                  <option value="Activity">🎡 Activity / Trek</option>
                  <option value="Beach">🏖️ Beach & Coastal</option>
                  <option value="Nightlife">🍸 Bars & Nightlife</option>
                  <option value="Shopping">🛍️ Shopping</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">City / Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kyoto"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/20 focus:bg-white focus:border-[#FF5841] transition-all"
                />
              </div>
            </div>

            {/* Tags (Max 3) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <TagIcon className="h-3.5 w-3.5 text-[#C53678]" />
                  <span>Tags (Max 3)</span>
                </label>
                <span className="text-[10px] font-bold text-gray-400">
                  {tags.length}/3 selected
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TAGS.map((t) => {
                  const tagValue = `${t.emoji} ${t.label}`;
                  const isSelected = tags.includes(tagValue);
                  return (
                    <button
                      type="button"
                      key={t.label}
                      onClick={() => toggleTag(tagValue)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white shadow-xs'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <span>{t.emoji}</span>
                      <span>{t.label}</span>
                      {isSelected && <CloseIcon className="h-3 w-3 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/20 focus:border-[#FF5841]"
                >
                  <option value="must_visit">✨ Must Visit</option>
                  <option value="want_to_visit">🧭 Want to Visit</option>
                  <option value="maybe">Maybe</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as VisitStatus)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/20 focus:border-[#FF5841]"
                >
                  <option value="saved">Saved</option>
                  <option value="planned">Planned</option>
                  <option value="visited">Visited</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Google Maps URL</label>
              <input
                type="url"
                value={mapsUrl}
                onChange={(e) => setMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/20 focus:bg-white focus:border-[#FF5841] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Note / Recommendation</label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Best coffee near Higashiyama..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/20 focus:bg-white focus:border-[#FF5841] transition-all"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-2xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
              >
                <TrashIcon className="h-4 w-4" />
                <span>Remove Place</span>
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] hover:opacity-95 disabled:opacity-50 text-white font-black py-3 px-5 text-xs shadow-xs active-press transition-all"
                >
                  {loading ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : null}
                  <span>{loading ? 'Saving…' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
