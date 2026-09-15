'use client';

import { useState } from 'react';
import { DailyFact } from '@/types/database';
import Link from 'next/link';

interface FunFactWidgetProps {
  initialFact: DailyFact | null;
  variant?: 'hero' | 'dashboard' | 'banner';
}

export function FunFactWidget({ initialFact, variant = 'hero' }: FunFactWidgetProps) {
  const [fact, setFact] = useState<DailyFact | null>(initialFact);
  const [isLoading, setIsLoading] = useState(false);

  if (!fact) return null;

  const handleShuffle = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/facts/random?exclude=${encodeURIComponent(fact.id)}`);
      const data = await res.json();
      if (data.success && data.fact) {
        setFact(data.fact);
      }
    } catch {
      // Keep existing fact on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl bg-[#F5E7C6] border border-[#E8DECA] p-4 text-left transition-all shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DECA] pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-[#222222] text-white px-2 py-0.5 rounded-md">
            Daily Discovery
          </span>
          <span className="text-xs font-bold text-[#222222]">
            {fact.location ? `${fact.location}, ${fact.country}` : 'World Curiosity'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#6B6862] font-semibold">
            Updated Midnight
          </span>
          <button
            onClick={handleShuffle}
            disabled={isLoading}
            title="Discover another fact"
            className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#FA8112] hover:text-[#222222] transition-colors disabled:opacity-50"
          >
            <svg
              className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="font-sans text-xs sm:text-sm font-extrabold text-[#222222]">
          {fact.title}
        </h4>
        <p className="text-xs text-[#6B6862] leading-relaxed">
          {fact.fact}
        </p>
      </div>

      {fact.location && (
        <div className="pt-2 flex justify-end">
          <Link
            href={`/discover?city=${encodeURIComponent(fact.location)}`}
            className="text-[11px] font-extrabold text-[#FA8112] hover:underline"
          >
            Explore places in {fact.location} &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}

