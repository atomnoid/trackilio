import type { Metadata } from 'next';
import { getPublicWanderLists } from '@/services/lists';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { Search, Compass, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Explore Travel Lists & Curated Destinations',
  description:
    'Discover user-generated travel lists for Japan, Bali, Paris, India, and destinations worldwide.',
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
          <Compass className="h-3.5 w-3.5 text-amber-700" /> Public Discovery
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-stone-900">
          Explore Travel WanderLists
        </h1>
        <p className="text-base text-stone-600 max-w-2xl">
          Browse authentic travel bucket lists, cafe guides, and hidden itineraries created by travelers.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <form action="/explore" method="GET" className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
          <input
            type="text"
            name="query"
            defaultValue={resolvedParams.query || ''}
            placeholder="Search lists by title or description (e.g. Cafes, Hidden Gems)..."
            className="w-full rounded-xl border border-stone-200 pl-10 pr-4 py-2 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="relative sm:w-64">
          <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-amber-700" />
          <input
            type="text"
            name="destination"
            defaultValue={resolvedParams.destination || ''}
            placeholder="Filter destination (e.g. Kyoto)"
            className="w-full rounded-xl border border-stone-200 pl-10 pr-4 py-2 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-stone-900 text-white font-medium px-6 py-2 text-sm hover:bg-stone-800 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Results grid */}
      {lists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lists.map((list) => (
            <WanderListCard key={list.id} list={list} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-stone-200 p-12 text-center space-y-4">
          <Compass className="mx-auto h-12 w-12 text-stone-300" />
          <h3 className="font-editorial text-2xl font-bold text-stone-900">
            No WanderLists found
          </h3>
          <p className="text-stone-600 text-sm max-w-md mx-auto">
            We couldn't find any public lists matching your search. Be the first to create one!
          </p>
        </div>
      )}
    </div>
  );
}
