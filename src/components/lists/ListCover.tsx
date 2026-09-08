import React from 'react';

interface ListCoverProps {
  title?: string;
  destination?: string;
  variant?: 'compact' | 'hero' | 'card';
  className?: string;
}

// Deterministic hashing helper
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Color palettes for vector list covers
const COVER_PALETTES = [
  { bg: 'from-violet-600 via-purple-600 to-indigo-700', accent1: '#FACC15', accent2: '#F43F5E', shape: '#8B5CF6' },
  { bg: 'from-blue-600 via-indigo-600 to-purple-600', accent1: '#10B981', accent2: '#F59E0B', shape: '#3B82F6' },
  { bg: 'from-rose-500 via-pink-600 to-purple-700', accent1: '#FACC15', accent2: '#38BDF8', shape: '#EC4899' },
  { bg: 'from-emerald-600 via-teal-600 to-cyan-700', accent1: '#F59E0B', accent2: '#A855F7', shape: '#14B8A6' },
  { bg: 'from-amber-500 via-orange-600 to-rose-600', accent1: '#38BDF8', accent2: '#10B981', accent2Hex: '#10B981', shape: '#F97316' },
];

export function ListCover({
  title = 'Travel List',
  destination = '',
  variant = 'card',
  className = '',
}: ListCoverProps) {
  const seed = hashString(`${title}-${destination}`);
  const paletteIndex = seed % COVER_PALETTES.length;
  const palette = COVER_PALETTES[paletteIndex];

  // Derived display details
  const displayDest = destination || title || 'Explore';
  const initials = displayDest
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Pattern variants
  const patternType = seed % 3; // 0: Route Map, 1: Geometric Sunset, 2: Compass & Pins

  const heightClass =
    variant === 'hero' ? 'h-64 sm:h-80' : variant === 'compact' ? 'h-28' : 'h-44';

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-br ${palette.bg} ${heightClass} ${className} flex items-center justify-center select-none`}
    >
      {/* Background Grid Accent */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(circle, #FFFFFF 1.5px, transparent 1.5px)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* SVG Decorative Composition */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Pattern 0: Animated/Static Route Path */}
        {patternType === 0 && (
          <>
            <path
              d="M-20 160 Q 100 40, 200 120 T 420 60"
              stroke="white"
              strokeWidth="4"
              strokeDasharray="8 6"
              strokeOpacity="0.4"
            />
            {/* Location Pin 1 */}
            <g transform="translate(100, 60)">
              <circle cx="0" cy="0" r="14" fill={palette.accent1} fillOpacity="0.9" />
              <circle cx="0" cy="0" r="6" fill="#ffffff" />
            </g>
            {/* Location Pin 2 */}
            <g transform="translate(280, 110)">
              <circle cx="0" cy="0" r="18" fill={palette.accent2} fillOpacity="0.9" />
              <circle cx="0" cy="0" r="7" fill="#ffffff" />
            </g>
          </>
        )}

        {/* Pattern 1: Sun & Topographic Wave Curves */}
        {patternType === 1 && (
          <>
            <circle cx="320" cy="50" r="45" fill={palette.accent1} fillOpacity="0.8" />
            <path
              d="M-50 180 C 80 120, 160 210, 450 130 L 450 220 L -50 220 Z"
              fill="white"
              fillOpacity="0.12"
            />
            <path
              d="M-50 150 C 120 200, 260 100, 450 170"
              stroke={palette.accent2}
              strokeWidth="3"
              strokeOpacity="0.6"
            />
          </>
        )}

        {/* Pattern 2: Abstract Compass & Floating Cards */}
        {patternType === 2 && (
          <>
            <circle
              cx="80"
              cy="140"
              r="70"
              stroke="white"
              strokeWidth="2"
              strokeOpacity="0.25"
              strokeDasharray="4 4"
            />
            <polygon points="80,95 90,140 80,135 70,140" fill={palette.accent1} />
            <polygon points="80,185 90,140 80,145 70,140" fill="white" fillOpacity="0.7" />
            <rect
              x="240"
              y="30"
              width="120"
              height="80"
              rx="12"
              fill="white"
              fillOpacity="0.15"
              transform="rotate(6 300 70)"
            />
          </>
        )}
      </svg>

      {/* Foreground Badge + Destination Initials */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
        <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          <span className="font-display text-2xl font-black text-white tracking-widest">
            {initials}
          </span>
        </div>

        {destination && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-slate-900 shadow-md">
            📍 {destination}
          </span>
        )}
      </div>

      {/* Decorative Subtle Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
    </div>
  );
}
