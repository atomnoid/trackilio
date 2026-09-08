import React from 'react';

interface ListCoverProps {
  title?: string;
  destination?: string;
  variant?: 'compact' | 'hero' | 'card';
  className?: string;
}

// Deterministic hash helper
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Warm Editorial Palettes (No Neon Gradients)
const WARM_PALETTES = [
  { bg: 'bg-[#F4EFE6]', accent: '#E0533C', text: '#18181B', border: '#E2DAC8', pattern: '#D5C9B3' },
  { bg: 'bg-[#EBF2EA]', accent: '#2E7D32', text: '#18181B', border: '#D0E2CF', pattern: '#BED5BC' },
  { bg: 'bg-[#EFF6FB]', accent: '#0369A1', text: '#18181B', border: '#D2E5F5', pattern: '#B8D6EF' },
  { bg: 'bg-[#FDF6E2]', accent: '#B45309', text: '#18181B', border: '#F3E5BE', pattern: '#E5D3A2' },
  { bg: 'bg-[#F9EFEF]', accent: '#991B1B', text: '#18181B', border: '#F0D5D5', pattern: '#E2BCBC' },
];

export function ListCover({
  title = 'Travel List',
  destination = '',
  variant = 'card',
  className = '',
}: ListCoverProps) {
  const seed = hashString(`${title}-${destination}`);
  const paletteIndex = seed % WARM_PALETTES.length;
  const palette = WARM_PALETTES[paletteIndex];

  const displayDest = destination || title || 'Explore';
  const initials = displayDest
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const heightClass =
    variant === 'hero' ? 'h-64 sm:h-80' : variant === 'compact' ? 'h-28' : 'h-44';

  const patternType = seed % 3;

  return (
    <div
      className={`relative w-full overflow-hidden ${palette.bg} ${heightClass} ${className} flex items-center justify-center select-none border-b border-[#E8E3D8]`}
    >
      {/* Editorial Grid / Dot Linework */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${palette.text} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* SVG Vector Drawing */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {patternType === 0 && (
          <>
            <path
              d="M-20 150 C 100 40, 200 160, 420 70"
              stroke={palette.accent}
              strokeWidth="2.5"
              strokeDasharray="6 5"
              strokeOpacity="0.7"
            />
            <g transform="translate(140, 80)">
              <circle cx="0" cy="0" r="10" fill={palette.accent} />
              <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
            </g>
            <g transform="translate(300, 110)">
              <circle cx="0" cy="0" r="12" fill={palette.text} fillOpacity="0.8" />
              <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
            </g>
          </>
        )}

        {patternType === 1 && (
          <>
            <circle cx="340" cy="50" r="40" fill={palette.pattern} fillOpacity="0.5" />
            <path
              d="M -20 140 Q 120 180, 200 130 T 420 160"
              stroke={palette.accent}
              strokeWidth="2"
            />
            <rect
              x="40"
              y="60"
              width="80"
              height="60"
              rx="8"
              fill={palette.text}
              fillOpacity="0.06"
              stroke={palette.border}
            />
          </>
        )}

        {patternType === 2 && (
          <>
            <circle
              cx="80"
              cy="100"
              r="60"
              stroke={palette.accent}
              strokeWidth="1.5"
              strokeDasharray="4 4"
              strokeOpacity="0.4"
            />
            <polygon points="80,50 88,100 80,94 72,100" fill={palette.accent} />
            <polygon points="80,150 88,100 80,106 72,100" fill={palette.text} fillOpacity="0.4" />
          </>
        )}
      </svg>

      {/* Destination Badge Initials Stamp */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
        <div className="h-13 w-13 rounded-2xl bg-white border border-[#E8E3D8] flex items-center justify-center shadow-sm">
          <span className="font-sans text-xl font-black text-[#18181B] tracking-wider">
            {initials}
          </span>
        </div>

        {destination && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/90 border border-[#E8E3D8] px-3 py-1 text-xs font-bold text-[#18181B] shadow-2xs">
            📍 {destination}
          </span>
        )}
      </div>
    </div>
  );
}
