import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublicWanderLists } from '@/services/lists';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { Search, Compass, MapPin, Sparkles, PlusCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Explore Trackilio Lists | Discover Places & Trips',
  description:
    'Discover user-generated travel lists, hidden gems, cafe guides, and itineraries across Japan, France, India, and worldwide on Trackilio.',
};

export const revalidate = 30;

interface ExplorePageProps {
  searchParams: Promise<{ query?: string; destination?: string }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const resolvedParams = await searchParams;
  const lists = await getPublicWanderLists({
    query: resolvedParams.query,
    destination: resolvedParams.destination,
    limit: 24,
  });

  const popularDestinations = ['All', 'Japan', 'France', 'India', 'Indonesia', 'Cafes', 'Rooftops'];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3.5 py-1 text-xs font-bold text-violet-700">
          <Sparkles className="h-3.5 w-3.5 text-violet-600" /> Public Community Discovery
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-slate-900">
          Find your next place.
        </h1>
        <p className="text-base text-slate-600 max-w-2xl font-normal">
          Browse user-curated Trackilio Lists, hidden spots, and local recommendations.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <form
          action="/explore"
          method="GET"
          className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-lg shadow-violet-500/5 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              name="query"
              defaultValue={resolvedParams.query || ''}
              placeholder="Where are you thinking about going?"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white transition-all"
            />
          </div>

          <div className="relative sm:w-64">
            <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-violet-600" />
            <input
              type="text"
              name="destination"
              defaultValue={resolvedParams.destination || ''}
              placeholder="Filter destination (e.g. Kyoto)"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            className="rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold px-7 py-3 text-sm shadow-md active-press transition-colors"
          >
            Search
          </button>
        </form>

        {/* Horizontal Quick Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {popularDestinations.map((dest) => {
            const isSelected =
              (dest === 'All' && !resolvedParams.destination && !resolvedParams.query) ||
              resolvedParams.destination?.toLowerCase() === dest.toLowerCase() ||
              resolvedParams.query?.toLowerCase() === dest.toLowerCase();

            const href = dest === 'All' ? '/explore' : `/explore?destination=${dest}`;

            return (
              <Link
                key={dest}
                href={href}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300 hover:bg-violet-50/50'
                }`}
              >
                {dest === 'All' ? '✨ All Discoveries' : dest}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Results grid */}
      {lists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lists.map((list) => (
            <WanderListCard key={list.id} list={list} />
          ))}
        </div>
      ) : (
        /* Delightful Vector Empty State */
        <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center space-y-5 shadow-sm max-w-lg mx-auto">
          <div className="h-16 w-16 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center mx-auto shadow-md">
            <Compass className="h-8 w-8 stroke-[2]" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-2xl font-extrabold text-slate-900">
              No adventures found here yet
            </h3>
            <p className="text-slate-500 text-xs font-medium">
              We couldn't find any public Trackilio Lists matching your search. Be the first creator to share spots in this destination!
            </p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 text-white font-bold px-6 py-3 text-xs shadow-lg shadow-violet-500/30 hover:bg-violet-700 active-press transition-colors"
          >
            <PlusCircle className="h-4 w-4" /> Create the first list
          </Link>
        </div>
      )}
    </div>
  );
}
