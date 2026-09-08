import type { Metadata } from 'next';
import { Compass, BookOpen, Heart, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Trackilio',
  description: 'Learn about Trackilio, the interactive travel discovery & list platform.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 space-y-12">
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3.5 py-1 text-xs font-bold text-violet-700">
          <Sparkles className="h-3.5 w-3.5 text-violet-600" /> Collect. Plan. Explore.
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
          About Trackilio
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Trackilio was built to replace messy chat notes and generic travel listicles with beautifully interactive, collaborative, and discoverable travel lists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 space-y-3 shadow-sm card-tactile">
          <div className="h-12 w-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900">User-Generated Content</h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Every Trackilio List is created by real travelers sharing their favorite cafes, hidden spots, and bucket list itineraries.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 space-y-3 shadow-sm card-tactile">
          <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900">Public Discovery & SEO</h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Public Trackilio Lists have clean, crawlable URLs so authentic travel advice reaches people right when they search for inspiration.
          </p>
        </div>
      </div>
    </div>
  );
}
