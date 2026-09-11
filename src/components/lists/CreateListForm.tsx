'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, GlobeIcon, LockIcon, PinIcon, SpinnerIcon } from '@/components/icons/Icons';

export function CreateListForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          destination: destination.trim() || undefined,
          description: description.trim() || undefined,
          isPublic,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.slug) {
        setError(data.error || 'Failed to create list. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Navigate immediately to the new list page
      router.push(`/l/${data.slug}`);
    } catch {
      setError('Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#E8E3D8] rounded-3xl p-6 sm:p-10 shadow-xs space-y-7"
    >
      {error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-800">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <label className="block text-xs font-extrabold text-[#18181B]">
          List Title <span className="text-[#E0533C]">*</span>
        </label>
        <input
          type="text"
          name="title"
          required
          disabled={isSubmitting}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. 7 Days in Kyoto or Best Hidden Cafes in Kolkata"
          className="w-full rounded-xl border border-[#E8E3D8] bg-[#FAF8F3] px-4 py-3 text-xs font-medium text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B] focus:bg-white disabled:opacity-60 transition-all"
        />
      </div>

      {/* Destination */}
      <div className="space-y-1.5">
        <label className="block text-xs font-extrabold text-[#18181B]">
          Destination / Region
        </label>
        <div className="relative">
          <PinIcon className="absolute left-4 top-3.5 h-4 w-4 text-[#E0533C]" />
          <input
            type="text"
            name="destination"
            disabled={isSubmitting}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Kyoto, Japan or North Kolkata"
            className="w-full rounded-xl border border-[#E8E3D8] bg-[#FAF8F3] pl-11 pr-4 py-3 text-xs font-medium text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B] focus:bg-white disabled:opacity-60 transition-all"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="block text-xs font-extrabold text-[#18181B]">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          disabled={isSubmitting}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what makes this list special, who it's for, or best time to visit..."
          className="w-full rounded-xl border border-[#E8E3D8] bg-[#FAF8F3] px-4 py-3 text-xs font-medium text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B] focus:bg-white disabled:opacity-60 transition-all"
        />
      </div>

      {/* Visibility */}
      <div className="space-y-3 pt-3 border-t border-[#E8E3D8]">
        <label className="block text-xs font-extrabold text-[#18181B]">
          List Privacy &amp; Access
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label
            onClick={() => !isSubmitting && setIsPublic(true)}
            className={`relative flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
              isPublic
                ? 'border-[#18181B] bg-[#FAF8F3]'
                : 'border-[#E8E3D8] hover:border-[#18181B]'
            } ${isSubmitting ? 'opacity-60 pointer-events-none' : ''}`}
          >
            <input
              type="radio"
              name="isPublic"
              checked={isPublic}
              onChange={() => setIsPublic(true)}
              className="mt-1 text-[#18181B] focus:ring-[#18181B]"
            />
            <div>
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#18181B]">
                <GlobeIcon className="h-4 w-4 text-[#2E7D32]" /> Public List
              </span>
              <p className="text-[11px] text-[#71717A] mt-1 font-medium leading-relaxed">
                Anyone can discover this list on Discover &amp; search engines.
              </p>
            </div>
          </label>

          <label
            onClick={() => !isSubmitting && setIsPublic(false)}
            className={`relative flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
              !isPublic
                ? 'border-[#18181B] bg-[#FAF8F3]'
                : 'border-[#E8E3D8] hover:border-[#18181B]'
            } ${isSubmitting ? 'opacity-60 pointer-events-none' : ''}`}
          >
            <input
              type="radio"
              name="isPublic"
              checked={!isPublic}
              onChange={() => setIsPublic(false)}
              className="mt-1 text-[#18181B] focus:ring-[#18181B]"
            />
            <div>
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#18181B]">
                <LockIcon className="h-4 w-4 text-[#71717A]" /> Private List
              </span>
              <p className="text-[11px] text-[#71717A] mt-1 font-medium leading-relaxed">
                Only accessible by you and invited collaborators.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="w-full rounded-xl bg-[#18181B] hover:bg-[#C8422C] disabled:opacity-50 text-white font-bold py-3.5 text-xs shadow-2xs active-press transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <SpinnerIcon className="h-4 w-4 animate-spin" />
            <span>Creating Trackilio List…</span>
          </>
        ) : (
          <>
            <PlusIcon className="h-4 w-4" />
            <span>Create Trackilio List</span>
          </>
        )}
      </button>
    </form>
  );
}
