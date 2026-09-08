import { Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center space-y-6">
      <div className="h-20 w-20 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center mx-auto shadow-lg shadow-violet-500/20">
        <Compass className="h-10 w-10 stroke-[2] animate-spin-slow" />
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-black text-slate-900">
          This destination seems to have wandered off.
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          The Trackilio List you are looking for does not exist or may be set to private.
        </p>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
        <Link
          href="/explore"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 text-white font-extrabold px-7 py-3 text-sm shadow-lg shadow-violet-500/30 hover:bg-violet-700 active-press transition-colors"
        >
          Explore Public Lists <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
