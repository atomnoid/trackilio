import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublicWanderLists } from '@/services/lists';
import { getPublicPlaces } from '@/services/places';
import { searchUsers } from '@/services/search';
import { parseSearchIntent } from '@/services/search.utils';
import { createClient } from '@/lib/supabase/server';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { PlaceDiscoveryCard } from '@/components/places/PlaceDiscoveryCard';
import { FollowButton } from '@/components/profile/FollowButton';
import { isFollowing as checkIsFollowing } from '@/services/follows';
import { Search, Compass, MapPin, PlusCircle, Map, Layers, Users, Sparkles, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Discover Places, Cafés, Hidden Gems & Curated Guides | Trackilio',
  description:
    'Discover great places, cafes, restaurants, hidden gems, and curated itineraries across Kolkata, Goa, Tokyo, Paris, and worldwide on Trackilio.',
};

export const revalidate = 30;

interface DiscoverPageProps {
  searchParams: Promise<{
    tab?: 'places' | 'lists' | 'people';
    query?: string;
    q?: string;
    city?: string;
    destination?: string;
    category?: string;
    sort?: 'recent' | 'trending' | 'popular' | 'rated';
  }>;
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const resolvedParams = await searchParams;
  const rawSearchText = resolvedParams.q || resolvedParams.query || '';

  // Smart Intent Parsing
  const parsedIntent = rawSearchText ? parseSearchIntent(rawSearchText) : null;

  const currentTab = resolvedParams.tab || 'places';
  const currentSort =
    resolvedParams.sort ||
    (parsedIntent?.rankingIntent === 'top' || parsedIntent?.rankingIntent === 'best'
      ? 'popular'
      : 'trending');

  const effectiveCategory = resolvedParams.category || parsedIntent?.category || undefined;
  const effectiveCity =
    resolvedParams.city ||
    resolvedParams.destination ||
    parsedIntent?.location ||
    '';
  const effectiveKeywords = parsedIntent ? parsedIntent.terms.join(' ') : resolvedParams.query || '';

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [places, lists, people] = await Promise.all([
    getPublicPlaces({
      query: effectiveKeywords || undefined,
      city: effectiveCity || undefined,
      category: effectiveCategory,
      sort: (currentSort === 'rated' ? 'rated' : currentSort === 'popular' ? 'popular' : currentSort === 'recent' ? 'recent' : 'trending'),
      limit: 30,
      currentUserId: user?.id,
    }),
    getPublicWanderLists({
      query: effectiveKeywords || effectiveCategory || undefined,
      destination: effectiveCity || undefined,
      sort: (currentSort === 'popular' ? 'popular' : currentSort === 'trending' ? 'trending' : 'recent'),
      limit: 24,
    }),
    currentTab === 'people' || rawSearchText
      ? searchUsers(rawSearchText || 'a', 24)
      : Promise.resolve([]),
  ]);

