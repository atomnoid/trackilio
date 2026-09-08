import Link from 'next/link';

interface TrackilioLogoProps {
  className?: string;
  showText?: boolean;
}

export function TrackilioLogo({ className = '', showText = true }: TrackilioLogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Soft Eucalyptus Sage Marker Stamp */}
      <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-[#4A6B5D] text-white shadow-2xs group-hover:bg-[#3B594B] transition-colors duration-300">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4.5 h-4.5 text-white"
        >
          {/* Stylized Route Marker */}
          <path d="M12 21.5C12 21.5 19 14.5 19 9.5C19 5.63401 15.866 2.5 12 2.5C8.13401 2.5 5 5.63401 5 9.5C5 14.5 12 21.5 12 21.5Z" />
          <circle cx="12" cy="9.5" r="2.5" fill="currentColor" className="text-[#F7EBC6]" />
        </svg>
      </div>

      {showText && (
        <span className="font-sans text-xl font-black tracking-tight text-[#2C2A29] group-hover:text-[#4A6B5D] transition-colors">
          Trackilio
        </span>
      )}
    </Link>
  );
}
