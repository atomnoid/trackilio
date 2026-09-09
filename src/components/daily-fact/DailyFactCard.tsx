'use client';

import React, { useState } from 'react';
import { Sparkles, Dices, MapPin, Share2, Check, Flame } from 'lucide-react';
import { DailyFact } from '@/types/database';

interface FunFactWidgetProps {
  initialFact: DailyFact;
  variant?: 'hero' | 'dashboard' | 'compact';
}

export function FunFactWidget({ initialFact, variant = 'hero' }: FunFactWidgetProps) {
  const [fact, setFact] = useState<DailyFact>(initialFact);
  const [isRolling, setIsRolling] = useState(false);
  const [copied, setCopied] = useState(false);

  const rollNewFact = async () => {
    if (isRolling) return;
    setIsRolling(true);

    try {
      const res = await fetch(`/api/facts/random?exclude=${encodeURIComponent(fact.id)}`);
      const data = await res.json();
      if (data.success && data.fact) {
        setFact(data.fact);
      }
    } catch {
      // Keep current if network fails
    } finally {
      setTimeout(() => {
        setIsRolling(false);
      }, 400);
    }
  };

  const handleShareOrCopy = async () => {
    const shareText = `🌍 Travel Fun Fact: ${fact.title}\n\n"${fact.fact}"\n— ${[fact.location, fact.country].filter(Boolean).join(', ')} via Trackilio ✨`;
    
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === 'hero') {
    return (
      <div className="relative group w-full max-w-3xl mx-auto transform transition-all duration-300">
        {/* Glow ambient layer */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#FF5841]/30 via-[#C53678]/30 to-[#FF7A5C]/30 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500 pointer-events-none" />

        <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-md border border-[#FF5841]/20 shadow-lg hover:shadow-xl p-5 sm:p-6 transition-all">
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                <Sparkles className="h-3.5 w-3.5 animate-spin-slow" />
                Random Travel Fact
              </span>
              {(fact.location || fact.country) && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#C53678] bg-[#FDF4F8] border border-[#F9E2EE] px-2.5 py-0.5 rounded-full">
                  <MapPin className="h-3 w-3 text-[#FF5841]" />
                  {[fact.location, fact.country].filter(Boolean).join(', ')}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShareOrCopy}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-gray-500 hover:text-[#C53678] hover:bg-[#FDF4F8] border border-transparent hover:border-[#F9E2EE] transition-all active-press"
                title="Copy fact snippet"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-[11px] text-emerald-600 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline text-[11px]">Share</span>
                  </>
                )}
              </button>

              <button
                onClick={rollNewFact}
                disabled={isRolling}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFEAE6] hover:bg-[#FFD3CC] border border-[#FFD3CC] text-[#FF5841] text-xs font-black shadow-2xs hover:shadow-xs transition-all active-press disabled:opacity-50 cursor-pointer"
                title="Roll another random travel fact"
              >
                <Dices className={`h-4 w-4 ${isRolling ? 'animate-spin' : 'group-hover:rotate-45'} transition-transform duration-300`} />
                <span>{isRolling ? 'Rolling…' : 'Roll Fact'}</span>
              </button>
            </div>
          </div>

          {/* Fact Content */}
          <div className="pt-3.5 space-y-1.5 text-left">
            <h3 className="font-sans text-base sm:text-lg font-black text-gray-900 leading-snug flex items-center gap-2">
              <span>{fact.title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
              {fact.fact}
            </p>
          </div>

          {/* Mobile location footer */}
          {(fact.location || fact.country) && (
            <div className="sm:hidden pt-2.5 flex items-center gap-1 text-[11px] font-bold text-[#C53678]">
              <MapPin className="h-3 w-3 text-[#FF5841]" />
              <span>{[fact.location, fact.country].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Dashboard variant: Full card matching dashboard design aesthetic
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF5F3] via-[#FFFFFF] to-[#FDF4F8] border border-[#FFD3CC] p-5 sm:p-6 shadow-xs hover:shadow-md transition-all">
      {/* Playful Background Sparkle Watermark */}
      <div className="absolute top-2 right-4 text-7xl font-black opacity-[0.03] select-none pointer-events-none text-[#FF5841]">
        ✈️
      </div>

      <div className="relative z-10 space-y-3">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5841] text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
              <Flame className="h-3 w-3 text-amber-200" />
              Travel Trivia of the Day
            </span>
            {(fact.location || fact.country) && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C53678]">
                <MapPin className="h-3 w-3 text-[#FF5841]" />
                {[fact.location, fact.country].filter(Boolean).join(', ')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShareOrCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-gray-500 hover:text-[#C53678] hover:bg-white border border-transparent hover:border-gray-200 transition-all active-press"
              title="Copy fact"
            >
              {copied ? (
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Copied!
                </span>
              ) : (
                <Share2 className="h-3.5 w-3.5" />
              )}
            </button>

            <button
              onClick={rollNewFact}
              disabled={isRolling}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white hover:bg-[#FFEAE6] border border-[#FFD3CC] text-[#FF5841] text-xs font-black shadow-2xs transition-all active-press cursor-pointer"
            >
              <Dices className={`h-3.5 w-3.5 ${isRolling ? 'animate-spin' : ''}`} />
              <span>{isRolling ? 'Rolling…' : 'Roll Next'}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h4 className="font-sans text-sm sm:text-base font-black text-gray-900 leading-snug">
            {fact.title}
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed font-normal">
            {fact.fact}
          </p>
        </div>
      </div>
    </div>
  );
}

export function DailyFactCard({
  initialFact,
  variant = 'hero',
}: {
  initialFact?: DailyFact;
  variant?: 'hero' | 'dashboard' | 'compact';
}) {
  if (!initialFact) return null;
  return <FunFactWidget initialFact={initialFact} variant={variant} />;
}
