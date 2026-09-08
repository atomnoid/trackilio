'use client';

import React from 'react';
import { Bookmark, Compass, Heart, MapPin, Share2, Sparkles, Star, Users } from 'lucide-react';

export function CollectIllustration() {
  return (
    <div className="relative w-full h-56 rounded-3xl bg-gradient-to-tr from-violet-100 via-purple-50 to-blue-50 p-6 border border-violet-200/60 overflow-hidden flex items-center justify-center select-none card-tactile">
      {/* Floating Card 1 */}
      <div className="absolute top-4 left-6 bg-white rounded-2xl p-3.5 shadow-lg border border-slate-100 w-44 rotate-[-4deg] animate-float">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1.5 rounded-lg bg-violet-100 text-violet-700">
            <MapPin className="h-4 w-4" />
          </span>
          <span className="text-xs font-bold text-slate-800">Tsukiji Market</span>
        </div>
        <p className="text-[11px] text-slate-500">Fresh sushi at 6 AM</p>
      </div>

      {/* Floating Card 2 */}
      <div className="absolute bottom-5 right-6 bg-white rounded-2xl p-3.5 shadow-lg border border-slate-100 w-48 rotate-[3deg] animate-float-reverse">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-xs font-bold text-slate-800">☕ Flurys Bakery</span>
          <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
            Must Visit
          </span>
        </div>
        <p className="text-[11px] text-slate-500">Kolkata classic rum balls</p>
      </div>

      {/* Centerpiece Collector Pin */}
      <div className="relative z-10 h-16 w-16 rounded-full bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center shadow-xl shadow-violet-500/30">
        <Bookmark className="h-8 w-8 stroke-[2.2]" />
      </div>
    </div>
  );
}

export function OrganizeIllustration() {
  return (
    <div className="relative w-full h-56 rounded-3xl bg-gradient-to-tr from-blue-100 via-indigo-50 to-purple-50 p-6 border border-blue-200/60 overflow-hidden flex items-center justify-center select-none card-tactile">
      <div className="w-full max-w-xs space-y-2.5">
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-emerald-200">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            Must Visit (4 places)
          </span>
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            Priority 1
          </span>
        </div>

        <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-amber-200">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            Want to Visit (8 places)
          </span>
          <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
            Priority 2
          </span>
        </div>

        <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-slate-200">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-slate-400" />
            Maybe (3 places)
          </span>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            Optional
          </span>
        </div>
      </div>
    </div>
  );
}

export function PlanIllustration() {
  return (
    <div className="relative w-full h-56 rounded-3xl bg-gradient-to-tr from-pink-100 via-rose-50 to-amber-50 p-6 border border-pink-200/60 overflow-hidden flex items-center justify-center select-none card-tactile">
      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-md border border-pink-200/80">
        <div className="text-center">
          <div className="h-10 w-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xs mx-auto shadow-sm">
            START
          </div>
          <span className="text-[11px] font-bold text-slate-800 mt-1 block">Tokyo</span>
        </div>

        <svg className="w-20 h-6" viewBox="0 0 80 24" fill="none">
          <path d="M0 12 H80" stroke="#EC4899" strokeWidth="3" strokeDasharray="6 4" />
        </svg>

        <div className="text-center">
          <div className="h-10 w-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs mx-auto shadow-sm">
            STOP
          </div>
          <span className="text-[11px] font-bold text-slate-800 mt-1 block">Kyoto</span>
        </div>

        <svg className="w-20 h-6" viewBox="0 0 80 24" fill="none">
          <path d="M0 12 H80" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 4" />
        </svg>

        <div className="text-center">
          <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs mx-auto shadow-sm">
            END
          </div>
          <span className="text-[11px] font-bold text-slate-800 mt-1 block">Osaka</span>
        </div>
      </div>
    </div>
  );
}

export function ShareIllustration() {
  return (
    <div className="relative w-full h-56 rounded-3xl bg-gradient-to-tr from-emerald-100 via-teal-50 to-cyan-50 p-6 border border-emerald-200/60 overflow-hidden flex items-center justify-center select-none card-tactile">
      <div className="bg-white rounded-2xl p-4 shadow-xl border border-teal-100 max-w-xs w-full space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Users className="h-4 w-4 text-emerald-600" /> Collaborators
          </span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            Public List
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold">
            AR
          </div>
          <div className="h-8 w-8 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold">
            AM
          </div>
          <div className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
            CD
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
            +3
          </div>
        </div>
        <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
          <span>trackilio.com/l/japan-2026</span>
          <Share2 className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}
