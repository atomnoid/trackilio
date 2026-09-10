import React from 'react';

interface TrackilioBalloonLogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
  showClouds?: boolean;
  showSparks?: boolean;
}

export function TrackilioBalloonLogo({
  className = '',
  size = 40,
  animated = false,
  showClouds = true,
  showSparks = true,
}: TrackilioBalloonLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className} ${
        animated ? 'animate-balloon-wave' : ''
      }`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-sm"
      >
        <defs>
          {/* Main Balloon Gradient */}
          <radialGradient id="balloonGrad" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#FFA149" />
            <stop offset="45%" stopColor="#FA8112" />
            <stop offset="90%" stopColor="#E45300" />
            <stop offset="100%" stopColor="#BF3C00" />
          </radialGradient>

          {/* Stripe Shadows */}
          <linearGradient id="stripeShade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D84A00" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#FFA756" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#D84A00" stopOpacity="0.45" />
          </linearGradient>

          {/* Basket Gradient */}
          <linearGradient id="basketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A46B47" />
            <stop offset="50%" stopColor="#875131" />
            <stop offset="100%" stopColor="#693B20" />
          </linearGradient>

          {/* Cloud Soft Shadow */}
          <filter id="cloudShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#222222" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Ambient Sparks / Sun Rays */}
        {showSparks && (
          <g className={animated ? 'animate-ray-spark' : ''}>
            {/* Top Left Rays */}
            <path d="M 32 46 L 44 56" stroke="#FA8112" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 26 62 L 40 66" stroke="#FA8112" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 44 32 L 48 44" stroke="#FA8112" strokeWidth="4.5" strokeLinecap="round" />

            {/* Right Side Rays */}
            <path d="M 166 60 L 178 52" stroke="#FA8112" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 162 76 L 176 80" stroke="#FA8112" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 160 114 L 172 120" stroke="#FA8112" strokeWidth="4.5" strokeLinecap="round" />
          </g>
        )}

        {/* Left Cloud (Background layer) */}
        {showClouds && (
          <g className={animated ? 'animate-cloud-left' : ''} filter="url(#cloudShadow)">
            <path
              d="M 28 152 C 22 152 18 147 18 142 C 18 137 22 133 27 133 C 28 126 34 120 42 120 C 49 120 54 124 57 130 C 60 128 64 128 66 131 C 70 134 70 140 68 144 C 72 145 74 148 74 152 C 74 156 70 159 66 159 L 28 159 C 24 159 28 152 28 152 Z"
              fill="#FFFDF8"
              stroke="#E8DECA"
              strokeWidth="2.5"
            />
          </g>
        )}

        {/* Right Cloud */}
        {showClouds && (
          <g className={animated ? 'animate-cloud-right' : ''} filter="url(#cloudShadow)">
            <path
              d="M 148 150 C 143 150 140 146 140 142 C 140 137 144 134 148 134 C 149 128 155 123 162 123 C 169 123 174 127 176 132 C 179 130 183 131 185 134 C 188 137 188 142 186 145 C 190 146 192 149 192 152 C 192 156 188 158 184 158 L 148 158 Z"
              fill="#FFFDF8"
              stroke="#E8DECA"
              strokeWidth="2.5"
            />
          </g>
        )}

        {/* Main Hot Air Balloon Silhouette */}
        <g>
          {/* Main Balloon Envelope Body */}
          <path
            d="M 100 12 C 48 12 28 54 28 92 C 28 122 56 142 78 147 L 122 147 C 144 142 172 122 172 92 C 172 54 152 12 100 12 Z"
            fill="url(#balloonGrad)"
            stroke="#4A2000"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Balloon Curved Longitudinal Rib Stripes */}
          {/* Outer Left Stripe */}
          <path
            d="M 100 12 C 60 12 44 48 44 92 C 44 122 66 144 84 147 C 68 142 36 122 36 92 C 36 54 56 12 100 12 Z"
            fill="#E65100"
            opacity="0.35"
          />
          {/* Left Mid Stripe Line */}
          <path
            d="M 100 12 C 68 16 58 54 58 92 C 58 120 74 140 88 147"
            stroke="#BF3C00"
            strokeWidth="2.5"
            strokeOpacity="0.4"
            fill="none"
          />
          {/* Left Inner Stripe Line */}
          <path
            d="M 100 12 C 82 16 76 54 76 92 C 76 120 86 142 94 147"
            stroke="#BF3C00"
            strokeWidth="2.5"
            strokeOpacity="0.3"
            fill="none"
          />

          {/* Right Mid Stripe Line */}
          <path
            d="M 100 12 C 132 16 142 54 142 92 C 142 120 126 140 112 147"
            stroke="#7C2600"
            strokeWidth="2.5"
            strokeOpacity="0.4"
            fill="none"
          />
          {/* Right Inner Stripe Line */}
          <path
            d="M 100 12 C 118 16 124 54 124 92 C 124 120 114 142 106 147"
            stroke="#7C2600"
            strokeWidth="2.5"
            strokeOpacity="0.3"
            fill="none"
          />
          {/* Outer Right Stripe Shade */}
          <path
            d="M 100 12 C 140 12 156 48 156 92 C 156 122 134 144 116 147 C 132 142 164 122 164 92 C 164 54 144 12 100 12 Z"
            fill="#8E2900"
            opacity="0.35"
          />

          {/* Balloon Collar / Burner Ring */}
          <path
            d="M 74 145 C 74 141 126 141 126 145 L 122 152 C 122 154 78 154 78 152 Z"
            fill="#5E381E"
            stroke="#3B200E"
            strokeWidth="2"
          />

          {/* Ropes / Struts connecting Envelope to Basket */}
          <line x1="84" y1="150" x2="88" y2="168" stroke="#4A2612" strokeWidth="3" strokeLinecap="round" />
          <line x1="94" y1="151" x2="95" y2="168" stroke="#4A2612" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="106" y1="151" x2="105" y2="168" stroke="#4A2612" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="116" y1="150" x2="112" y2="168" stroke="#4A2612" strokeWidth="3" strokeLinecap="round" />

          {/* Woven Basket */}
          {/* Basket Body */}
          <path
            d="M 82 168 C 82 166 118 166 118 168 L 115 192 C 115 195 85 195 85 192 Z"
            fill="url(#basketGrad)"
            stroke="#3B200E"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Basket Top Rim */}
          <rect
            x="80"
            y="166"
            width="40"
            height="5"
            rx="2.5"
            fill="#693B20"
            stroke="#3B200E"
            strokeWidth="2"
          />
          {/* Basket Weave Lines */}
          <path d="M 85 176 Q 100 178 115 176" stroke="#4A2612" strokeWidth="1.8" fill="none" />
          <path d="M 86 184 Q 100 186 114 184" stroke="#4A2612" strokeWidth="1.8" fill="none" />
          <line x1="94" y1="171" x2="93" y2="192" stroke="#4A2612" strokeWidth="1.2" />
          <line x1="106" y1="171" x2="107" y2="192" stroke="#4A2612" strokeWidth="1.2" />

          {/* "Trackilio" Brand Script Graphic on the Balloon Face */}
          {/* Stylized White Script matching the brand artwork */}
          <g transform="rotate(-6 100 82)">
            {/* Background shadow for letter pop */}
            <text
              x="100"
              y="92"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="31"
              letterSpacing="-0.04em"
              fill="#852900"
              opacity="0.6"
              style={{ fontStyle: 'italic' }}
            >
              Trackilio
            </text>
            {/* Main crisp white text */}
            <text
              x="99"
              y="89"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="31"
              letterSpacing="-0.04em"
              fill="#FFFFFF"
              stroke="#FFFDF8"
              strokeWidth="1.5"
              style={{ fontStyle: 'italic' }}
            >
              Trackilio
            </text>
            {/* Dynamic swoosh underline */}
            <path
              d="M 68 96 Q 100 106 132 94"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
