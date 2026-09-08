import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublicWanderLists } from '@/services/lists';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { Search, Compass, MapPin, PlusCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Discover Travel Lists & Curated Guides | Trackilio',
  description:
    'Discover user-generated travel lists, hidden gems, cafe guides, and itineraries across Japan, France, India, and destinations worldwide on Trackilio.',
};

export const revalidate = 30;

interface DiscoverPageProps {
  searchParams: Promise<{ query?: string; destination?: string; category?: string }>;
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const resolvedParams = await searchParams;
  const lists = await getPublicWanderLists({
    query: resolvedParams.query || resolvedParams.category,
    destination: resolvedParams.destination,
    limit: 24,
  });

  const categories = [
    'All',
    'Weekend Trips',
    'Cafés',
    'Food',
    'Hidden Gems',
    'City Guides',
    'Nature',
    'Beaches',
    'Solo Travel',
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold tracking-widest uppercase text-[#4A6B5D]">
          Community Discovery
        </span>
        <h1 className="font-sans text-4xl sm:text-5xl font-black text-[#2C2A29]">
          Find your next place.
        </h1>
        <p className="text-sm sm:text-base text-[#78726D] max-w-2xl font-normal">
          Explore authentic travel lists, cafe guides, and itineraries curated by travelers.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-4">
        <form
          action="/discover"
          method="GET"
          className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E6DFD5] shadow-2xs flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-[#78726D]" />
            <input
              type="text"
              name="query"
              defaultValue={resolvedParams.query || ''}
              placeholder="Where are you thinking about going?"
              className="w-full rounded-xl border border-[#E6DFD5] bg-[#FAF6F0] pl-11 pr-4 py-3 text-xs font-medium text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#2C2A29] focus:bg-white transition-all"
            />
          </div>

          <div className="relative sm:w-64">
            <MapPin className="absolute left-4 top-3.5 h-4.5 w-4.5 text-[#4A6B5D]" />
            <input
              type="text"
              name="destination"
              defaultValue={resolvedParams.destination || ''}
              placeholder="Filter destination (e.g. Kyoto)"
              className="w-full rounded-xl border border-[#E6DFD5] bg-[#FAF6F0] pl-11 pr-4 py-3 text-xs font-medium text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#2C2A29] focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-[#4A6B5D] hover:bg-[#3B594B] text-white font-bold px-6 py-3 text-xs shadow-2xs active-press transition-colors"
          >
            Search
          </button>
        </form>

        {/* Horizontal Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => {
            const isSelected =
              (cat === 'All' && !resolvedParams.destination && !resolvedParams.query) ||
              resolvedParams.category?.toLowerCase() === cat.toLowerCase() ||
              resolvedParams.query?.toLowerCase() === cat.toLowerCase();

            const href = cat === 'All' ? '/discover' : `/discover?category=${encodeURIComponent(cat)}`;

            return (
              <Link
                key={cat}
                href={href}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-extrabold transition-all ${
                  isSelected
                    ? 'bg-[#4A6B5D] text-white'
                    : 'bg-white text-[#78726D] border border-[#E6DFD5] hover:border-[#2C2A29] hover:text-[#2C2A29]'
                }`}
              >
                {cat === 'All' ? '✨ All Discoveries' : cat}
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
        /* Empty State */
        <div className="rounded-3xl bg-white border border-[#E6DFD5] p-12 text-center space-y-4 shadow-2xs max-w-lg mx-auto">
          <div className="h-14 w-14 rounded-2xl bg-[#F3ECE1] text-[#2C2A29] flex items-center justify-center mx-auto">
            <Compass className="h-7 w-7 stroke-[2]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-sans text-xl font-bold text-[#2C2A29]">
              No adventures found here yet
            </h3>
            <p className="text-[#78726D] text-xs font-medium">
              We couldn't find any public Trackilio Lists matching your search. Be the first creator to share spots in this destination!
            </p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-xl bg-[#4A6B5D] text-white font-extrabold px-5 py-2.5 text-xs shadow-2xs hover:bg-[#3B594B] active-press transition-colors"
          >
            <PlusCircle className="h-4 w-4" /> Create the first list
          </Link>
        </div>
      )}
    </div>
  );
}
