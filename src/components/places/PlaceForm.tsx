'use client';

import React, { useState } from 'react';
import { PriorityLevel, VisitStatus } from '@/types/database';
import { PlusCircle, Tag, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PlaceFormProps {
  listId: string;
  currentUserId?: string;
  onSuccess?: () => void;
}

const AVAILABLE_TAGS = [
  { label: 'Cafés', emoji: '☕' },
  { label: 'Restaurants', emoji: '🍽️' },
  { label: 'Hidden Gems', emoji: '💎' },
  { label: 'Date Spots', emoji: '❤️' },
  { label: 'Sightseeing', emoji: '🏛️' },
  { label: 'Nature', emoji: '🌿' },
  { label: 'Bars & Nightlife', emoji: '🍸' },
  { label: 'Shopping', emoji: '🛍️' },
  { label: 'Weekend Trips', emoji: '🚗' },
];

export function PlaceForm({ listId, onSuccess }: PlaceFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('Cafe');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mapsUrl, setMapsUrl] = useState('');
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('must_visit');
  const [status, setStatus] = useState<VisitStatus>('saved');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (tagText: string) => {
    if (selectedTags.includes(tagText)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagText));
    } else {
      if (selectedTags.length >= 3) {
        setError('You can select a maximum of 3 tags.');
        setTimeout(() => setError(null), 3000);
        return;
      }
      setSelectedTags([...selectedTags, tagText]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listId,
          name: name.trim(),
          location: location.trim() || undefined,
          country: country.trim() || undefined,
          category,
          tags: selectedTags,
          mapsUrl: mapsUrl.trim() || undefined,
          note: note.trim() || undefined,
          priority,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to add place');
      } else {
        setName('');
        setLocation('');
        setCountry('');
        setSelectedTags([]);
        setMapsUrl('');
        setNote('');
        if (onSuccess) onSuccess();
        router.refresh();
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-4">
      <h3 className="font-sans text-base font-extrabold text-gray-900 flex items-center gap-2">
        <PlusCircle className="h-4.5 w-4.5 text-[#FF5841]" /> Add a Place to List
      </h3>

      {error && (
        <div className="rounded-2xl bg-[#FFEAE6] border border-[#FFD3CC] p-3 text-xs text-[#FF5841] font-bold">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="block text-xs font-bold text-gray-700">Place Name *</label>
        <input
          type="text"
          required
          placeholder="e.g. Arabica Coffee Kyoto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/20 focus:bg-white focus:border-[#FF5841] transition-all"
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
            <option value="Sight">🏛️ Sight / Landmark</option>
            <option value="Hotel">🏨 Hotel / Stay</option>
            <option value="Hidden Gem">💎 Hidden Gem</option>
            <option value="Activity">🎡 Activity / Experience</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-700">City / Region</label>
          <input
            type="text"
            placeholder="e.g. Kyoto"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/20 focus:bg-white focus:border-[#FF5841] transition-all"
          />
        </div>
      </div>

      {/* Select Tags (Max 3) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-[#C53678]" />
            <span>Add Tags (Max 3)</span>
          </label>
          <span className="text-[10px] font-bold text-gray-400">
            {selectedTags.length}/3 selected
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_TAGS.map((t) => {
            const tagValue = `${t.emoji} ${t.label}`;
            const isSelected = selectedTags.includes(tagValue);
            return (
              <button
                type="button"
                key={t.label}
                onClick={() => toggleTag(tagValue)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-transparent'
                }`}
              >
                <span>{t.emoji}</span>
                <span>{t.label}</span>
                {isSelected && <X className="h-3 w-3 ml-0.5" />}
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
            <option value="must_visit">🔥 Must Visit</option>
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
          placeholder="https://maps.google.com/..."
          value={mapsUrl}
          onChange={(e) => setMapsUrl(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/20 focus:bg-white focus:border-[#FF5841] transition-all"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-bold text-gray-700">Note / Recommendation</label>
        <textarea
          rows={2}
          placeholder="Best coffee near Higashiyama, try the matcha latte..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/20 focus:bg-white focus:border-[#FF5841] transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="w-full rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] hover:opacity-95 text-white font-black py-3 text-xs shadow-xs active-press transition-all disabled:opacity-50"
      >
        {loading ? 'Adding Place...' : 'Save Place to List'}
      </button>
    </form>
  );
}
