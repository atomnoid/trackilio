'use client';

import React from 'react';
import { BookmarkIcon, PinIcon, ShareIcon, UsersIcon } from '@/components/icons/Icons';

export function CollectIllustration() {
  return (
    <div className="relative w-full h-52 rounded-2xl bg-[#F5EFE6] p-5 border border-[#E6DFD5] overflow-hidden flex items-center justify-center select-none cozy-card">
      {/* Pastel Card 1 */}
      <div className="absolute top-4 left-5 bg-white rounded-xl p-3 shadow-2xs border border-[#E6DFD5] w-40 rotate-[-3deg]">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-md bg-[#F0F5F2] text-[#4A6B5D]">
            <PinIcon className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-bold text-[#2C2A29]">Tsukiji Market</span>
        </div>
        <p className="text-[11px] text-[#78726D]">Fresh sushi at 6 AM</p>
      </div>

      {/* Pastel Card 2 */}
      <div className="absolute bottom-4 right-5 bg-white rounded-xl p-3 shadow-2xs border border-[#E6DFD5] w-44 rotate-[2deg]">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-bold text-[#2C2A29]">☕ Flurys Bakery</span>
          <span className="text-[10px] bg-[#FBF0F0] text-[#C87A7A] font-bold px-2 py-0.5 rounded-full">
            Must Visit
          </span>
        </div>
        <p className="text-[11px] text-[#78726D]">Kolkata classic rum balls</p>
      </div>

      {/* Collector Stamp Icon */}
      <div className="relative z-10 h-14 w-14 rounded-2xl bg-[#4A6B5D] text-white flex items-center justify-center shadow-2xs">
        <BookmarkIcon className="h-7 w-7 stroke-[2]" />
      </div>
    </div>
  );
}

export function OrganizeIllustration() {
  return (
    <div className="relative w-full h-52 rounded-2xl bg-[#F5EFE6] p-5 border border-[#E6DFD5] overflow-hidden flex items-center justify-center select-none cozy-card">
      <div className="w-full max-w-xs space-y-2">
        <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-[#E6DFD5] shadow-2xs">
          <span className="text-xs font-bold text-[#2C2A29] flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C87A7A]" />
            Must Visit (4 places)
          </span>
          <span className="text-[10px] font-bold text-[#C87A7A] bg-[#FBF0F0] px-2 py-0.5 rounded-md">
            Priority 1
          </span>
        </div>

        <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-[#E6DFD5] shadow-2xs">
          <span className="text-xs font-bold text-[#2C2A29] flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#B89742]" />
            Want to Visit (8 places)
          </span>
          <span className="text-[10px] font-bold text-[#B89742] bg-[#FDF8EC] px-2 py-0.5 rounded-md">
            Priority 2
          </span>
        </div>

        <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-[#E6DFD5] shadow-2xs">
          <span className="text-xs font-bold text-[#2C2A29] flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#78726D]" />
            Maybe (3 places)
          </span>
          <span className="text-[10px] font-bold text-[#78726D] bg-[#F3ECE1] px-2 py-0.5 rounded-md">
            Optional
          </span>
        </div>
      </div>
    </div>
  );
}

export function PlanIllustration() {
  return (
    <div className="relative w-full h-52 rounded-2xl bg-[#F5EFE6] p-5 border border-[#E6DFD5] overflow-hidden flex items-center justify-center select-none cozy-card">
      <div className="flex items-center gap-2 bg-white px-5 py-3.5 rounded-2xl border border-[#E6DFD5] shadow-2xs">
        <div className="text-center">
          <div className="h-9 w-9 rounded-xl bg-[#2C2A29] text-white flex items-center justify-center font-bold text-[11px] mx-auto">
            START
          </div>
          <span className="text-[10px] font-bold text-[#2C2A29] mt-1 block">Tokyo</span>
        </div>

        <svg className="w-16 h-5" viewBox="0 0 60 20" fill="none">
          <path d="M0 10 H60" stroke="#4A6B5D" strokeWidth="2" strokeDasharray="5 3" />
        </svg>

        <div className="text-center">
          <div className="h-9 w-9 rounded-xl bg-[#4A6B5D] text-white flex items-center justify-center font-bold text-[11px] mx-auto">
            STOP
          </div>
          <span className="text-[10px] font-bold text-[#2C2A29] mt-1 block">Kyoto</span>
        </div>

        <svg className="w-16 h-5" viewBox="0 0 60 20" fill="none">
          <path d="M0 10 H60" stroke="#5C82A6" strokeWidth="2" strokeDasharray="5 3" />
        </svg>

        <div className="text-center">
          <div className="h-9 w-9 rounded-xl bg-[#5C82A6] text-white flex items-center justify-center font-bold text-[11px] mx-auto">
            END
          </div>
          <span className="text-[10px] font-bold text-[#2C2A29] mt-1 block">Osaka</span>
        </div>
      </div>
    </div>
  );
}

export function ShareIllustration() {
  return (
    <div className="relative w-full h-52 rounded-2xl bg-[#F5EFE6] p-5 border border-[#E6DFD5] overflow-hidden flex items-center justify-center select-none cozy-card">
      <div className="bg-white rounded-2xl p-4 border border-[#E6DFD5] max-w-xs w-full space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#2C2A29] flex items-center gap-1.5">
            <UsersIcon className="h-4 w-4 text-[#4A6B5D]" /> Collaborators
          </span>
          <span className="text-[10px] bg-[#F0F5F2] text-[#4A6B5D] font-bold px-2 py-0.5 rounded-full">
            Public List
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#2C2A29] text-white flex items-center justify-center text-[10px] font-bold">
            AR
          </div>
          <div className="h-7 w-7 rounded-lg bg-[#4A6B5D] text-white flex items-center justify-center text-[10px] font-bold">
            AM
          </div>
          <div className="h-7 w-7 rounded-lg bg-[#5C82A6] text-white flex items-center justify-center text-[10px] font-bold">
            CD
          </div>
          <div className="h-7 w-7 rounded-lg bg-[#F3ECE1] text-[#78726D] flex items-center justify-center text-[10px] font-bold">
            +3
          </div>
        </div>
        <div className="pt-1.5 border-t border-[#E6DFD5] flex items-center justify-between text-[11px] font-bold text-[#4A6B5D]">
          <span>trackilio.com/l/japan-2026</span>
          <ShareIcon className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}
