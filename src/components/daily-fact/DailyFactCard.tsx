import React from 'react';
import { getTodaysFact } from '@/services/dailyFacts';
import { MapPin, Sparkles } from 'lucide-react';

export async function DailyFactCard() {
  const fact = await getTodaysFact();

  if (!fact) return null;

  return (
    <aside className="rounded-3xl border border-[#D8E8DF] bg-gradient-to-br from-[#EDF5F0] to-[#F5F1E8] p-6 space-y-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-[#4A6B5D] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
          <Sparkles className="h-3 w-3" />
          Daily Travel Fact
        </span>
      </div>

      <div className="space-y-1.5">
        <h3 className="font-sans text-base font-black text-[#2C2A29] leading-snug">
          {fact.title}
        </h3>
        <p className="text-xs text-[#78726D] leading-relaxed font-medium">
          {fact.fact}
        </p>
      </div>

      {(fact.location || fact.country) && (
        <div className="flex items-center gap-1 text-[11px] font-bold text-[#4A6B5D]">
          <MapPin className="h-3 w-3" />
          <span>
            {[fact.location, fact.country].filter(Boolean).join(', ')}
          </span>
        </div>
      )}
    </aside>
  );
}