  // If user is logged in, check follow status for listed people
  const peopleFollowStatusMap: Record<string, boolean> = {};
  if (user && people.length > 0) {
    await Promise.all(
      people.map(async (p) => {
        if (p.id !== user.id) {
          peopleFollowStatusMap[p.id] = await checkIsFollowing(user.id, p.id);
        }
      })
    );
  }

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
    q?: string;
  }) => {
    const p = new URLSearchParams();
    const tab = updates.tab !== undefined ? updates.tab : currentTab;
    const cat = updates.category !== undefined ? updates.category : resolvedParams.category;
    const s = updates.sort !== undefined ? updates.sort : resolvedParams.sort;
    const city = updates.city !== undefined ? updates.city : resolvedParams.city;
    const q = updates.q !== undefined ? updates.q : rawSearchText;

    if (tab && tab !== 'places') p.set('tab', tab);
    if (cat && cat !== 'All') p.set('category', cat);
    if (s && s !== 'trending') p.set('sort', s);
    if (city) p.set('city', city);
    if (q) p.set('q', q);

    const qs = p.toString();
    return qs ? `/discover?${qs}` : '/discover';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-black tracking-widest uppercase text-[#FF5841]">
          Community Discovery
        </span>
        <h1 className="font-sans text-3xl sm:text-5xl font-black text-[#1A1723] tracking-tight">
          Discover Places & Experiences.
        </h1>
        <p className="text-sm sm:text-base text-[#4F4B5E] max-w-2xl font-normal">
          Explore authentic cafés, restaurants, hidden gems, and itineraries curated by travelers and locals.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <form
          action="/discover"
          method="GET"
          className="bg-white p-3 sm:p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-3"
        >
          {currentTab !== 'places' && (
            <input type="hidden" name="tab" value={currentTab} />
          )}

          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={rawSearchText}
              placeholder="Search spots, coffee, food, 'top cafes in kolkata'..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/20 focus:bg-white focus:border-[#FF5841] transition-all"
            />
          </div>

          <div className="relative sm:w-64">
            <MapPin className="absolute left-4 top-3.5 h-4.5 w-4.5 text-[#FF5841]" />
            <input
              type="text"
              name="city"
              defaultValue={resolvedParams.city || ''}
              placeholder="City or location (e.g. Kolkata)"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/20 focus:bg-white focus:border-[#FF5841] transition-all"
            />
          </div>

          {currentSort !== 'trending' && (
            <input type="hidden" name="sort" value={currentSort} />
          )}

          <button
            type="submit"
            className="rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] hover:opacity-95 text-white font-black px-6 py-3 text-xs shadow-xs active-press transition-all"
          >
            Search
          </button>
        </form>

        {/* Intent Detection Banner */}
        {parsedIntent && (parsedIntent.category || parsedIntent.location || parsedIntent.rankingIntent) && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-gray-100 rounded-2xl shadow-2xs text-xs">
            <div className="flex items-center gap-1.5 text-[#FF5841] font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Smart Search Applied:</span>
            </div>
            {parsedIntent.category && (
              <span className="rounded-xl bg-[#FFEAE6] border border-[#FFD3CC] px-2.5 py-0.5 font-bold text-[#FF5841] capitalize">
                Category: {parsedIntent.category}
              </span>
            )}
            {parsedIntent.location && (
              <span className="rounded-xl bg-gray-100 border border-gray-200 px-2.5 py-0.5 font-bold text-gray-700">
                City: {parsedIntent.location}
              </span>
            )}
            {parsedIntent.rankingIntent && (
              <span className="rounded-xl bg-purple-50 border border-purple-200 px-2.5 py-0.5 font-bold text-purple-700 capitalize">
                Sort: {parsedIntent.rankingIntent}
              </span>
            )}
            <Link href="/discover" className="text-gray-400 hover:text-gray-700 ml-auto font-bold underline">
              Reset search
            </Link>
          </div>
        )}

        {/* Quick City Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider shrink-0">
            Popular Cities:
          </span>
          {popularCities.map((city) => {
            const isSelected = effectiveCity.toLowerCase() === city.toLowerCase();
            return (
              <Link
                key={city}
                href={buildUrl({ city: isSelected ? '' : city })}
                className={`whitespace-nowrap rounded-xl px-3 py-1 text-xs font-extrabold transition-all ${
                  isSelected
                    ? 'bg-[#FF5841] text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300'
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
                (cat.label === 'All' && !effectiveCity && !rawSearchText && !resolvedParams.category) ||
                resolvedParams.category?.toLowerCase() === cat.label.toLowerCase() ||
                effectiveCategory?.toLowerCase() === cat.label.toLowerCase();

              const href = buildUrl({ category: cat.label });

              return (
                <Link
                  key={cat.label}
                  href={href}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#FF5841]/40 hover:text-black'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Sort Tabs */}
          <div className="flex items-center gap-1 self-start md:self-auto bg-white border border-gray-200 p-1 rounded-2xl shadow-2xs shrink-0">
            <span className="text-[11px] font-extrabold text-gray-400 px-2 uppercase tracking-wider hidden sm:inline">
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
                  className={`px-3 py-1 text-xs font-black rounded-xl transition-all ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-xs'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Discovery Tab Selector: Places vs Lists vs People */}
        <div className="flex items-center gap-2 pt-2 border-b border-gray-200 pb-3">
          <Link
            href={buildUrl({ tab: 'places' })}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all ${
              currentTab === 'places'
                ? 'bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:text-black'
            }`}
          >
            <Map className="h-4 w-4" />
            <span>Places & Spots ({places.length})</span>
          </Link>

          <Link
            href={buildUrl({ tab: 'lists' })}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all ${
              currentTab === 'lists'
                ? 'bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:text-black'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Curated Lists ({lists.length})</span>
          </Link>

          <Link
            href={buildUrl({ tab: 'people' })}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all ${
              currentTab === 'people'
                ? 'bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:text-black'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>People ({people.length})</span>
          </Link>

          {(rawSearchText || effectiveCity || resolvedParams.category) && (
            <Link href="/discover" className="text-xs font-extrabold text-[#FF5841] hover:underline ml-auto">
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
            <div className="rounded-3xl bg-white border border-gray-100 p-12 text-center space-y-4 shadow-2xs max-w-lg mx-auto">
              <div className="h-14 w-14 rounded-2xl bg-[#FFEAE6] text-[#FF5841] flex items-center justify-center mx-auto">
                <Compass className="h-7 w-7 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-xl font-bold text-gray-900">
                  No places found
                </h3>
                <p className="text-gray-500 text-xs font-medium">
                  We couldn&apos;t find any places matching your search. Try broadening your keywords or exploring popular cities above!
                </p>
              </div>
            </div>
          )
        ) : currentTab === 'lists' ? (
          /* CURATED LISTS DISCOVERY GRID */
          lists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lists.map((list) => (
                <WanderListCard key={list.id} list={list} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white border border-gray-100 p-12 text-center space-y-4 shadow-2xs max-w-lg mx-auto">
              <div className="h-14 w-14 rounded-2xl bg-[#FFEAE6] text-[#FF5841] flex items-center justify-center mx-auto">
                <Compass className="h-7 w-7 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-xl font-bold text-gray-900">
                  No lists found
                </h3>
                <p className="text-gray-500 text-xs font-medium">
                  Be the first traveler to share a list in this destination!
                </p>
              </div>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white font-black px-5 py-2.5 text-xs shadow-xs hover:opacity-95 active-press transition-all"
              >
                <PlusCircle className="h-4 w-4" /> Create a list
              </Link>
            </div>
          )
        ) : (
          /* PEOPLE DISCOVERY GRID */
          people.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {people.map((p) => {
                const name = p.display_name || p.username || 'Traveler';
                const initial = name.charAt(0).toUpperCase();
                const isSelf = user && user.id === p.id;

                return (
                  <div
                    key={p.id}
                    className="rounded-3xl bg-white border border-gray-100 p-6 shadow-xs flex flex-col justify-between gap-4 hover:border-gray-200 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <Link href={`/u/${p.username || p.id}`}>
                        {p.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.avatar_url}
                            alt={name}
                            className="h-14 w-14 rounded-2xl object-cover border border-gray-200 shadow-2xs"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#FF5841] to-[#C53678] text-white font-black text-xl flex items-center justify-center shadow-2xs">
                            {initial}
                          </div>
                        )}
                      </Link>

                      <div className="flex-1 min-w-0 space-y-1">
                        <Link href={`/u/${p.username || p.id}`}>
                          <h3 className="font-sans text-base font-black text-gray-900 truncate hover:text-[#FF5841] transition-colors">
                            {name}
                          </h3>
                        </Link>
                        {p.username && (
                          <div className="text-xs font-bold text-gray-400">
                            @{p.username}
                          </div>
                        )}
                        {p.bio && (
                          <p className="text-xs text-gray-600 line-clamp-2 pt-1 font-medium">
                            {p.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs text-gray-500 font-bold">
                      <div className="flex items-center gap-3">
                        <span>{p.followers_count || 0} followers</span>
                        <span>•</span>
                        <span>{p.public_lists_count || 0} lists</span>
                      </div>

                      {!isSelf && (
                        <FollowButton
                          targetUserId={p.id}
                          initialIsFollowing={!!peopleFollowStatusMap[p.id]}
                          size="sm"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl bg-white border border-gray-100 p-12 text-center space-y-4 shadow-2xs max-w-lg mx-auto">
              <div className="h-14 w-14 rounded-2xl bg-[#FFEAE6] text-[#FF5841] flex items-center justify-center mx-auto">
                <Users className="h-7 w-7 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-xl font-bold text-gray-900">
                  No travelers found
                </h3>
                <p className="text-gray-500 text-xs font-medium">
                  Try searching with a username or display name.
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

