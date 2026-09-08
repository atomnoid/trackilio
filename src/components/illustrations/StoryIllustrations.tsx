'use client';

import React from 'react';
import { Bookmark, MapPin, Share2, Users } from 'lucide-react';

export function CollectIllustration() {
  return (
    <div className="relative w-full h-52 rounded-2xl bg-[#F5F1E8] p-5 border border-[#E2DAC8] overflow-hidden flex items-center justify-center select-none editorial-card">
      {/* Editorial Card 1 */}
      <div className="absolute top-4 left-5 bg-white rounded-xl p-3 shadow-xs border border-[#E8E3D8] w-40 rotate-[-3deg]">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-md bg-[#FDF3F1] text-[#E0533C]">
            <MapPin className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-bold text-[#18181B]">Tsukiji Market</span>
        </div>
        <p className="text-[11px] text-[#71717A]">Fresh sushi at 6 AM</p>
      </div>

      {/* Editorial Card 2 */}
      <div className="absolute bottom-4 right-5 bg-white rounded-xl p-3 shadow-xs border border-[#E8E3D8] w-44 rotate-[2deg]">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-bold text-[#18181B]">☕ Flurys Bakery</span>
          <span className="text-[10px] bg-[#E0533C]/10 text-[#E0533C] font-bold px-2 py-0.5 rounded-full">
            Must Visit
          </span>
        </div>
        <p className="text-[11px] text-[#71717A]">Kolkata classic rum balls</p>
      </div>

      {/* Collector Stamp Icon */}
      <div className="relative z-10 h-14 w-14 rounded-2xl bg-[#18181B] text-white flex items-center justify-center shadow-sm">
        <Bookmark className="h-7 w-7 stroke-[2]" />
      </div>
    </div>
  );
}

export function OrganizeIllustration() {
  return (
    <div className="relative w-full h-52 rounded-2xl bg-[#F5F1E8] p-5 border border-[#E2DAC8] overflow-hidden flex items-center justify-center select-none editorial-card">
      <div className="w-full max-w-xs space-y-2">
        <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-[#E8E3D8] shadow-2xs">
          <span className="text-xs font-bold text-[#18181B] flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E0533C]" />
            Must Visit (4 places)
          </span>
          <span className="text-[10px] font-bold text-[#E0533C] bg-[#FDF3F1] px-2 py-0.5 rounded-md">
            Priority 1
          </span>
        </div>

        <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-[#E8E3D8] shadow-2xs">
          <span className="text-xs font-bold text-[#18181B] flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            Want to Visit (8 places)
          </span>
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
            Priority 2
          </span>
        </div>

        <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-[#E8E3D8] shadow-2xs">
          <span className="text-xs font-bold text-[#18181B] flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#71717A]" />
            Maybe (3 places)
          </span>
          <span className="text-[10px] font-bold text-[#71717A] bg-slate-100 px-2 py-0.5 rounded-md">
            Optional
          </span>
        </div>
      </div>
    </div>
  );
}

export function PlanIllustration() {
  return (
    <div className="relative w-full h-52 rounded-2xl bg-[#F5F1E8] p-5 border border-[#E2DAC8] overflow-hidden flex items-center justify-center select-none editorial-card">
      <div className="flex items-center gap-2 bg-white px-5 py-3.5 rounded-2xl border border-[#E8E3D8] shadow-xs">
        <div className="text-center">
          <div className="h-9 w-9 rounded-xl bg-[#18181B] text-white flex items-center justify-center font-bold text-[11px] mx-auto">
            START
          </div>
          <span className="text-[10px] font-bold text-[#18181B] mt-1 block">Tokyo</span>
        </div>

        <svg className="w-16 h-5" viewBox="0 0 60 20" fill="none">
          <path d="M0 10 H60" stroke="#E0533C" strokeWidth="2.5" strokeDasharray="5 3" />
        </svg>

        <div className="text-center">
          <div className="h-9 w-9 rounded-xl bg-[#E0533C] text-white flex items-center justify-center font-bold text-[11px] mx-auto">
            STOP
          </div>
          <span className="text-[10px] font-bold text-[#18181B] mt-1 block">Kyoto</span>
        </div>

        <svg className="w-16 h-5" viewBox="0 0 60 20" fill="none">
          <path d="M0 10 H60" stroke="#2E7D32" strokeWidth="2.5" strokeDasharray="5 3" />
        </svg>

        <div className="text-center">
          <div className="h-9 w-9 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center font-bold text-[11px] mx-auto">
            END
          </div>
          <span className="text-[10px] font-bold text-[#18181B] mt-1 block">Osaka</span>
        </div>
      </div>
    </div>
  );
}

export function ShareIllustration() {
  return (
    <div className="relative w-full h-52 rounded-2xl bg-[#F5F1E8] p-5 border border-[#E2DAC8] overflow-hidden flex items-center justify-center select-none editorial-card">
      <div className="bg-white rounded-2xl p-4 border border-[#E8E3D8] max-w-xs w-full space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
            <Users className="h-4 w-4 text-[#E0533C]" /> Collaborators
          </span>
          <span className="text-[10px] bg-[#E8F5E9] text-[#2E7D32] font-bold px-2 py-0.5 rounded-full">
            Public List
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center text-[10px] font-bold">
            AR
          </div>
          <div className="h-7 w-7 rounded-lg bg-[#E0533C] text-white flex items-center justify-center text-[10px] font-bold">
            AM
          </div>
          <div className="h-7 w-7 rounded-lg bg-[#2E7D32] text-white flex items-center justify-center text-[10px] font-bold">
            CD
          </div>
          <div className="h-7 w-7 rounded-lg bg-[#F3EFE6] text-[#71717A] flex items-center justify-center text-[10px] font-bold">
            +3
          </div>
        </div>
        <div className="pt-1.5 border-t border-[#E8E3D8] flex items-center justify-between text-[11px] font-bold text-[#E0533C]">
          <span>trackilio.com/l/japan-2026</span>
          <Share2 className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}
