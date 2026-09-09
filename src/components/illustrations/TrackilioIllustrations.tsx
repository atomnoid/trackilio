import React from 'react';

export function MapIllustration({ className = 'w-full h-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 540 360" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background paper texture feel */}
      <rect width="540" height="360" rx="24" fill="#F5E7C6" stroke="#E8DECA" strokeWidth="2" />
      
      {/* Topographic organic land shapes */}
      <path d="M40 90C90 40 160 80 210 50C260 20 320 80 390 60C460 40 500 110 510 160C520 210 460 260 400 270C340 280 300 330 220 320C140 310 90 260 60 210C30 160 -10 140 40 90Z" fill="#FAF3E1" stroke="#E8DECA" strokeWidth="2" />
      <path d="M120 140C160 110 220 150 270 120C320 90 380 160 420 180C460 200 440 240 380 250C320 260 260 220 200 240C140 260 90 210 100 170C110 130 80 170 120 140Z" fill="#F5E7C6" stroke="#E8DECA" strokeWidth="1.5" strokeDasharray="4 4" />
      
      {/* Connecting travel route */}
      <path d="M110 200C160 140 220 220 310 150C370 100 420 170 450 130" stroke="#FA8112" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />
      
      {/* City Pin 1 - Kolkata */}
      <g transform="translate(110, 200)">
        <circle r="16" fill="#222222" />
        <circle r="6" fill="#FA8112" />
        <rect x="22" y="-14" width="90" height="28" rx="8" fill="#FFFFFF" stroke="#E8DECA" />
        <text x="32" y="4" fill="#222222" fontSize="11" fontWeight="800" fontFamily="sans-serif">☕ Cafés in Town</text>
      </g>
      
      {/* City Pin 2 - Hidden Gem */}
      <g transform="translate(310, 150)">
        <circle r="16" fill="#FA8112" />
        <circle r="6" fill="#FFFFFF" />
        <rect x="22" y="-14" width="85" height="28" rx="8" fill="#FFFFFF" stroke="#E8DECA" />
        <text x="32" y="4" fill="#222222" fontSize="11" fontWeight="800" fontFamily="sans-serif">💎 Secret Spot</text>
      </g>

      {/* City Pin 3 - Destination */}
      <g transform="translate(450, 130)">
        <circle r="16" fill="#222222" />
        <circle r="6" fill="#FA8112" />
        <rect x="-105" y="-14" width="95" height="28" rx="8" fill="#FFFFFF" stroke="#E8DECA" />
        <text x="-95" y="4" fill="#222222" fontSize="11" fontWeight="800" fontFamily="sans-serif">🌿 Weekend Trip</text>
      </g>
    </svg>
  );
}

export function BlendIllustration({ className = 'w-full h-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="460" height="260" rx="20" fill="#FAF3E1" stroke="#E8DECA" strokeWidth="2" />
      
      {/* Person A Circle */}
      <g transform="translate(130, 130)">
        <circle r="65" fill="#F5E7C6" stroke="#222222" strokeWidth="2" />
        <circle r="22" fill="#222222" />
        <text x="0" y="5" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800" fontFamily="sans-serif">YOU</text>
        <text x="0" y="42" textAnchor="middle" fill="#222222" fontSize="11" fontWeight="700" fontFamily="sans-serif">18 Places</text>
      </g>
      
      {/* Overlapping Blend Center */}
      <g transform="translate(230, 130)">
        <ellipse rx="38" ry="50" fill="#FA8112" fillOpacity="0.15" stroke="#FA8112" strokeWidth="2" strokeDasharray="4 4" />
        <rect x="-35" y="-16" width="70" height="32" rx="10" fill="#FA8112" />
        <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif">84%</text>
      </g>

      {/* Person B Circle */}
      <g transform="translate(330, 130)">
        <circle r="65" fill="#F5E7C6" stroke="#222222" strokeWidth="2" />
        <circle r="22" fill="#222222" />
        <text x="0" y="5" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800" fontFamily="sans-serif">ALEX</text>
        <text x="0" y="42" textAnchor="middle" fill="#222222" fontSize="11" fontWeight="700" fontFamily="sans-serif">24 Places</text>
      </g>

      <text x="230" y="225" textAnchor="middle" fill="#6B6862" fontSize="11" fontWeight="600" fontFamily="sans-serif">9 shared spots in common</text>
    </svg>
  );
}

