import { Compass, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center space-y-6">
      <Compass className="mx-auto h-16 w-16 text-stone-300" />
      <div className="space-y-2">
        <h1 className="font-editorial text-4xl font-bold text-stone-900">
          WanderList Not Found
        </h1>
        <p className="text-sm text-stone-600">
          The travel list you are looking for does not exist or may be set to private.
        </p>
      </div>

      <div className="pt-4 flex justify-center gap-4">
        <Link
          href="/explore"
          className="rounded-xl bg-stone-900 text-white font-semibold px-6 py-2.5 text-sm hover:bg-stone-800 transition-colors"
        >
          Explore Public Lists
        </Link>
      </div>
    </div>
  );
}
