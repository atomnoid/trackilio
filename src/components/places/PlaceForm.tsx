'use client';

import React, { useState } from 'react';
import { PriorityLevel, VisitStatus } from '@/types/database';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PlaceFormProps {
  listId: string;
  currentUserId?: string;
  onSuccess?: () => void;
}

export function PlaceForm({ listId, onSuccess }: PlaceFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('Cafe');
  const [mapsUrl, setMapsUrl] = useState('');
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('must_visit');
  const [status, setStatus] = useState<VisitStatus>('saved');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xl shadow-violet-500/5 space-y-4">
      <h3 className="font-display text-lg font-extrabold text-slate-900 flex items-center gap-2">
        <PlusCircle className="h-5 w-5 text-violet-600" /> Add a Place to List
      </h3>

      {error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="block text-xs font-bold text-slate-800">Place Name *</label>
        <input
          type="text"
          required
          placeholder="e.g. Arabica Coffee Kyoto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-800">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600"
          >
            <option value="Cafe">Cafe</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Sight">Sight / Landmark</option>
            <option value="Hotel">Hotel / Stay</option>
            <option value="Hidden Gem">Hidden Gem</option>
            <option value="Activity">Activity / Experience</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-800">City / Region</label>
          <input
            type="text"
            placeholder="e.g. Kyoto"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-800">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as PriorityLevel)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600"
          >
            <option value="must_visit">🔥 Must Visit</option>
            <option value="want_to_visit">🧭 Want to Visit</option>
            <option value="maybe">Maybe</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-800">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as VisitStatus)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600"
          >
            <option value="saved">Saved</option>
            <option value="planned">Planned</option>
            <option value="visited">Visited</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-bold text-slate-800">Google Maps URL</label>
        <input
          type="url"
          placeholder="https://maps.google.com/..."
          value={mapsUrl}
          onChange={(e) => setMapsUrl(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white transition-all"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-bold text-slate-800">Note / Recommendation</label>
        <textarea
          rows={2}
          placeholder="Best coffee near Higashiyama, try the matcha latte..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-extrabold py-3 text-xs shadow-md hover:shadow-lg active-press transition-all disabled:opacity-50"
      >
        {loading ? 'Adding Place...' : 'Save Place to List'}
      </button>
    </form>
  );
}
