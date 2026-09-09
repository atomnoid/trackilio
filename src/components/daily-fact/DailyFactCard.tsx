'use client';

import { DailyFact } from '@/types/database';
import Link from 'next/link';

interface FunFactWidgetProps {
  initialFact: DailyFact | null;
  variant?: 'hero' | 'dashboard' | 'banner';
}

export function FunFactWidget({ initialFact, variant = 'hero' }: FunFactWidgetProps) {
  if (!initialFact) return null;

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl bg-[#F5E7C6] border border-[#E8DECA] p-4 text-left transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DECA] pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-[#222222] text-white px-2 py-0.5 rounded-md">
            Daily Discovery
          </span>
          <span className="text-xs font-bold text-[#222222]">
            {initialFact.location ? `${initialFact.location}, ${initialFact.country}` : 'World Curiosity'}
          </span>
        </div>
        <span className="text-[11px] text-[#6B6862] font-semibold">
          Updated Daily
        </span>
      </div>

      <div className="space-y-1">
        <h4 className="font-sans text-xs sm:text-sm font-extrabold text-[#222222]">
          {initialFact.title}
        </h4>
        <p className="text-xs text-[#6B6862] leading-relaxed">
          {initialFact.fact}
        </p>
      </div>

      {initialFact.location && (
        <div className="pt-2 flex justify-end">
          <Link
            href={`/discover?city=${encodeURIComponent(initialFact.location)}`}
            className="text-[11px] font-extrabold text-[#FA8112] hover:underline"
          >
            Explore places in {initialFact.location} &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
