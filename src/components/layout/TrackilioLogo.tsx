import Link from 'next/link';
import { TrackilioBalloonLogo } from '@/components/brand/TrackilioBalloonLogo';

interface TrackilioLogoProps {
  className?: string;
  showText?: boolean;
  size?: number;
}

export function TrackilioLogo({ className = '', showText = true, size = 38 }: TrackilioLogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Handcrafted Hot Air Balloon Icon */}
      <div className="relative flex items-center justify-center group-hover:scale-105 group-hover:-translate-y-0.5 transition-transform duration-200">
        <TrackilioBalloonLogo size={size} animated={false} showClouds={false} showSparks={false} />
      </div>

      {showText && (
        <span className="font-sans text-xl font-black tracking-tight text-[#222222] group-hover:text-[#FA8112] transition-colors">
          Trackilio
        </span>
      )}
    </Link>
  );
}
