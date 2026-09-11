import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublicWanderLists } from '@/services/lists';
import { getPublicPlaces } from '@/services/places';
import { searchUsers } from '@/services/search';
import { parseSearchIntent } from '@/services/search.utils';
import { createClient } from '@/lib/supabase/server';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { DiscoverListsSection } from '@/components/discover/DiscoverListsSection';
import { PlaceDiscoveryCard } from '@/components/places/PlaceDiscoveryCard';
import { FollowButton } from '@/components/profile/FollowButton';
import { isFollowing as checkIsFollowing } from '@/services/follows';
import { SearchIcon, PinIcon } from '@/components/icons/Icons';

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
    (parsedIntent?.rankingIntent === 'popular'
      ? 'popular'
      : parsedIntent?.rankingIntent === 'rated'
      ? 'rated'
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
      limit: 100,
    }),
    currentTab === 'people' || rawSearchText
      ? searchUsers(rawSearchText || 'a', 24)
      : Promise.resolve([]),
  ]);

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
    { label: 'Waterfall', emoji: '🌊' },
    { label: 'Mountain', emoji: '⛰️' },
    { label: 'Forest', emoji: '🌲' },
    { label: 'Spiritual Sights', emoji: '🛕' },
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 bg-[#FAF3E1]">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold tracking-widest uppercase text-[#FA8112]">
          Community Discovery
        </span>
        <h1 className="font-sans text-3xl sm:text-5xl font-black text-[#222222] tracking-tight">
          Discover Places &amp; Experiences.
        </h1>
        <p className="text-sm sm:text-base text-[#6B6862] max-w-2xl font-normal leading-relaxed">
          Find authentic cafés, restaurants, hidden gems, and itineraries saved by travelers and locals.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <form
          action="/discover"
          method="GET"
          className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E8DECA] shadow-2xs flex flex-col sm:flex-row gap-3"
        >
          {currentTab !== 'places' && (
            <input type="hidden" name="tab" value={currentTab} />
          )}

          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-3.5 w-4 h-4 text-[#6B6862]" />
            <input
              type="text"
              name="q"
              defaultValue={rawSearchText}
              placeholder="Search spots, coffee, food, 'top cafes in kolkata'..."
              className="w-full rounded-xl border border-[#E8DECA] bg-[#FAF3E1]/60 pl-11 pr-4 py-2.5 text-xs font-medium text-[#222222] focus:outline-none focus:bg-white focus:border-[#222222] transition-colors"
            />
          </div>

          <div className="relative sm:w-60">
            <PinIcon className="absolute left-4 top-3.5 w-4 h-4 text-[#FA8112]" />
            <input
              type="text"
              name="city"
              defaultValue={resolvedParams.city || ''}
              placeholder="City (e.g. Kolkata)"
              className="w-full rounded-xl border border-[#E8DECA] bg-[#FAF3E1]/60 pl-11 pr-4 py-2.5 text-xs font-medium text-[#222222] focus:outline-none focus:bg-white focus:border-[#222222] transition-colors"
            />
          </div>

          {currentSort !== 'trending' && (
            <input type="hidden" name="sort" value={currentSort} />
          )}

          <button
            type="submit"
            className="rounded-xl bg-[#222222] hover:bg-[#FA8112] text-white font-extrabold px-6 py-2.5 text-xs active-press transition-colors shadow-xs"
          >
            Search
          </button>
        </form>

        {/* Intent Detection Banner */}
        {parsedIntent && (parsedIntent.category || parsedIntent.location || parsedIntent.rankingIntent) && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-[#F5E7C6] border border-[#E8DECA] rounded-xl text-xs">
            <span className="font-extrabold text-[#222222]">
              Smart Search:
            </span>
            {parsedIntent.category && (
              <span className="rounded-lg bg-white border border-[#E8DECA] px-2.5 py-0.5 font-bold text-[#222222] capitalize">
                Category: {parsedIntent.category}
              </span>
            )}
            {parsedIntent.location && (
              <span className="rounded-lg bg-white border border-[#E8DECA] px-2.5 py-0.5 font-bold text-[#222222]">
                City: {parsedIntent.location}
              </span>
            )}
            {parsedIntent.rankingIntent && (
              <span className="rounded-lg bg-white border border-[#E8DECA] px-2.5 py-0.5 font-bold text-[#222222] capitalize">
                Sort: {parsedIntent.rankingIntent}
              </span>
            )}
            <Link href="/discover" className="text-[#6B6862] hover:text-[#222222] ml-auto font-bold underline">
              Reset
            </Link>
          </div>
        )}

        {/* Quick City Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <span className="text-[11px] font-extrabold text-[#6B6862] uppercase tracking-wider shrink-0">
            Cities:
          </span>
          {popularCities.map((city) => {
            const isSelected = effectiveCity.toLowerCase() === city.toLowerCase();
            return (
              <Link
                key={city}
                href={buildUrl({ city: isSelected ? '' : city })}
                className={`whitespace-nowrap rounded-xl px-3 py-1 text-xs font-bold transition-colors ${
                  isSelected
                    ? 'bg-[#222222] text-white'
                    : 'bg-white border border-[#E8DECA] text-[#222222] hover:border-[#222222]'
                }`}
              >
                {city}
              </Link>
            );
          })}
        </div>

        {/* Category Pills & Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-1">
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
                  className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#222222] text-white'
                      : 'bg-white text-[#222222] border border-[#E8DECA] hover:border-[#222222]'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Sort Tabs */}
          <div className="flex items-center gap-1 self-start md:self-auto bg-white border border-[#E8DECA] p-1 rounded-xl shrink-0">
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
                  className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#F5E7C6] text-[#222222]'
                      : 'text-[#6B6862] hover:text-[#222222]'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Discovery Tab Selector: Places vs Lists vs People */}
        <div className="flex items-center gap-2 pt-2 border-b border-[#E8DECA] pb-3">
          <Link
            href={buildUrl({ tab: 'places' })}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${
              currentTab === 'places'
                ? 'bg-[#222222] text-white'
                : 'bg-white border border-[#E8DECA] text-[#222222] hover:border-[#222222]'
            }`}
          >
            <span>Places ({places.length})</span>
          </Link>

          <Link
            href={buildUrl({ tab: 'lists' })}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${
              currentTab === 'lists'
                ? 'bg-[#222222] text-white'
                : 'bg-white border border-[#E8DECA] text-[#222222] hover:border-[#222222]'
            }`}
          >
            <span>Lists ({lists.length})</span>
          </Link>

          <Link
            href={buildUrl({ tab: 'people' })}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${
              currentTab === 'people'
                ? 'bg-[#222222] text-white'
                : 'bg-white border border-[#E8DECA] text-[#222222] hover:border-[#222222]'
            }`}
          >
            <span>People ({people.length})</span>
          </Link>

          {(rawSearchText || effectiveCity || resolvedParams.category) && (
            <Link href="/discover" className="text-xs font-extrabold text-[#FA8112] hover:underline ml-auto">
              Clear filters
            </Link>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {currentTab === 'places' ? (
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
            <div className="rounded-2xl bg-white border border-[#E8DECA] p-12 text-center space-y-2 max-w-md mx-auto">
              <h3 className="font-sans text-base font-extrabold text-[#222222]">
                No places found
              </h3>
              <p className="text-xs text-[#6B6862]">
                Try searching with broader terms or exploring another city above.
              </p>
            </div>
          )
        ) : currentTab === 'lists' ? (
          <DiscoverListsSection lists={lists} />
        ) : (
          people.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {people.map((p) => {
                const name = p.display_name || p.username || 'Traveler';
                const initial = name.charAt(0).toUpperCase();
                const isSelf = user && user.id === p.id;

                return (
                  <div
                    key={p.id}
                    className="rounded-2xl bg-white border border-[#E8DECA] p-5 flex flex-col justify-between gap-4 hover:border-[#222222] transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <Link href={`/u/${p.username || p.id}`}>
                        {p.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.avatar_url}
                            alt={name}
                            className="h-12 w-12 rounded-xl object-cover border border-[#E8DECA]"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-[#222222] text-white font-black text-lg flex items-center justify-center">
                            {initial}
                          </div>
                        )}
                      </Link>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <Link href={`/u/${p.username || p.id}`}>
                          <h3 className="font-sans text-sm font-extrabold text-[#222222] truncate hover:text-[#FA8112] transition-colors">
                            {name}
                          </h3>
                        </Link>
                        {p.username && (
                          <div className="text-xs font-bold text-[#6B6862]">
                            @{p.username}
                          </div>
                        )}
                        {p.bio && (
                          <p className="text-xs text-[#6B6862] line-clamp-2 pt-1">
                            {p.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E8DECA]/60 text-xs text-[#6B6862] font-semibold">
                      <div className="flex items-center gap-2">
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
            <div className="rounded-2xl bg-white border border-[#E8DECA] p-12 text-center space-y-2 max-w-md mx-auto">
              <h3 className="font-sans text-base font-extrabold text-[#222222]">
                No people found
              </h3>
              <p className="text-xs text-[#6B6862]">
                Try searching with another name or username.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
