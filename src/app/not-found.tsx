import { Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center space-y-5">
      <div className="h-16 w-16 rounded-2xl bg-[#F3EFE6] text-[#18181B] flex items-center justify-center mx-auto shadow-2xs">
        <Compass className="h-8 w-8 stroke-[2]" />
      </div>
      <div className="space-y-1.5">
        <h1 className="font-sans text-2xl font-black text-[#18181B]">
          This destination seems to have wandered off.
        </h1>
        <p className="text-xs text-[#71717A] font-medium">
          The Trackilio List you are looking for does not exist or may be set to private.
        </p>
      </div>

      <div className="pt-2 flex justify-center">
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 rounded-xl bg-[#18181B] hover:bg-[#C8422C] text-white font-bold px-6 py-3 text-xs shadow-2xs active-press transition-colors"
        >
          Discover Public Lists <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
