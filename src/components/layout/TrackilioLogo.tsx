import Link from 'next/link';

interface TrackilioLogoProps {
  className?: string;
  showText?: boolean;
}

export function TrackilioLogo({ className = '', showText = true }: TrackilioLogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Playful Pin + Route Icon */}
      <div className="relative flex items-center justify-center h-10 w-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-blue-500 shadow-md shadow-violet-500/25 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white"
        >
          {/* Map Pin */}
          <path d="M12 21.5C12 21.5 19 14.5 19 9.5C19 5.63401 15.866 2.5 12 2.5C8.13401 2.5 5 5.63401 5 9.5C5 14.5 12 21.5 12 21.5Z" />
          {/* Inner Route Dot */}
          <circle cx="12" cy="9.5" r="2.5" className="fill-white/30 stroke-white" />
          {/* Animated Route Accent */}
          <path d="M16 4.5L19 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* Small Yellow Accent Sparkle Dot */}
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-400 border-2 border-white animate-pulse-glow" />
      </div>

      {showText && (
        <span className="font-display text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-violet-600 transition-colors">
          TRACKILIO
        </span>
      )}
    </Link>
  );
}
