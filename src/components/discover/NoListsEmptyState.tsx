import Link from 'next/link';
import { TrackilioBalloonLogo } from '@/components/brand/TrackilioBalloonLogo';

/**
 * Compact server-side empty state for discover/lists.
 * Same style as NoPlacesEmptyState — balloon + punchy copy + inline CTAs.
 */
export function NoListsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 px-4 text-center">

      {/* Same animated balloon used across loading screens */}
      <TrackilioBalloonLogo size={80} animated showClouds showSparks />

      {/* Copy */}
      <div className="space-y-1 max-w-xs">
        <p className="font-sans text-lg font-black text-[#222222]">
          No guides here yet! 🗺️
        </p>
        <p className="text-sm text-[#6B6862] leading-relaxed">
          Looks like no one&apos;s mapped this out.{' '}
          <span className="font-bold text-[#222222]">Why not be the first?</span>
        </p>
      </div>

      {/* CTAs — inline, no scrolling */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <Link
          href="/create"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#FA8112] hover:bg-[#e0720e] active:scale-95 text-white font-black px-5 py-2.5 text-xs shadow-md shadow-orange-200 transition-all"
        >
          ✍️ Create a list
        </Link>
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#E8DECA] hover:border-[#222222] active:scale-95 text-[#222222] font-bold px-4 py-2.5 text-xs transition-all"
        >
          🔭 Explore all
        </Link>
      </div>

    </div>
  );
}
