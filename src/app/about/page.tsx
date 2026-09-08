import type { Metadata } from 'next';
import { Compass, BookOpen, Heart, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About MyWanderLists',
  description: 'Learn about our travel discovery platform and user-generated WanderLists.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 space-y-12">
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-semibold text-amber-900">
          <Compass className="h-3.5 w-3.5 text-amber-700" /> Modern Travel Editorial
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-stone-900">
          About MyWanderLists
        </h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          MyWanderLists was built to replace messy notes and generic top-10 lists with beautifully curated, collaborative, and discoverable travel guides.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3 shadow-sm">
          <BookOpen className="h-6 w-6 text-terracotta" />
          <h3 className="font-editorial text-xl font-bold text-stone-900">User-Generated Content</h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            Every WanderList is created by real travelers sharing their favorite cafes, hidden spots, and bucket list itineraries.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3 shadow-sm">
          <Heart className="h-6 w-6 text-emerald-700" />
          <h3 className="font-editorial text-xl font-bold text-stone-900">Public Discovery & SEO</h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            Public WanderLists have optimized, crawlable URLs so authentic travel advice reaches people right when they search for inspiration.
          </p>
        </div>
      </div>
    </div>
  );
}
