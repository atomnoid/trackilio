/**
 * search.ts
 * Database-backed smart search service.
 * Uses parseSearchIntent() from search.utils to translate natural language
 * queries into structured database queries with engagement-based ranking.
 */

import { createClient } from '@/lib/supabase/server';
import type {
  Place,
  WanderList,
  Profile,
  PlaceSearchResult,
  ListSearchResult,
  UserSearchResult,
  ParsedSearchIntent,
} from '@/types/database';
import { parseSearchIntent } from './search.utils';

// ---------------------------------------------------------------------------
// Category mapping: canonical internal → database category values to match
// ---------------------------------------------------------------------------
const CATEGORY_DB_VARIANTS: Record<string, string[]> = {
  cafe: ['cafe', 'café', 'coffee', 'coffee shop', 'cafes', 'cafés'],
  restaurant: ['restaurant', 'dining', 'food', 'eatery', 'restaurant & bar'],
  bar: ['bar', 'pub', 'nightlife', 'club', 'lounge'],
  'date spot': ['date spot', 'romantic', 'romance'],
  nature: ['nature', 'park', 'garden', 'outdoor', 'beach'],
  hiking: ['hiking', 'trek', 'trail', 'mountain'],
  sightseeing: ['sightseeing', 'tourist', 'landmark', 'museum', 'historical', 'heritage', 'temple'],
  shopping: ['shopping', 'market', 'mall', 'boutique'],
  'weekend trip': ['weekend trip', 'day trip', 'getaway'],
  'hidden gem': ['hidden gem', 'offbeat'],
};

/**
 * Build Supabase OR filter for category variants
 */
function buildCategoryFilter(canonicalCategory: string): string {
  const variants = CATEGORY_DB_VARIANTS[canonicalCategory] ?? [canonicalCategory];
  return variants.map((v) => `category.ilike.%${v}%`).join(',');
}

// ---------------------------------------------------------------------------
// Scoring helpers
// ---------------------------------------------------------------------------
function scorePlaceResult(
  place: Place,
  intent: ParsedSearchIntent
): number {
  let score = 0;

  const nameLower = (place.name ?? '').toLowerCase();
  const cityLower = (place.city ?? place.location ?? '').toLowerCase();
  const countryLower = (place.country ?? '').toLowerCase();
  const categoryLower = (place.category ?? '').toLowerCase();
  const descLower = (place.description ?? '').toLowerCase();

  // Exact name match
  if (intent.terms.some((t) => nameLower === t)) score += 100;
  // Partial name match
  if (intent.terms.some((t) => nameLower.includes(t))) score += 35;

  // Location match
  if (intent.location) {
    if (cityLower.includes(intent.location)) score += 50;
    else if (countryLower.includes(intent.location)) score += 30;
  }

  // Category match
  if (intent.category) {
    const variants = CATEGORY_DB_VARIANTS[intent.category] ?? [intent.category];
    if (variants.some((v) => categoryLower.includes(v))) score += 40;
  }

  // Description term match
  if (intent.terms.some((t) => descLower.includes(t))) score += 10;

  // Engagement signals
  score += Math.min((place.upvotes_count ?? 0) * 2, 40);
  score += Math.min((place.lists_count ?? 0) * 3, 30);
  score += (place.rating ?? 0) * 5;
  score += Math.min((place.community_score ?? 0), 20);

  return score;
}

function scoreListResult(
  list: WanderList,
  intent: ParsedSearchIntent
): number {
  let score = 0;

  const titleLower = (list.title ?? '').toLowerCase();
  const descLower = (list.description ?? '').toLowerCase();
  const destLower = (list.destination ?? '').toLowerCase();

  // Exact title match
  if (intent.terms.some((t) => titleLower === t)) score += 100;
  // Partial title match
  if (intent.terms.some((t) => titleLower.includes(t))) score += 40;

  // Destination match
  if (intent.location) {
    if (destLower.includes(intent.location)) score += 60;
    else if (titleLower.includes(intent.location)) score += 40;
    else if (descLower.includes(intent.location)) score += 20;
  }

  // Category/term in title or description
  if (intent.category) {
    const variants = CATEGORY_DB_VARIANTS[intent.category] ?? [intent.category];
    if (variants.some((v) => titleLower.includes(v) || descLower.includes(v))) score += 35;
  }

  // Places count boosts engagement
  score += Math.min((list.places_count ?? 0) * 2, 20);

  return score;
}

