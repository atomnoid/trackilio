import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublicWanderLists } from '@/services/lists';
import { getPublicPlaces } from '@/services/places';
import { createClient } from '@/lib/supabase/server';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { PlaceDiscoveryCard } from '@/components/places/PlaceDiscoveryCard';
import { Search, Compass, MapPin, PlusCircle, Map, Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Discover Places, Cafés, Hidden Gems & Curated Guides | Trackilio',
  description:
    'Discover great places, cafes, restaurants, hidden gems, and curated itineraries across Kolkata, Goa, Tokyo, Paris, and worldwide on Trackilio.',
};

export const revalidate = 30;

interface DiscoverPageProps {
  searchParams: Promise<{
    tab?: 'places' | 'lists';
    query?: string;
    city?: string;
    destination?: string;
    category?: string;
    sort?: 'recent' | 'trending' | 'popular' | 'rated';
  }>;
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const resolvedParams = await searchParams;
  const currentTab = resolvedParams.tab || 'places';
  const currentSort = resolvedParams.sort || 'trending';
  const cityQuery = resolvedParams.city || resolvedParams.destination || '';

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [places, lists] = await Promise.all([
    getPublicPlaces({
      query: resolvedParams.query,
      city: cityQuery,
      category: resolvedParams.category,
      sort: (currentSort === 'rated' ? 'rated' : currentSort === 'popular' ? 'popular' : currentSort === 'recent' ? 'recent' : 'trending'),
      limit: 30,
      currentUserId: user?.id,
    }),
    getPublicWanderLists({
      query: resolvedParams.query || resolvedParams.category,
      destination: cityQuery,
      sort: (currentSort === 'popular' ? 'popular' : currentSort === 'trending' ? 'trending' : 'recent'),
      limit: 24,
    }),
  ]);

  const categories = [
    { label: 'All', emoji: '✨' },
    { label: 'Cafés', emoji: '☕' },
    { label: 'Restaurants', emoji: '🍽️' },
    { label: 'Hidden Gems', emoji: '💎' },
    { label: 'Date Spots', emoji: '❤️' },
    { label: 'Sightseeing', emoji: '🏛️' },
    { label: 'Nature', emoji: '🌿' },
    { label: 'Bars & Nightlife', emoji: '🍸' },
    { label: 'Shopping', emoji: '🛍️' },
    { label: 'Weekend Trips', emoji: '🚗' },
  ];

  const popularCities = ['Kolkata', 'Goa', 'Tokyo', 'Paris', 'Kyoto', 'London', 'Mumbai', 'New York'];

