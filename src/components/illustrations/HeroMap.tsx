'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, ArrowRight, Compass } from 'lucide-react';
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
    color: '#E0533C', // Terracotta
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
    color: '#0369A1', // Dusty Blue
    badge: '10 Bistros & Wine Bars',
  },
  {
    id: 'goa',
    name: 'Kolkata & Goa',
    country: 'India',
    placesCount: 18,
    slug: 'best-hidden-cafes-in-kolkata',
    x: 68,
    y: 52,
    color: '#B45309', // Muted Amber
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
    color: '#2E7D32', // Sage Green
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
    color: '#18181B', // Ink Charcoal
    badge: '15 Rooftops',
  },
];

export function HeroMap() {
  const [activePin, setActivePin] = useState<DestinationPin>(DESTINATIONS[0]);

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-3xl bg-[#F5F1E8] p-6 sm:p-7 border border-[#E2DAC8] shadow-sm select-none">
      {/* Editorial Map Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none rounded-3xl overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(circle, #18181B 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Map Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#E2DAC8] pb-3.5 mb-5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#E0533C]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
            Interactive Travel Map
          </span>
        </div>
        <span className="text-xs text-[#71717A] font-semibold flex items-center gap-1">
          <Compass className="h-3.5 w-3.5 text-[#E0533C]" />
          Tap a destination pin
        </span>
      </div>

      {/* Map Surface */}
      <div className="relative z-10 h-64 sm:h-72 w-full rounded-2xl bg-white border border-[#E8E3D8] overflow-hidden">
        {/* SVG Route Connection Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 500 350"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized Continents */}
          <path
            d="M 70 90 Q 120 70, 150 130 T 90 190 Z"
            fill="#18181B"
            fillOpacity="0.04"
          />
          <path
            d="M 210 80 Q 260 60, 290 120 T 250 200 Z"
            fill="#18181B"
            fillOpacity="0.04"
          />
          <path
            d="M 320 100 Q 410 80, 430 170 T 350 240 Z"
            fill="#18181B"
            fillOpacity="0.04"
          />

          {/* Animated Route Line */}
          <path
            d="M 120 133 C 175 60, 210 60, 230 105 C 280 180, 370 70, 410 122"
            stroke="#E0533C"
            strokeWidth="2.5"
            className="animate-route-draw"
            strokeOpacity="0.75"
          />
        </svg>

        {/* Map Pins */}
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
              {/* Pin Icon */}
              <div
                className={`relative flex items-center justify-center h-8.5 w-8.5 rounded-xl shadow-sm transition-all duration-200 ${
                  isActive
                    ? 'scale-125 ring-3 ring-[#18181B]'
                    : 'group-hover:scale-110'
                }`}
                style={{ backgroundColor: pin.color }}
              >
                <MapPin className="h-4.5 w-4.5 text-white" />
              </div>

              {/* Pin Label */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-9 whitespace-nowrap px-2.5 py-0.5 rounded-full text-[11px] font-extrabold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#18181B] text-white z-30'
                    : 'bg-white text-[#18181B] border border-[#E8E3D8] opacity-80 group-hover:opacity-100'
                }`}
              >
                {pin.name}
              </div>
            </button>
          );
        })}

        {/* Active Pin Details Footer */}
        <div className="absolute bottom-3 left-3 right-3 z-30 bg-[#18181B] text-white rounded-2xl p-4 shadow-md transition-all duration-300">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: activePin.color }}
                />
                <span className="text-xs font-bold text-amber-300">
                  {activePin.country}
                </span>
                <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full">
                  {activePin.badge}
                </span>
              </div>
              <h4 className="font-sans text-sm font-bold text-white">
                {activePin.name} Explorer List
              </h4>
            </div>

            <Link
              href={`/discover?destination=${activePin.name}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#E0533C] hover:bg-[#C8422C] px-3 py-1.5 text-xs font-bold text-white active-press transition-colors shrink-0"
            >
              View <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
