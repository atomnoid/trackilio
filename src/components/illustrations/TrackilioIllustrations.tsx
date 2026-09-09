'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function MapIllustration({ className = 'w-full h-auto' }: { className?: string }) {
  const [activePin, setActivePin] = useState<number>(0);

  const pins = [
    { name: '☕ Blue Tokai Roastery', location: 'Kolkata, India', x: 110, y: 190, category: 'Cafe' },
    { name: '💎 Hidden Tea Pavilion', location: 'Kyoto, Japan', x: 275, y: 140, category: 'Must Visit' },
    { name: '🌿 Cliffside Sunset View', location: 'Goa, India', x: 430, y: 165, category: 'Viewpoint' },
  ];

  return (
    <div className={`relative rounded-3xl bg-[#F5E7C6] border border-[#E8DECA] p-4 sm:p-6 shadow-sm overflow-hidden select-none ${className}`}>
      {/* Subtle organic contour lines in background */}
      <svg viewBox="0 0 540 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        {/* Background land contour patches */}
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          d="M30 80C80 30 150 70 200 40C250 10 320 65 380 45C450 25 490 90 505 140C515 190 460 240 400 250C340 260 300 305 220 295C140 285 90 240 60 190C30 145 -10 125 30 80Z"
          fill="#FAF3E1"
          stroke="#E8DECA"
          strokeWidth="2"
        />
        <path
          d="M110 130C150 100 210 140 260 110C310 80 370 145 410 165C450 185 430 225 370 235C310 245 250 205 190 225C130 245 80 195 90 155C100 115 70 155 110 130Z"
          fill="#F5E7C6"
          stroke="#E8DECA"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Animated connecting dotted travel line */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          d="M 110 190 C 180 120, 220 200, 275 140 C 340 80, 380 200, 430 165"
          stroke="#FA8112"
          strokeWidth="3"
          strokeDasharray="6 6"
          strokeLinecap="round"
        />
      </svg>

      {/* Interactive Floating Location Cards & Pins */}
      <div className="absolute inset-0 p-4 sm:p-6 pointer-events-none">
        {pins.map((pin, i) => {
          const isSelected = activePin === i;
          return (
            <motion.div
              key={pin.name}
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
              style={{
                left: `${(pin.x / 540) * 100}%`,
                top: `${(pin.y / 320) * 100}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            >
              <button
                onClick={() => setActivePin(i)}
                className="group relative flex items-center gap-2 focus:outline-none cursor-pointer"
              >
                {/* Pin Core */}
                <div
                  className={`h-9 w-9 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                    isSelected
                      ? 'bg-[#222222] text-white scale-110 ring-4 ring-[#FA8112]/30'
                      : 'bg-[#FA8112] text-white group-hover:scale-105'
                  }`}
                >
                  <span className="text-xs font-black">
                    {i === 0 ? '☕' : i === 1 ? '💎' : '📍'}
                  </span>
                </div>

                {/* Floating Tag Box */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className={`px-3 py-1.5 rounded-xl border transition-all shadow-xs ${
                    isSelected
                      ? 'bg-[#222222] border-[#222222] text-white'
                      : 'bg-white border-[#E8DECA] text-[#222222] group-hover:border-[#222222]'
                  }`}
                >
                  <div className="text-[11px] font-black leading-tight truncate max-w-[140px] sm:max-w-[170px]">
                    {pin.name}
                  </div>
                  <div className={`text-[9px] font-bold ${isSelected ? 'text-[#F5E7C6]' : 'text-[#6B6862]'}`}>
                    {pin.location}
                  </div>
                </motion.div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function BlendIllustration({ className = 'w-full h-auto' }: { className?: string }) {
  return (
    <div className={`relative rounded-3xl bg-[#FAF3E1] border border-[#E8DECA] p-6 shadow-sm overflow-hidden ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Person A */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="sm:col-span-4 bg-[#F5E7C6] border-2 border-[#222222] rounded-2xl p-4 text-center space-y-2 shadow-xs"
        >
          <div className="h-12 w-12 rounded-full bg-[#222222] text-white flex items-center justify-center font-black text-xs mx-auto shadow-2xs">
            YOU
          </div>
          <div>
            <div className="text-xs font-black text-[#222222]">@your_username</div>
            <div className="text-[11px] font-bold text-[#6B6862]">18 Places Saved</div>
          </div>
        </motion.div>

        {/* Overlapping Blend Center */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: [0.95, 1, 0.95] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="sm:col-span-4 bg-[#FAF3E1] border-2 border-dashed border-[#FA8112] rounded-2xl p-4 text-center space-y-1 shadow-sm"
        >
          <div className="inline-block bg-[#FA8112] text-white text-base font-black px-4 py-1.5 rounded-xl shadow-xs">
            84% Match
          </div>
          <div className="text-[11px] font-extrabold text-[#222222] pt-1">
            9 shared spots in common
          </div>
          <p className="text-[10px] text-[#6B6862] font-medium">
            High overlap in artisan bakeries & sunset viewpoints
          </p>
        </motion.div>

        {/* Person B */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="sm:col-span-4 bg-[#F5E7C6] border-2 border-[#222222] rounded-2xl p-4 text-center space-y-2 shadow-xs"
        >
          <div className="h-12 w-12 rounded-full bg-[#222222] text-white flex items-center justify-center font-black text-xs mx-auto shadow-2xs">
            ALEX
          </div>
          <div>
            <div className="text-xs font-black text-[#222222]">@alex_wanderer</div>
            <div className="text-[11px] font-bold text-[#6B6862]">24 Places Saved</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function SaveFlowIllustration({ className = 'w-full h-auto' }: { className?: string }) {
  return (
    <div className={`rounded-3xl bg-[#FAF3E1] border border-[#E8DECA] p-6 shadow-sm ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Step 1: Spot */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-2xl border border-[#E8DECA] p-4 space-y-2.5 shadow-xs"
        >
          <div className="h-12 rounded-xl bg-[#F5E7C6] flex items-center justify-center text-xl font-black">
            ☕
          </div>
          <div>
            <div className="text-xs font-black text-[#222222]">Blue Tokai Cafe</div>
            <div className="text-[10px] text-[#6B6862]">Kolkata, India</div>
          </div>
          <span className="block text-center text-[10px] font-black uppercase text-white bg-[#FA8112] py-1 rounded-lg shadow-2xs">
            Saved to Wishlist
          </span>
        </motion.div>

        {/* Step 2: List */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-[#F5E7C6] rounded-2xl border-2 border-[#222222] p-4 space-y-2.5 shadow-xs"
        >
          <div className="flex items-center justify-between pb-1 border-b border-[#E8DECA]">
            <span className="text-xs font-black text-[#222222]">📋 Weekend in Goa</span>
            <span className="text-[9px] font-bold bg-white px-2 py-0.5 rounded-md border border-[#E8DECA]">
              Public
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="p-2 rounded-lg bg-white text-[11px] font-bold text-[#222222] shadow-2xs">
              1. Blue Tokai Cafe
            </div>
            <div className="p-2 rounded-lg bg-white/70 text-[11px] font-semibold text-[#6B6862] border border-dashed border-[#E8DECA]">
              + Add another spot
            </div>
          </div>
        </motion.div>

        {/* Step 3: Outing */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-[#222222] text-white rounded-2xl p-5 text-center space-y-2 shadow-md"
        >
          <div className="text-3xl">🚀</div>
          <div className="font-sans text-sm font-black text-[#FAF3E1]">
            Ready for your trip
          </div>
          <p className="text-[10px] text-[#F5E7C6] font-medium leading-snug">
            All spots, offline-friendly maps, and collaborator notes in one place.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export function CollabIllustration({ className = 'w-full h-auto' }: { className?: string }) {
  return (
    <div className={`rounded-3xl bg-[#F5E7C6] border border-[#E8DECA] p-6 shadow-sm space-y-4 ${className}`}>
      {/* Collaborators row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8DECA]">
        <div className="flex items-center gap-2">
          <div className="flex items-center -space-x-2">
            <div className="h-9 w-9 rounded-full bg-[#222222] text-white flex items-center justify-center font-black text-[11px] border-2 border-[#F5E7C6] shadow-2xs">
              YOU
            </div>
            <div className="h-9 w-9 rounded-full bg-[#FA8112] text-white flex items-center justify-center font-black text-[11px] border-2 border-[#F5E7C6] shadow-2xs">
              RIA
            </div>
            <div className="h-9 w-9 rounded-full bg-[#222222] text-white flex items-center justify-center font-black text-[11px] border-2 border-[#F5E7C6] shadow-2xs">
              SAM
            </div>
          </div>
          <span className="text-xs font-bold text-[#222222]">3 Co-Planners</span>
        </div>

        <span className="inline-flex items-center gap-1 bg-white border border-[#E8DECA] px-3 py-1 rounded-xl text-xs font-black text-[#222222] shadow-2xs">
          + Invite @friend
        </span>
      </div>

      {/* Shared List Note Card */}
      <div className="bg-white rounded-2xl border border-[#E8DECA] p-4 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black text-[#222222]">
            Arashiyama Bamboo Grove
          </div>
          <span className="text-[10px] font-bold text-[#FA8112] bg-[#FAF3E1] px-2 py-0.5 rounded-md">
            Must Visit
          </span>
        </div>
        <p className="text-[11px] text-[#6B6862] italic leading-relaxed">
          &ldquo;Ria: Let’s go early at 7 AM so we get the natural light before tourists arrive!&rdquo;
        </p>
      </div>
    </div>
  );
}