  const buildUrl = (updates: {
    tab?: string;
    category?: string;
    sort?: string;
    city?: string;
    query?: string;
  }) => {
    const p = new URLSearchParams();
    const tab = updates.tab !== undefined ? updates.tab : currentTab;
    const cat = updates.category !== undefined ? updates.category : resolvedParams.category;
    const s = updates.sort !== undefined ? updates.sort : resolvedParams.sort;
    const city = updates.city !== undefined ? updates.city : cityQuery;
    const q = updates.query !== undefined ? updates.query : resolvedParams.query;

    if (tab && tab !== 'places') p.set('tab', tab);
    if (cat && cat !== 'All') p.set('category', cat);
    if (s && s !== 'trending') p.set('sort', s);
    if (city) p.set('city', city);
    if (q) p.set('query', q);

    const qs = p.toString();
    return qs ? `/discover?${qs}` : '/discover';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold tracking-widest uppercase text-[#4A6B5D]">
          Community Discovery
        </span>
        <h1 className="font-sans text-3xl sm:text-5xl font-black text-[#2C2A29] tracking-tight">
          Discover Places & Experiences.
        </h1>
        <p className="text-sm sm:text-base text-[#78726D] max-w-2xl font-normal">
          Explore authentic cafés, restaurants, hidden gems, and itineraries curated by travelers and locals.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <form
          action="/discover"
          method="GET"
          className="bg-white p-3 sm:p-4 rounded-3xl border border-[#E6DFD5] shadow-2xs flex flex-col sm:flex-row gap-3"
        >
          {currentTab !== 'places' && (
            <input type="hidden" name="tab" value={currentTab} />
          )}

          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-[#78726D]" />
            <input
              type="text"
              name="query"
              defaultValue={resolvedParams.query || ''}
              placeholder="Search spots, coffee, food, parks, activities..."
              className="w-full rounded-xl border border-[#E6DFD5] bg-[#FAF6F0] pl-11 pr-4 py-3 text-xs font-medium text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#2C2A29] focus:bg-white transition-all"
            />
          </div>

          <div className="relative sm:w-64">
            <MapPin className="absolute left-4 top-3.5 h-4.5 w-4.5 text-[#4A6B5D]" />
            <input
              type="text"
              name="city"
              defaultValue={cityQuery}
              placeholder="City or location (e.g. Kolkata)"
              className="w-full rounded-xl border border-[#E6DFD5] bg-[#FAF6F0] pl-11 pr-4 py-3 text-xs font-medium text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#2C2A29] focus:bg-white transition-all"
            />
          </div>

          {currentSort !== 'trending' && (
            <input type="hidden" name="sort" value={currentSort} />
          )}

          <button
            type="submit"
            className="rounded-xl bg-[#4A6B5D] hover:bg-[#3B594B] text-white font-bold px-6 py-3 text-xs shadow-2xs active-press transition-colors"
          >
            Search
          </button>
        </form>

        {/* Quick City Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <span className="text-[11px] font-bold text-[#9E968F] uppercase tracking-wider shrink-0">
            Popular Cities:
          </span>
          {popularCities.map((city) => {
            const isSelected = cityQuery.toLowerCase() === city.toLowerCase();
            return (
              <Link
                key={city}
                href={buildUrl({ city: isSelected ? '' : city })}
                className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                  isSelected
                    ? 'bg-[#4A6B5D] text-white shadow-2xs'
                    : 'bg-[#F8F6F0] border border-[#EAE4D9] text-[#78726D] hover:text-[#2C2A29]'
                }`}
              >
                {city}
              </Link>
            );
          })}
        </div>

        {/* Category Pills & Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
          {/* Horizontal Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const isSelected =
                (cat.label === 'All' && !cityQuery && !resolvedParams.query && !resolvedParams.category) ||
                resolvedParams.category?.toLowerCase() === cat.label.toLowerCase() ||
                resolvedParams.query?.toLowerCase() === cat.label.toLowerCase();

              const href = buildUrl({ category: cat.label });

              return (
                <Link
                  key={cat.label}
                  href={href}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#4A6B5D] text-white shadow-2xs'
                      : 'bg-white text-[#78726D] border border-[#E6DFD5] hover:border-[#2C2A29] hover:text-[#2C2A29]'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Sort Tabs */}
          <div className="flex items-center gap-1 self-start md:self-auto bg-white border border-[#E6DFD5] p-1 rounded-xl shadow-2xs shrink-0">
            <span className="text-[11px] font-bold text-[#9E968F] px-2 uppercase tracking-wider hidden sm:inline">
              Sort:
            </span>
            {[
              { id: 'trending', label: 'Trending' },
              { id: 'popular', label: 'Popular' },
              { id: 'rated', label: 'Top Rated' },
              { id: 'recent', label: 'Recent' },
            ].map((tab) => {
              const isActive = currentSort === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={buildUrl({ sort: tab.id })}
                  className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#2C2A29] text-white shadow-xs'
                      : 'text-[#78726D] hover:text-[#2C2A29] hover:bg-[#FAF6F0]'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Discovery Tab Selector: Places vs Lists */}
        <div className="flex items-center gap-2 pt-2 border-b border-[#E6DFD5] pb-3">
          <Link
            href={buildUrl({ tab: 'places' })}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              currentTab === 'places'
                ? 'bg-[#4A6B5D] text-white shadow-2xs'
                : 'bg-white border border-[#E6DFD5] text-[#78726D] hover:text-[#2C2A29]'
            }`}
          >
            <Map className="h-4 w-4" />
            <span>Places & Spots ({places.length})</span>
          </Link>

          <Link
            href={buildUrl({ tab: 'lists' })}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              currentTab === 'lists'
                ? 'bg-[#4A6B5D] text-white shadow-2xs'
                : 'bg-white border border-[#E6DFD5] text-[#78726D] hover:text-[#2C2A29]'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Curated Lists ({lists.length})</span>
          </Link>

          {(resolvedParams.query || cityQuery || resolvedParams.category) && (
            <Link href="/discover" className="text-xs font-bold text-[#4A6B5D] hover:underline ml-auto">
              Clear filters
            </Link>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {currentTab === 'places' ? (
          /* PLACES DISCOVERY GRID */
          places.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceDiscoveryCard
                  key={place.id}
                  place={place}
                  currentUserId={user?.id}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white border border-[#E6DFD5] p-12 text-center space-y-4 shadow-2xs max-w-lg mx-auto">
              <div className="h-14 w-14 rounded-2xl bg-[#F0F5F2] text-[#4A6B5D] flex items-center justify-center mx-auto">
                <Compass className="h-7 w-7 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-xl font-bold text-[#2C2A29]">
                  No places found yet
                </h3>
                <p className="text-[#78726D] text-xs font-medium">
                  We couldn&apos;t find any places matching your filter. Try searching for a different city or category!
                </p>
              </div>
            </div>
          )
        ) : (
          /* CURATED LISTS DISCOVERY GRID */
          lists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lists.map((list) => (
                <WanderListCard key={list.id} list={list} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white border border-[#E6DFD5] p-12 text-center space-y-4 shadow-2xs max-w-lg mx-auto">
              <div className="h-14 w-14 rounded-2xl bg-[#F3ECE1] text-[#2C2A29] flex items-center justify-center mx-auto">
                <Compass className="h-7 w-7 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-xl font-bold text-[#2C2A29]">
                  No lists found
                </h3>
                <p className="text-[#78726D] text-xs font-medium">
                  Be the first traveler to share a list in this destination!
                </p>
              </div>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-xl bg-[#4A6B5D] text-white font-extrabold px-5 py-2.5 text-xs shadow-2xs hover:bg-[#3B594B] active-press transition-colors"
              >
                <PlusCircle className="h-4 w-4" /> Create a list
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}

