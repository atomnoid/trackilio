'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, SpinnerIcon, AtSignIcon, SparklesIcon } from '@/components/icons/Icons';
import { sanitizeUsername } from '@/lib/username';

interface BlendFormProps {
  prefillUsername?: string;
}

export function BlendForm({ prefillUsername }: BlendFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState(prefillUsername ? sanitizeUsername(prefillUsername) : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = sanitizeUsername(username);
    if (!cleanUser) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/blend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withUsername: cleanUser }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Something went wrong. Please check the @username and try again.');
        setLoading(false);
        return;
      }

      router.push(`/blend/${data.blendId}`);
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <AtSignIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FA8112]" />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter traveler's @username (e.g. sara_travels)"
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-4 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/40 focus:bg-white focus:border-[#FF5841]/50 transition-all shadow-xs"
          disabled={loading}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {error && (
        <p className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-xs font-bold text-rose-800">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !username.trim()}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold px-8 py-4 text-sm shadow-xs active-press transition-all"
      >
        {loading ? (
          <>
            <SpinnerIcon className="h-4 w-4 animate-spin" />
            <span>Calculating Blend Score…</span>
          </>
        ) : (
          <>
            <SparklesIcon className="h-4 w-4" />
            <span>Generate Travel Blend</span>
            <ArrowRightIcon className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