function scoreUserResult(profile: Profile, rawQuery: string): number {
  let score = 0;
  const q = rawQuery.toLowerCase();
  const usernameLower = (profile.username ?? '').toLowerCase();
  const displayLower = (profile.display_name ?? '').toLowerCase();

  if (usernameLower === q) score += 100;
  else if (usernameLower.startsWith(q)) score += 70;
  else if (usernameLower.includes(q)) score += 40;

  if (displayLower === q) score += 90;
  else if (displayLower.startsWith(q)) score += 60;
  else if (displayLower.includes(q)) score += 30;

  score += Math.min((profile.followers_count ?? 0) * 2, 20);
  score += Math.min((profile.public_lists_count ?? 0) * 3, 15);

  return score;
}

// ---------------------------------------------------------------------------
// Search Places
// ---------------------------------------------------------------------------
export async function searchPlaces(
  intent: ParsedSearchIntent,
  limit = 20
): Promise<PlaceSearchResult[]> {
  if (!intent.rawQuery) return [];

  try {
    const supabase = await createClient();
    let q = (supabase as any).from('places').select('*');

    // Apply location filter
    if (intent.location) {
      q = q.or(`city.ilike.%${intent.location}%,location.ilike.%${intent.location}%,country.ilike.%${intent.location}%`);
    }

    // Apply category filter
    if (intent.category) {
      q = q.or(buildCategoryFilter(intent.category));
    }

    // Apply free-text filter (only if no location/category alone satisfies the query)
    if (!intent.location && !intent.category && intent.terms.length > 0) {
      const termFilter = intent.terms
        .map((t) => `name.ilike.%${t}%,location.ilike.%${t}%,description.ilike.%${t}%,category.ilike.%${t}%`)
        .join(',');
      q = q.or(termFilter);
    } else if (intent.terms.length > 0) {
      // Additional term refinement on top of location/category
      const termFilter = intent.terms
        .map((t) => `name.ilike.%${t}%`)
        .join(',');
      // Only add if meaningful terms exist after filtering
      if (intent.terms.length > 0) {
        // Use soft additional term matching — don't restrict too hard
        // (already filtered by location/category)
      }
    }

    q = q.limit(Math.min((intent.limit ?? limit) * 3, 200));

    const { data: raw, error } = await q;
    if (error || !raw) return [];

    // Enrich with engagement stats (reuse existing function logic)
    const places = raw as Place[];
    const placeIds = places.map((p) => p.id);

    if (placeIds.length === 0) return [];

    const { data: listPlaceData } = await (supabase as any)
      .from('list_places')
      .select('place_id, list:wander_lists(is_public), votes(vote_type)')
      .in('place_id', placeIds);

    const statsMap = new Map<string, { upvotes: number; downvotes: number; lists: number }>();
    (listPlaceData ?? []).forEach((lp: any) => {
      const current = statsMap.get(lp.place_id) ?? { upvotes: 0, downvotes: 0, lists: 0 };
      if (lp.list?.is_public) current.lists += 1;
      const votes = lp.votes ?? [];
      current.upvotes += votes.filter((v: any) => v.vote_type !== 'down').length;
      current.downvotes += votes.filter((v: any) => v.vote_type === 'down').length;
      statsMap.set(lp.place_id, current);
    });

    const enriched = places.map((p) => {
      const stats = statsMap.get(p.id) ?? { upvotes: 0, downvotes: 0, lists: 0 };
      return {
        ...p,
        upvotes_count: stats.upvotes,
        downvotes_count: stats.downvotes,
        lists_count: stats.lists,
        community_score: stats.upvotes - stats.downvotes + stats.lists * 3,
        slug: p.slug || p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      };
    });

    // Score and rank
    const scored: PlaceSearchResult[] = enriched.map((p) => ({
      ...p,
      _type: 'place' as const,
      _score: scorePlaceResult(p, intent),
    }));

    // Apply ranking intent on top of score
    if (intent.rankingIntent === 'trending') {
      scored.sort((a, b) => (b.community_score ?? 0) - (a.community_score ?? 0) + (b._score - a._score) * 0.1);
    } else if (intent.rankingIntent === 'rated') {
      scored.sort((a, b) => (b.rating ?? 0) * 10 + b._score - ((a.rating ?? 0) * 10 + a._score));
    } else {
      scored.sort((a, b) => b._score - a._score);
    }

    return scored.slice(0, intent.limit ?? limit);
  } catch (err: any) {
    console.warn('searchPlaces error:', err?.message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Search Lists
// ---------------------------------------------------------------------------
export async function searchLists(
  intent: ParsedSearchIntent,
  limit = 16
): Promise<ListSearchResult[]> {
  if (!intent.rawQuery) return [];

  try {
    const supabase = await createClient();
    let q = (supabase as any)
      .from('wander_lists')
      .select('*, owner:profiles(*)')
      .eq('is_public', true);

    // Location/destination filter
    if (intent.location) {
      q = q.or(`destination.ilike.%${intent.location}%,title.ilike.%${intent.location}%,description.ilike.%${intent.location}%`);
    }

    // Category-based term filter on title/description
    if (intent.category) {
      const variants = CATEGORY_DB_VARIANTS[intent.category] ?? [intent.category];
      const catFilter = variants.map((v) => `title.ilike.%${v}%,description.ilike.%${v}%`).join(',');
      q = q.or(catFilter);
    }

    // Free-text on remaining terms
    if (!intent.location && !intent.category && intent.terms.length > 0) {
      const termFilter = intent.terms
        .map((t) => `title.ilike.%${t}%,description.ilike.%${t}%,destination.ilike.%${t}%`)
        .join(',');
      q = q.or(termFilter);
    }

    q = q.order('updated_at', { ascending: false }).limit(Math.min((intent.limit ?? limit) * 3, 100));

    const { data, error } = await q;
    if (error || !data) return [];

    const lists = data as WanderList[];

    // Enrich with places count
    const listIds = lists.map((l) => l.id);
    const { data: lpData } = await (supabase as any)
      .from('list_places')
      .select('list_id')
      .in('list_id', listIds);

    const countMap = new Map<string, number>();
    (lpData ?? []).forEach((row: { list_id: string }) => {
      countMap.set(row.list_id, (countMap.get(row.list_id) ?? 0) + 1);
    });

    const enriched = lists.map((l) => ({
      ...l,
      places_count: countMap.get(l.id) ?? 0,
    }));

    const scored: ListSearchResult[] = enriched.map((l) => ({
      ...l,
      _type: 'list' as const,
      _score: scoreListResult(l, intent),
    }));

    scored.sort((a, b) => b._score - a._score);
    return scored.slice(0, intent.limit ?? limit);
  } catch (err: any) {
    console.warn('searchLists error:', err?.message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Search Users
// ---------------------------------------------------------------------------
export async function searchUsers(
  rawQuery: string,
  limit = 10
): Promise<UserSearchResult[]> {
  if (!rawQuery.trim()) return [];

  try {
    const supabase = await createClient();
    const q = rawQuery.toLowerCase().trim();

    const { data, error } = await (supabase as any)
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${q}%,display_name.ilike.%${q}%`)
      .limit(50);

    if (error || !data) return [];

    const profiles = data as Profile[];

    const scored: UserSearchResult[] = profiles.map((p) => ({
      ...p,
      _type: 'user' as const,
      _score: scoreUserResult(p, q),
    }));

    scored.sort((a, b) => b._score - a._score);
    return scored.slice(0, limit);
  } catch (err: any) {
    console.warn('searchUsers error:', err?.message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Unified Search
// ---------------------------------------------------------------------------
export interface UnifiedSearchResults {
  places: PlaceSearchResult[];
  lists: ListSearchResult[];
  users: UserSearchResult[];
  intent: ParsedSearchIntent;
}

export async function searchEverything(
  raw: string,
  options?: {
    placesLimit?: number;
    listsLimit?: number;
    usersLimit?: number;
  }
): Promise<UnifiedSearchResults> {
  const intent = parseSearchIntent(raw);

  const [places, lists, users] = await Promise.all([
    searchPlaces(intent, options?.placesLimit ?? 20),
    searchLists(intent, options?.listsLimit ?? 12),
    searchUsers(raw, options?.usersLimit ?? 8),
  ]);

  return { places, lists, users, intent };
}
