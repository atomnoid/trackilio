import Link from 'next/link';

interface TrackilioLogoProps {
  className?: string;
  showText?: boolean;
}

export function TrackilioLogo({ className = '', showText = true }: TrackilioLogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Serene Pastel Gradient Marker Badge */}
      <div className="relative flex items-center justify-center h-9 w-9 rounded-2xl bg-gradient-to-br from-[#C5ADC5] to-[#B2B5E0] text-white shadow-xs group-hover:scale-105 transition-all duration-300">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4.5 h-4.5 text-white drop-shadow-xs"
        >
          {/* Stylized Route Pin */}
          <path d="M12 21.5C12 21.5 19 14.5 19 9.5C19 5.63401 15.866 2.5 12 2.5C8.13401 2.5 5 5.63401 5 9.5C5 14.5 12 21.5 12 21.5Z" />
          <circle cx="12" cy="9.5" r="2.5" fill="white" className="opacity-90" />
        </svg>
      </div>

      {showText && (
        <span className="font-sans text-xl font-black tracking-tight text-[#2A2735] group-hover:text-[#8E6D8E] transition-colors">
          Trackilio
        </span>
      )}
    </Link>
  );
}
