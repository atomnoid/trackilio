'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Sparkles, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface DestinationPin {
  id: string;
  name: string;
  country: string;
  placesCount: number;
  slug: string;
  x: number; // Percentage
  y: number; // Percentage
  color: string;
  badge: string;
}

const DESTINATIONS: DestinationPin[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    placesCount: 14,
    slug: '7-days-in-kyoto-cafes-bamboo-groves',
    x: 82,
    y: 35,
    color: '#8B5CF6', // Violet
    badge: '14 Cafes & Temples',
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    placesCount: 10,
    slug: 'paris-food-bucket-list-pastries-bistro-wine',
    x: 46,
    y: 30,
    color: '#F43F5E', // Rose
    badge: '10 Bistros & Wine Bars',
  },
  {
    id: 'goa',
    name: 'Goa & Kolkata',
    country: 'India',
    placesCount: 18,
    slug: 'best-hidden-cafes-in-kolkata',
    x: 68,
    y: 52,
    color: '#F59E0B', // Amber
    badge: '18 Hidden Spots',
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    placesCount: 12,
    slug: 'bali-waterfalls-and-sunset-spots',
    x: 78,
    y: 68,
    color: '#10B981', // Emerald
    badge: '12 Waterfalls',
  },
  {
    id: 'nyc',
    name: 'New York',
    country: 'USA',
    placesCount: 15,
    slug: 'nyc-speakeasies-and-rooftops',
    x: 24,
    y: 38,
    color: '#3B82F6', // Electric Blue
    badge: '15 Rooftops',
  },
];

export function HeroMap() {
  const [activePin, setActivePin] = useState<DestinationPin>(DESTINATIONS[0]);

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-3xl bg-gradient-to-br from-violet-900 via-indigo-950 to-slate-950 p-6 sm:p-8 shadow-2xl border border-violet-500/30 overflow-hidden select-none">
      {/* Abstract Map Background Grid & Dots */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #8B5CF6 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Decorative Glow Orbs */}
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-violet-600/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-blue-600/30 blur-3xl pointer-events-none" />

      {/* SVG Map Lines & Routes */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 500 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Continents Outline Stylized Shapes */}
        <path
          d="M 80 100 Q 130 80, 160 140 T 100 200 Z"
          fill="white"
          fillOpacity="0.04"
        />
        <path
          d="M 220 90 Q 270 70, 300 130 T 260 210 Z"
          fill="white"
          fillOpacity="0.04"
        />
        <path
          d="M 330 110 Q 420 90, 440 180 T 360 250 Z"
          fill="white"
          fillOpacity="0.04"
        />

        {/* Animated Flight / Travel Route Line connecting NYC -> Paris -> Tokyo */}
        <path
          d="M 120 133 C 175 60, 210 60, 230 105 C 280 180, 370 70, 410 122"
          stroke="#A855F7"
          strokeWidth="3"
          className="animate-dash-route"
          strokeOpacity="0.8"
        />
      </svg>

      {/* Header Info inside Map Card */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
            Interactive World Map
          </span>
        </div>
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          Tap any pin
        </span>
      </div>

      {/* Map Surface Container */}
      <div className="relative z-10 h-64 sm:h-72 w-full rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        {/* Render Floating Pins */}
        {DESTINATIONS.map((pin) => {
          const isActive = activePin.id === pin.id;
          return (
            <button
              key={pin.id}
              onClick={() => setActivePin(pin)}
              onMouseEnter={() => setActivePin(pin)}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20"
            >
              {/* Pulsing Aura */}
              <span
                className={`absolute -inset-2 rounded-full opacity-60 transition-transform duration-300 ${
                  isActive ? 'scale-150 animate-ping' : 'group-hover:scale-125'
                }`}
                style={{ backgroundColor: pin.color }}
              />

              {/* Pin Icon Surface */}
              <div
                className={`relative flex items-center justify-center h-9 w-9 rounded-2xl shadow-lg transition-all duration-300 ${
                  isActive ? 'scale-125 ring-4 ring-white/50' : 'group-hover:scale-110'
                }`}
                style={{ backgroundColor: pin.color }}
              >
                <MapPin className="h-5 w-5 text-white" />
              </div>

              {/* Pin Tag Label */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-10 whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-slate-900 scale-105 z-30'
                    : 'bg-slate-900/80 text-white opacity-80 group-hover:opacity-100'
                }`}
              >
                {pin.name}
              </div>
            </button>
          );
        })}

        {/* Selected Pin Active Card Preview */}
        <div className="absolute bottom-3 left-3 right-3 z-30 bg-slate-900/90 backdrop-blur-md border border-violet-400/40 rounded-2xl p-4 text-white shadow-xl transition-all duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: activePin.color }}
                />
                <span className="text-xs font-semibold text-violet-300">
                  {activePin.country}
                </span>
                <span className="text-[10px] bg-violet-500/20 text-violet-200 px-2 py-0.5 rounded-full border border-violet-400/30">
                  {activePin.badge}
                </span>
              </div>
              <h4 className="font-display text-base font-bold text-white">
                {activePin.name} Explorer List
              </h4>
            </div>

            <Link
              href={`/explore?destination=${activePin.name}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 px-3.5 py-2 text-xs font-bold text-white shadow-md active-press transition-colors shrink-0"
            >
              Explore <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