export function SaveFlowIllustration({ className = 'w-full h-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 460 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="460" height="220" rx="20" fill="#FAF3E1" stroke="#E8DECA" strokeWidth="2" />
      
      {/* Card 1: Spot */}
      <g transform="translate(30, 50)">
        <rect width="110" height="120" rx="14" fill="#FFFFFF" stroke="#E8DECA" strokeWidth="1.5" />
        <rect x="12" y="14" width="86" height="42" rx="8" fill="#F5E7C6" />
        <text x="14" y="74" fill="#222222" fontSize="10" fontWeight="800" fontFamily="sans-serif">Blue Tokai Cafe</text>
        <text x="14" y="88" fill="#6B6862" fontSize="8" fontFamily="sans-serif">Kolkata</text>
        <rect x="12" y="98" width="86" height="12" rx="4" fill="#FA8112" />
        <text x="55" y="107" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="800" fontFamily="sans-serif">SAVED</text>
      </g>

      {/* Arrow 1 */}
      <path d="M150 110 H180" stroke="#FA8112" strokeWidth="2" strokeDasharray="3 3" />
      
      {/* Card 2: List */}
      <g transform="translate(190, 40)">
        <rect width="120" height="140" rx="14" fill="#F5E7C6" stroke="#222222" strokeWidth="2" />
        <rect x="12" y="16" width="96" height="18" rx="6" fill="#FFFFFF" />
        <text x="20" y="29" fill="#222222" fontSize="9" fontWeight="800" fontFamily="sans-serif">📋 Weekend in Goa</text>
        <rect x="12" y="42" width="96" height="24" rx="6" fill="#FFFFFF" />
        <text x="20" y="57" fill="#222222" fontSize="8" fontWeight="700" fontFamily="sans-serif">1. Blue Tokai Cafe</text>
        <rect x="12" y="72" width="96" height="24" rx="6" fill="#FFFFFF" opacity="0.8" />
        <text x="20" y="87" fill="#6B6862" fontSize="8" fontFamily="sans-serif">+ Add another spot</text>
      </g>

      {/* Arrow 2 */}
      <path d="M320 110 H350" stroke="#FA8112" strokeWidth="2" strokeDasharray="3 3" />

      {/* Card 3: Outing */}
      <g transform="translate(360, 50)">
        <rect width="70" height="120" rx="14" fill="#222222" />
        <text x="35" y="55" textAnchor="middle" fill="#FFFFFF" fontSize="16">🚀</text>
        <text x="35" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="sans-serif">Ready</text>
        <text x="35" y="95" textAnchor="middle" fill="#F5E7C6" fontSize="9" fontFamily="sans-serif">to go out</text>
      </g>
    </svg>
  );
}

export function CollabIllustration({ className = 'w-full h-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 460 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="460" height="220" rx="20" fill="#F5E7C6" stroke="#E8DECA" strokeWidth="2" />
      
      {/* Collaborators row */}
      <g transform="translate(40, 45)">
        <circle cx="20" cy="20" r="20" fill="#222222" />
        <text x="20" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800" fontFamily="sans-serif">YOU</text>
        
        <circle cx="75" cy="20" r="20" fill="#FA8112" />
        <text x="75" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800" fontFamily="sans-serif">RIA</text>
        
        <circle cx="130" cy="20" r="20" fill="#222222" />
        <text x="130" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800" fontFamily="sans-serif">SAM</text>

        <rect x="165" y="5" width="80" height="30" rx="15" fill="#FFFFFF" stroke="#E8DECA" />
        <text x="205" y="24" textAnchor="middle" fill="#222222" fontSize="10" fontWeight="800" fontFamily="sans-serif">+ Invite</text>
      </g>

      {/* Shared List Note Card */}
      <g transform="translate(40, 105)">
        <rect width="380" height="85" rx="14" fill="#FFFFFF" stroke="#222222" strokeWidth="1.5" />
        <text x="20" y="32" fill="#222222" fontSize="13" fontWeight="900" fontFamily="sans-serif">Japan 2027 Itinerary</text>
        <text x="20" y="54" fill="#6B6862" fontSize="11" fontFamily="sans-serif">3 editors • 14 places saved • Real-time sync</text>
        
        <rect x="290" y="20" width="70" height="28" rx="8" fill="#F5E7C6" />
        <text x="325" y="38" textAnchor="middle" fill="#222222" fontSize="10" fontWeight="800" fontFamily="sans-serif">Shared</text>
      </g>
    </svg>
  );
}
