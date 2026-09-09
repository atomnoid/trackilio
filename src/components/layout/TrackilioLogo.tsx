import Link from 'next/link';

interface TrackilioLogoProps {
  className?: string;
  showText?: boolean;
}

export function TrackilioLogo({ className = '', showText = true }: TrackilioLogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Warm Orange Badge with Pin mark */}
      <div className="relative flex items-center justify-center h-8 w-8 rounded-xl bg-[#FA8112] text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-white"
        >
          <path d="M12 21.5C12 21.5 19 14.5 19 9.5C19 5.63401 15.866 2.5 12 2.5C8.13401 2.5 5 5.63401 5 9.5C5 14.5 12 21.5 12 21.5Z" />
          <circle cx="12" cy="9.5" r="2.5" fill="white" />
        </svg>
      </div>

      {showText && (
        <span className="font-sans text-lg font-black tracking-tight text-[#222222] group-hover:text-[#FA8112] transition-colors">
          Trackilio
        </span>
      )}
    </Link>
  );
}
