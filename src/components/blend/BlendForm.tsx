'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, AtSign, Sparkles } from 'lucide-react';
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
        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#8E6D8E]" />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter traveler's @username (e.g. sara_travels)"
          className="w-full rounded-2xl border border-[#E7E0EE] bg-[#FAF9FC] pl-11 pr-4 py-4 text-sm font-medium text-[#2A2735] focus:outline-none focus:ring-2 focus:ring-[#C5ADC5] focus:bg-white transition-all shadow-2xs"
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
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#C5ADC5] to-[#B2B5E0] hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold px-8 py-4 text-sm shadow-xs active-press transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Calculating Blend Score…</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Generate Travel Blend</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
