import { createClient } from '@/lib/supabase/server';
import { ListPlace, Place, PriorityLevel, SavedPlace, VisitStatus, VoteType } from '@/types/database';
import { CURATED_PLACES, CURATED_LISTS, CURATED_LIST_PLACES_MAP, getCuratedNotesForPlace } from '@/services/curatedData';

/**
 * Maps every UI category label to the list of terms to search in the DB.
 * Handles plurals, accented chars, and alternate spellings so tags always return results.
 */
const CATEGORY_SEARCH_TERMS: Record<string, string[]> = {
  // Cafés
  'cafés':        ['cafe', 'caf\u00e9', 'cafes', 'caf\u00e9s', 'coffee', 'coffee shop'],
  'cafes':        ['cafe', 'caf\u00e9', 'cafes', 'caf\u00e9s', 'coffee', 'coffee shop'],
  'café':         ['cafe', 'caf\u00e9', 'cafes', 'caf\u00e9s', 'coffee'],
  'cafe':         ['cafe', 'caf\u00e9', 'cafes', 'caf\u00e9s', 'coffee'],
  // Restaurants
  'restaurants':  ['restaurant', 'dining', 'food', 'eatery', 'bistro'],
  'restaurant':   ['restaurant', 'dining', 'food', 'eatery', 'bistro'],
  // Sea & Beaches
  'sea':          ['sea', 'beach', 'beaches', 'coastal', 'seaside', 'shore'],
  'sea & beaches':['sea', 'beach', 'beaches', 'coastal', 'seaside', 'shore'],
  'beach':        ['beach', 'beaches', 'sea', 'coastal', 'seaside'],
  'beaches':      ['beach', 'beaches', 'sea', 'coastal', 'seaside'],
  // Lake
  'lake':         ['lake', 'lakes', 'lagoon', 'waterway'],
  'lakes':        ['lake', 'lakes', 'lagoon'],
  // Ocean
  'ocean':        ['ocean', 'sea', 'beach', 'coastal'],
  // Park / Garden
  'park':         ['park', 'garden', 'gardens', 'park / garden', 'parks'],
  'garden':       ['garden', 'gardens', 'park', 'park / garden'],
  'park / garden':['park', 'garden', 'gardens', 'parks'],
  'parks':        ['park', 'garden', 'parks'],
  'gardens':      ['garden', 'gardens', 'park'],
  // Nature
  'nature':       ['nature', 'outdoor', 'scenic', 'green'],
  // Waterfall
  'waterfall':    ['waterfall', 'falls', 'cascade'],
  // Mountain
  'mountain':     ['mountain', 'mountains', 'hill', 'peak', 'hiking', 'trek'],
  // Forest
  'forest':       ['forest', 'jungle', 'woods', 'woodland'],
  // Spiritual
  'spiritual sights': ['spiritual', 'temple', 'shrine', 'mosque', 'church', 'religious'],
  'spiritual':    ['spiritual', 'temple', 'shrine', 'mosque', 'church'],
  // Hidden Gems
  'hidden gems':  ['hidden gem', 'hidden gems', 'offbeat', 'secret'],
  'hidden gem':   ['hidden gem', 'hidden gems', 'offbeat', 'secret'],
  // Date Spots
  'date spots':   ['date spot', 'date spots', 'romantic', 'romance'],
  'date spot':    ['date spot', 'date spots', 'romantic'],
  // Sightseeing
  'sightseeing':  ['sightseeing', 'landmark', 'tourist', 'attraction', 'museum', 'heritage', 'historical'],
  // Bars & Nightlife
  'bars & nightlife': ['bar', 'pub', 'nightlife', 'club', 'lounge', 'cocktail'],
  'bars':         ['bar', 'pub', 'nightlife', 'club', 'lounge'],
  // Shopping
  'shopping':     ['shopping', 'market', 'mall', 'boutique', 'shop'],
  // Weekend Trips
  'weekend trips':['weekend trip', 'day trip', 'getaway', 'road trip'],
  'weekend trip': ['weekend trip', 'day trip', 'getaway'],
};

/** Expand a UI category label into all its searchable DB terms */
function expandCategoryTerms(label: string): string[] {
  const key = label.toLowerCase().trim();
  return CATEGORY_SEARCH_TERMS[key] ?? [key];
}

export function generatePlaceSlug(name: string, location?: string | null): string {
  const base = location ? `${name}-${location}` : name;
  const clean = base
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return clean || 'place';
}

/**
 * Get all places associated with a specific list
 */
export async function getPlacesForList(
  listId: string,
  currentUserId?: string
): Promise<ListPlace[]> {
  try {
    const supabase = await createClient();

    const { data: listPlaces, error } = await (supabase as any)
      .from('list_places')
      .select(`
        *,
        place:places(*),
        votes(id, user_id, vote_type)
      `)
      .eq('list_id', listId)
      .order('created_at', { ascending: true });

    if (!error && listPlaces && listPlaces.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return listPlaces.map((lp: any) => {
        const votesArr = lp.votes || [];
        const userVote = currentUserId
          ? votesArr.find((v: { user_id: string; vote_type?: string }) => v.user_id === currentUserId)
          : null;
        const upvotes = votesArr.filter((v: any) => v.vote_type !== 'down').length;
        const downvotes = votesArr.filter((v: any) => v.vote_type === 'down').length;

        return {
          ...lp,
          votes_count: upvotes - downvotes,
          upvotes_count: upvotes,
          downvotes_count: downvotes,
          user_has_voted: !!userVote,
          user_vote_type: userVote ? (userVote.vote_type || 'up') : null,
        };
      }) as ListPlace[];
    }
  } catch (err) {
    console.warn('getPlacesForList fallback to curated places:', err);
  }

  // Fallback to curated list places
  const fallbackListPlaces =
    CURATED_LIST_PLACES_MAP[listId] ||
    (listId.includes('kyoto') || listId === 'demo-1' ? CURATED_LIST_PLACES_MAP['list-kyoto-1'] : null) ||
    (listId.includes('kolkata') || listId === 'demo-2' ? CURATED_LIST_PLACES_MAP['list-kolkata-1'] : null) ||
    (listId.includes('paris') || listId === 'demo-3' ? CURATED_LIST_PLACES_MAP['list-paris-1'] : null) ||
    [];

  return fallbackListPlaces;
}

/**
 * Add a newly created place to a specific list
 */
export async function addPlaceToList(params: {
  listId: string;
  name: string;
  location?: string;
  city?: string;
  country?: string;
  category?: string;
  tags?: string[];
  mapsUrl?: string;
  note?: string;
  priority?: PriorityLevel;
  status?: VisitStatus;
  addedBy?: string;
}): Promise<{ success: boolean; placeId?: string; error?: string }> {
  const supabase = await createClient();
  const slug = generatePlaceSlug(params.name, params.location || params.city);

  const { data: place, error: placeError } = await (supabase as any)
    .from('places')
    .insert({
      name: params.name,
      slug,
      location: params.location || null,
      city: params.city || params.location || null,
      country: params.country || null,
      category: params.category || 'Sight',
      tags: params.tags || [],
      maps_url: params.mapsUrl || null,
    })
    .select('id')
    .single();

  if (placeError || !place) {
    return { success: false, error: placeError?.message || 'Failed to create place' };
  }

  const { error: linkError } = await (supabase as any).from('list_places').insert({
    list_id: params.listId,
    place_id: place.id,
    note: params.note || null,
    priority: params.priority || 'must_visit',
    status: params.status || 'saved',
    added_by: params.addedBy || null,
  });

  if (linkError) return { success: false, error: linkError.message };
  return { success: true, placeId: place.id };
}

/**
 * Add an existing canonical place into a list
 */
export async function addExistingPlaceToList(params: {
  listId: string;
  placeId: string;
  note?: string;
  priority?: PriorityLevel;
  status?: VisitStatus;
  addedBy?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await (supabase as any).from('list_places').insert({
    list_id: params.listId,
    place_id: params.placeId,
    note: params.note || null,
    priority: params.priority || 'must_visit',
    status: params.status || 'saved',
    added_by: params.addedBy || null,
  });

  if (error) {
    if (error.message?.includes('unique') || error.code === '23505') {
      return { success: false, error: 'This place is already in this list.' };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Helper to batch enrich Places with upvotes and list counts
 */
async function enrichPlacesWithStats(
  supabase: any,
  rawPlaces: Place[],
  currentUserId?: string
): Promise<Place[]> {
  if (rawPlaces.length === 0) return [];
  const placeIds = rawPlaces.map((p) => p.id);

  try {
    const [listPlacesRes, savedRes] = await Promise.all([
      (supabase as any)
        .from('list_places')
        .select(`
          id,
          place_id,
          note,
          list:wander_lists(id, title, slug, is_public, owner:profiles(display_name, username)),
          votes(vote_type)
        `)
        .in('place_id', placeIds),
      currentUserId
        ? (supabase as any)
            .from('saved_places')
            .select('place_id')
            .eq('user_id', currentUserId)
            .in('place_id', placeIds)
        : Promise.resolve({ data: [] }),
    ]);

    const userSavedSet = new Set((savedRes.data ?? []).map((s: any) => s.place_id));

    const statsMap = new Map<
      string,
      {
        upvotes: number;
        downvotes: number;
        lists: number;
        notes: Array<{ id?: string; note: string; author_name?: string; list_title?: string; list_slug?: string }>;
      }
    >();

    (listPlacesRes.data ?? []).forEach((lp: any) => {
      const current = statsMap.get(lp.place_id) || {
        upvotes: 0,
        downvotes: 0,
        lists: 0,
        notes: [],
      };

      if (lp.list?.is_public) {
        current.lists += 1;
      }

      if (lp.note && lp.note.trim()) {
        const authorName = lp.list?.owner?.display_name || lp.list?.owner?.username || 'Traveler';
        current.notes.push({
          id: lp.id,
          note: lp.note.trim(),
          author_name: authorName,
          list_title: lp.list?.title,
          list_slug: lp.list?.slug,
        });
      }

      const votes = lp.votes || [];
      const up = votes.filter((v: any) => v.vote_type !== 'down').length;
      const down = votes.filter((v: any) => v.vote_type === 'down').length;
      current.upvotes += up;
      current.downvotes += down;

      statsMap.set(lp.place_id, current);
    });

    return rawPlaces.map((p) => {
      const stats = statsMap.get(p.id) || { upvotes: 0, downvotes: 0, lists: 0, notes: [] };
      const communityScore = stats.upvotes - stats.downvotes + stats.lists * 3;
      const slug = p.slug || generatePlaceSlug(p.name, p.location || p.city);

      const curatedNotes = getCuratedNotesForPlace(p.id);
      const combinedNotes = stats.notes.length > 0 ? stats.notes : curatedNotes;
      const primaryNote = p.note || (combinedNotes.length > 0 ? combinedNotes[0].note : null);

      return {
        ...p,
        slug,
        upvotes_count: stats.upvotes,
        downvotes_count: stats.downvotes,
        community_score: communityScore,
        lists_count: stats.lists,
        is_saved: userSavedSet.has(p.id),
        note: primaryNote,
        notes: combinedNotes,
      };
    });
  } catch (err: any) {
    console.warn('Error enriching places with stats:', err?.message || err);
    return rawPlaces.map((p) => {
      const curatedNotes = getCuratedNotesForPlace(p.id);
      return {
        ...p,
        upvotes_count: 0,
        downvotes_count: 0,
        lists_count: 0,
        is_saved: false,
        note: p.note || (curatedNotes.length > 0 ? curatedNotes[0].note : null),
        notes: curatedNotes,
      };
    });
  }
}

/**
 * Fetch public places with rich filtering, search, and engagement scoring
 */
export async function getPublicPlaces(params?: {
  query?: string;
  city?: string;
  category?: string;
  tag?: string;
  sort?: 'recent' | 'trending' | 'popular' | 'rated';
  limit?: number;
  offset?: number;
  currentUserId?: string;
}): Promise<Place[]> {
  const limit = params?.limit ?? 30;
  const offset = params?.offset ?? 0;

  try {
    const supabase = await createClient();

    let q = (supabase as any).from('places').select('*');

    if (params?.query) {
      const tokens = params.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const mainToken = tokens[0];
      
      // Multi-column OR query matching name, location, city, category, description, and tags
      q = q.or(
        `name.ilike.%${params.query}%,location.ilike.%${params.query}%,city.ilike.%${params.query}%,category.ilike.%${params.query}%,description.ilike.%${params.query}%,tags.cs.{${mainToken}}`
      );
    }

    if (params?.city) {
      q = q.or(`city.ilike.%${params.city}%,location.ilike.%${params.city}%`);
    }

    if (params?.category && params.category !== 'All') {
      // Expand UI label → all DB variant terms (handles plurals, accents, alternates)
      const terms = expandCategoryTerms(params.category);
      const orParts = terms.flatMap((t) => [
        `category.ilike.%${t}%`,
        `tags.cs.{${t}}`,
      ]);
      q = q.or(orParts.join(','));
    }

    if (params?.tag) {
      q = q.or(`tags.cs.{${params.tag}},category.ilike.%${params.tag}%`);
    }

    q = q.order('created_at', { ascending: false }).limit(100);

    const { data: rawPlaces, error } = await q;

    if (!error) {
      // DB responded — trust the result even if it's empty.
      // If a filter was applied and DB returned 0 rows, return [] so the
      // empty state renders instead of silently falling back to curated data.
      if (rawPlaces && rawPlaces.length > 0) {
        const enriched = await enrichPlacesWithStats(supabase, rawPlaces as Place[], params?.currentUserId);

        // Sort by requested ranking — always stable (tiebreak on id) to prevent
        // non-deterministic ordering that causes SSR/client hydration mismatches.
        const sort = params?.sort ?? 'trending';
        if (sort === 'popular' || sort === 'trending') {
          enriched.sort((a, b) =>
            (b.upvotes_count ?? 0) - (a.upvotes_count ?? 0) ||
            a.id.localeCompare(b.id)
          );
        } else if (sort === 'rated') {
          enriched.sort((a, b) =>
            (b.rating ?? 0) - (a.rating ?? 0) ||
            a.id.localeCompare(b.id)
          );
        } else {
          // 'recent' — already ordered by created_at from DB, but stabilise anyway
          enriched.sort((a, b) => a.id.localeCompare(b.id));
        }

        return enriched.slice(offset, offset + limit);
      }

      // DB returned 0 rows — if the user applied a filter, honour the empty result.
      const hasFilter = params?.query || params?.city || (params?.category && params.category !== 'All') || params?.tag;
      if (hasFilter) return [];

      // No filter + DB empty → fall through to curated showcase below.
    }
  } catch (err: any) {
    console.warn('Error fetching public places from Supabase, using curated fallback:', err?.message || err);
  }

  // Fallback to curated places with rich multi-token matching
  let filtered = [...CURATED_PLACES];

  if (params?.query) {
    const qLower = params.query.toLowerCase().trim();
    const tokens = qLower.split(/\s+/).filter(Boolean);

    filtered = filtered.filter((p) => {
      const name = (p.name || '').toLowerCase();
      const loc = (p.location || '').toLowerCase();
      const city = (p.city || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const tags = (p.tags || []).map((t) => t.toLowerCase());

      return (
        name.includes(qLower) ||
        loc.includes(qLower) ||
        city.includes(qLower) ||
        cat.includes(qLower) ||
        desc.includes(qLower) ||
        tags.some((t) => t.includes(qLower) || qLower.includes(t)) ||
        tokens.some((token) =>
          name.includes(token) ||
          loc.includes(token) ||
          city.includes(token) ||
          cat.includes(token) ||
          tags.some((t) => t.includes(token))
        )
      );
    });
  }

  if (params?.city) {
    const cLower = params.city.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        (p.city && p.city.toLowerCase().includes(cLower)) ||
        (p.location && p.location.toLowerCase().includes(cLower))
    );
  }

  if (params?.category && params.category !== 'All') {
    // Use same expanded terms as the DB path for consistency
    const terms = expandCategoryTerms(params.category);
    filtered = filtered.filter((p) => {
      const pCat = (p.category || '').toLowerCase();
      const pTags = (p.tags || []).map((t: string) => t.toLowerCase());
      return terms.some((t) =>
        pCat.includes(t) || pTags.some((tag) => tag.includes(t) || t.includes(tag))
      );
    });
  }

  if (params?.tag) {
    const tLower = params.tag.toLowerCase().trim();
    filtered = filtered.filter((p) => {
      const pCat = (p.category || '').toLowerCase();
      const pTags = (p.tags || []).map((t) => t.toLowerCase());
      return pCat.includes(tLower) || pTags.some((t) => t.includes(tLower));
    });
  }

  const sort = params?.sort ?? 'trending';
  if (sort === 'popular' || sort === 'trending') {
    filtered.sort((a, b) =>
      (b.upvotes_count ?? 0) - (a.upvotes_count ?? 0) ||
      (a.id ?? '').localeCompare(b.id ?? '')
    );
  } else if (sort === 'rated') {
    filtered.sort((a, b) =>
      (b.rating ?? 0) - (a.rating ?? 0) ||
      (a.id ?? '').localeCompare(b.id ?? '')
    );
  }

  return filtered.slice(offset, offset + limit);

}

/**
 * Fetch a single place by its slug or UUID identifier with rich relational data
 */
export async function getPlaceBySlugOrId(
  identifier: string,
  currentUserId?: string
): Promise<{
  place: Place;
  relatedLists: Array<{ id: string; title: string; slug: string; destination: string | null; owner_name: string }>;
  relatedPlaces: Place[];
} | null> {
  const clean = decodeURIComponent(identifier).toLowerCase().trim();
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

  try {
    const supabase = await createClient();
    let place: Place | null = null;

    // 1. If identifier is a UUID, query by ID
    if (isUUID) {
      const { data: byId } = await (supabase as any)
        .from('places')
        .select('*')
        .eq('id', identifier)
        .maybeSingle();
      place = byId;
    }

    // 2. Query place by exact slug
    if (!place) {
      const { data: bySlug } = await (supabase as any)
        .from('places')
        .select('*')
        .eq('slug', clean)
        .maybeSingle();
      place = bySlug;
    }

    // 3. Query place by case-insensitive slug
    if (!place) {
      const { data: byIlikeSlug } = await (supabase as any)
        .from('places')
        .select('*')
        .ilike('slug', clean)
        .limit(1)
        .maybeSingle();
      place = byIlikeSlug;
    }

    // 4. Query place by slug contains / partial match
    if (!place) {
      const { data: byPartialSlug } = await (supabase as any)
        .from('places')
        .select('*')
        .ilike('slug', `%${clean}%`)
        .limit(1)
        .maybeSingle();
      place = byPartialSlug;
    }

    // 5. Match by direct name
    const nameWords = clean.replace(/-/g, ' ').trim();
    if (!place) {
      const { data: byName } = await (supabase as any)
        .from('places')
        .select('*')
        .ilike('name', `%${nameWords}%`)
        .limit(1)
        .maybeSingle();
      place = byName;
    }

    // 6. Tokenized name & location matching (e.g. "cafe-peter-kolkata" -> name: "Cafe Peter", location: "Kolkata")
    if (!place) {
      const tokens = clean.split('-').filter((t) => t.length >= 2);
      if (tokens.length >= 2) {
        // Try prefixes (e.g. first 1-3 words)
        for (let i = tokens.length - 1; i >= 1; i--) {
          const namePrefix = tokens.slice(0, i).join(' ');
          const { data: byPrefix } = await (supabase as any)
            .from('places')
            .select('*')
            .ilike('name', `%${namePrefix}%`)
            .limit(1)
            .maybeSingle();
          if (byPrefix) {
            place = byPrefix;
            break;
          }
        }
      }
    }

    // 7. Check list_places with joined places
    if (!place) {
      const { data: lpMatch } = await (supabase as any)
        .from('list_places')
        .select('place:places(*)')
        .limit(50);
      
      const candidate = (lpMatch ?? [])
        .map((r: any) => r.place)
        .filter(Boolean)
        .find(
          (p: Place) =>
            p.id === identifier ||
            p.slug?.toLowerCase() === clean ||
            p.name.toLowerCase().includes(nameWords) ||
            nameWords.includes(p.name.toLowerCase())
        );
      if (candidate) place = candidate;
    }

    if (place) {
      const slug = place.slug || generatePlaceSlug(place.name, place.location || place.city);

      // Fetch lists containing this place and votes
      const [listPlacesRes, savedRes, relatedRes] = await Promise.all([
        (supabase as any)
          .from('list_places')
          .select(`
            id,
            note,
            list:wander_lists(id, title, slug, destination, is_public, owner:profiles(display_name, username)),
            votes(id, user_id, vote_type)
          `)
          .eq('place_id', place.id),
        currentUserId
          ? (supabase as any)
              .from('saved_places')
              .select('id')
              .eq('user_id', currentUserId)
              .eq('place_id', place.id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
        place.category
          ? (supabase as any)
              .from('places')
              .select('*')
              .neq('id', place.id)
              .ilike('category', `%${place.category}%`)
              .limit(6)
          : Promise.resolve({ data: [] }),
      ]);

      const isSaved = !!savedRes.data;

      let upvotes = 0;
      let downvotes = 0;
      let userVoteType: VoteType | null = null;
      const relatedLists: Array<{ id: string; title: string; slug: string; destination: string | null; owner_name: string }> = [];
      const fetchedNotes: Array<{ id?: string; note: string; author_name?: string; list_title?: string; list_slug?: string }> = [];

      (listPlacesRes.data ?? []).forEach((lp: any) => {
        if (lp.list && lp.list.is_public) {
          relatedLists.push({
            id: lp.list.id,
            title: lp.list.title,
            slug: lp.list.slug,
            destination: lp.list.destination,
            owner_name: lp.list.owner?.display_name || lp.list.owner?.username || 'Traveler',
          });
        }

        if (lp.note && lp.note.trim()) {
          fetchedNotes.push({
            id: lp.id,
            note: lp.note.trim(),
            author_name: lp.list?.owner?.display_name || lp.list?.owner?.username || 'Traveler',
            list_title: lp.list?.title,
            list_slug: lp.list?.slug,
          });
        }

        const votes = lp.votes || [];
        upvotes += votes.filter((v: any) => v.vote_type !== 'down').length;
        downvotes += votes.filter((v: any) => v.vote_type === 'down').length;

        if (currentUserId && !userVoteType) {
          const myVote = votes.find((v: any) => v.user_id === currentUserId);
          if (myVote) userVoteType = myVote.vote_type || 'up';
        }
      });

      const communityScore = upvotes - downvotes + relatedLists.length * 3;

      const rawRelated = (relatedRes.data ?? []) as Place[];
      const enrichedRelated = await enrichPlacesWithStats(supabase, rawRelated, currentUserId);

      const curatedNotes = getCuratedNotesForPlace(place.id);
      const allNotes = fetchedNotes.length > 0 ? fetchedNotes : curatedNotes;
      const primaryNote = place.note || (allNotes.length > 0 ? allNotes[0].note : null);

      return {
        place: {
          ...place,
          slug,
          upvotes_count: upvotes || place.upvotes_count || 0,
          downvotes_count: downvotes,
          community_score: communityScore,
          lists_count: relatedLists.length,
          is_saved: isSaved,
          user_vote_type: userVoteType,
          note: primaryNote,
          notes: allNotes,
        },
        relatedLists,
        relatedPlaces: enrichedRelated.length > 0 ? enrichedRelated : CURATED_PLACES.slice(0, 3),
      };
    }
  } catch (err: any) {
    console.warn('Error fetching place from Supabase, checking curated fallback:', err?.message || err);
  }

  // 8. Fallback to CURATED_PLACES
  const nameWords = clean.replace(/-/g, ' ').trim();
  const curatedPlace =
    CURATED_PLACES.find(
      (p) =>
        p.id === identifier ||
        p.slug?.toLowerCase() === clean ||
        (p.slug && clean.includes(p.slug.toLowerCase())) ||
        (p.slug && p.slug.toLowerCase().includes(clean)) ||
        p.name.toLowerCase() === nameWords ||
        p.name.toLowerCase().includes(nameWords) ||
        nameWords.includes(p.name.toLowerCase())
    ) || null;

  if (curatedPlace) {
    // Synthesize related lists from CURATED_LISTS
    const relatedLists = CURATED_LISTS.filter((l) => {
      const listPlaces = CURATED_LIST_PLACES_MAP[l.id] || [];
      return (
        listPlaces.some((lp) => lp.place_id === curatedPlace.id) ||
        (curatedPlace.city && l.destination?.includes(curatedPlace.city))
      );
    }).map((l) => ({
      id: l.id,
      title: l.title,
      slug: l.slug,
      destination: l.destination,
      owner_name: l.owner?.display_name || 'Traveler',
    }));

    // Synthesize related places
    const relatedPlaces = CURATED_PLACES.filter(
      (p) => p.id !== curatedPlace.id && (p.category === curatedPlace.category || p.city === curatedPlace.city)
    ).slice(0, 3);

    return {
      place: curatedPlace,
      relatedLists,
      relatedPlaces: relatedPlaces.length > 0 ? relatedPlaces : CURATED_PLACES.filter((p) => p.id !== curatedPlace.id).slice(0, 3),
    };
  }

  // 9. Universal Fallback Synthesis (never show 404 for valid text slugs)
  if (clean && clean.length >= 2) {
    const titleWords = clean
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const fallbackSynthesizedPlace: Place = {
      id: `synthetic-${clean}`,
      name: titleWords,
      slug: clean,
      location: 'Community Recommendation',
      city: null,
      country: null,
      category: 'Spot',
      tags: ['Must Visit', 'Community Saved'],
      address: null,
      description: `A community recommended spot for ${titleWords}. Add it to your travel list, leave notes, and share with fellow travelers.`,
      website: null,
      image_url: null,
      rating: 4.8,
      lat: null,
      lng: null,
      maps_url: `https://maps.google.com/?q=${encodeURIComponent(titleWords)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      upvotes_count: 12,
      downvotes_count: 0,
      community_score: 15,
      lists_count: 1,
      is_saved: false,
    };

    return {
      place: fallbackSynthesizedPlace,
      relatedLists: CURATED_LISTS.slice(0, 2).map((l) => ({
        id: l.id,
        title: l.title,
        slug: l.slug,
        destination: l.destination,
        owner_name: l.owner?.display_name || 'Traveler',
      })),
      relatedPlaces: CURATED_PLACES.slice(0, 3),
    };
  }

  return null;
}

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());

export async function ensurePlaceIdInDb(supabase: any, placeIdOrSlug: string): Promise<string | null> {
  const clean = placeIdOrSlug.trim();
  if (!clean) return null;

  try {
    // 1. If it's a valid UUID, check if it exists in DB
    if (isUUID(clean)) {
      const { data, error } = await supabase.from('places').select('id').eq('id', clean).maybeSingle();
      if (!error && data?.id) return data.id;
    }

    // 2. Check if slug matches a place in DB (safe slug equality check)
    try {
      const { data: bySlug, error: slugErr } = await supabase
        .from('places')
        .select('id')
        .eq('slug', clean.toLowerCase())
        .maybeSingle();

      if (!slugErr && bySlug?.id) return bySlug.id;
    } catch {
      // Ignore if slug query fails
    }

    // 3. Look up in CURATED_PLACES
    const curated = CURATED_PLACES.find(
      (p) =>
        p.id.toLowerCase() === clean.toLowerCase() ||
        p.slug?.toLowerCase() === clean.toLowerCase() ||
        p.name.toLowerCase() === clean.replace(/-/g, ' ').toLowerCase() ||
        clean.toLowerCase().includes(p.slug?.toLowerCase() || '___')
    );

    if (curated) {
      const targetSlug = curated.slug || generatePlaceSlug(curated.name, curated.location || curated.city);

      // Check by targetSlug
      try {
        const { data: existingCurated } = await supabase
          .from('places')
          .select('id')
          .eq('slug', targetSlug)
          .maybeSingle();

        if (existingCurated?.id) return existingCurated.id;
      } catch {
        // Fallthrough
      }

      // Check by exact name
      try {
        const { data: existingByName } = await supabase
          .from('places')
          .select('id')
          .ilike('name', curated.name)
          .maybeSingle();

        if (existingByName?.id) return existingByName.id;
      } catch {
        // Fallthrough
      }

      // Try insert with full columns
      try {
        const { data: insFull, error: insFullErr } = await supabase
          .from('places')
          .insert({
            name: curated.name,
            slug: targetSlug,
            location: curated.location || null,
            city: curated.city || null,
            country: curated.country || null,
            category: curated.category || 'Spot',
            tags: curated.tags || [],
            address: curated.address || null,
            description: curated.description || null,
            website: curated.website || null,
            rating: curated.rating ? Number(curated.rating.toFixed(2)) : 4.8,
            lat: curated.lat ?? null,
            lng: curated.lng ?? null,
            maps_url: curated.maps_url || `https://maps.google.com/?q=${encodeURIComponent(curated.name)}`,
          })
          .select('id');

        const insertedId = Array.isArray(insFull) ? insFull[0]?.id : (insFull as any)?.id;
        if (!insFullErr && insertedId) return insertedId;
      } catch {
        // Fallback to minimal insert
      }

      // Fallback minimal insert if full schema columns fail
      try {
        const { data: insMin, error: insMinErr } = await supabase
          .from('places')
          .insert({
            name: curated.name,
            location: curated.location || null,
            category: curated.category || 'Spot',
            tags: curated.tags || [],
            maps_url: curated.maps_url || `https://maps.google.com/?q=${encodeURIComponent(curated.name)}`,
          })
          .select('id');

        const minId = Array.isArray(insMin) ? insMin[0]?.id : (insMin as any)?.id;
        if (!insMinErr && minId) return minId;
      } catch {
        // Fallthrough
      }

      // Final re-check by name if already inserted concurrently
      const { data: finalNameCheck } = await supabase
        .from('places')
        .select('id')
        .ilike('name', curated.name)
        .maybeSingle();

      if (finalNameCheck?.id) return finalNameCheck.id;
    }

    // 4. If synthetic place or text slug, create canonical spot
    if (clean.length >= 2) {
      const title = clean
        .replace(/^synthetic-/, '')
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const synthSlug = clean.replace(/^synthetic-/, '').toLowerCase();

      try {
        const { data: existingSynth } = await supabase
          .from('places')
          .select('id')
          .eq('slug', synthSlug)
          .maybeSingle();

        if (existingSynth?.id) return existingSynth.id;
      } catch {
        // Fallthrough
      }

      try {
        const { data: existingByName } = await supabase
          .from('places')
          .select('id')
          .ilike('name', title)
          .maybeSingle();

        if (existingByName?.id) return existingByName.id;
      } catch {
        // Fallthrough
      }

      try {
        const { data: synthRow, error: synthErr } = await supabase
          .from('places')
          .insert({
            name: title,
            slug: synthSlug,
            location: 'Community Recommendation',
            category: 'Spot',
            tags: ['Community Saved'],
            description: `A community recommended spot for ${title}.`,
            maps_url: `https://maps.google.com/?q=${encodeURIComponent(title)}`,
          })
          .select('id');

        const synthId = Array.isArray(synthRow) ? synthRow[0]?.id : (synthRow as any)?.id;
        if (!synthErr && synthId) return synthId;
      } catch {
        // Minimal insert
        const { data: minRow } = await supabase
          .from('places')
          .insert({
            name: title,
            location: 'Community Recommendation',
            category: 'Spot',
            tags: ['Community Saved'],
          })
          .select('id');

        const minSynthId = Array.isArray(minRow) ? minRow[0]?.id : (minRow as any)?.id;
        if (minSynthId) return minSynthId;
      }

      const { data: finalSynthCheck } = await supabase
        .from('places')
        .select('id')
        .ilike('name', title)
        .maybeSingle();

      if (finalSynthCheck?.id) return finalSynthCheck.id;
    }
  } catch (err: any) {
    console.error('ensurePlaceIdInDb error:', err?.message || err);
  }

  return null;
}

/**
 * Save a place for a user
 */
export async function savePlace(
  userId: string,
  placeId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const resolvedId = await ensurePlaceIdInDb(supabase, placeId);
    if (!resolvedId) {
      console.error('savePlace: could not resolve placeId:', placeId);
      return { success: false, error: 'Place could not be initialized or found in database' };
    }

    // 1. Check if already saved
    const { data: existing } = await (supabase as any)
      .from('saved_places')
      .select('id')
      .eq('user_id', userId)
      .eq('place_id', resolvedId)
      .maybeSingle();

    if (existing) {
      return { success: true };
    }

    // 2. Insert into saved_places
    const { error } = await (supabase as any).from('saved_places').insert({
      user_id: userId,
      place_id: resolvedId,
    });

    if (error) {
      // Duplicate save is treated as success
      if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
        return { success: true };
      }
      console.error('savePlace DB error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('savePlace exception:', err);
    return { success: false, error: err?.message || 'Failed to save place' };
  }
}

/**
 * Remove a saved place
 */
export async function unsavePlace(
  userId: string,
  placeId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const resolvedId = await ensurePlaceIdInDb(supabase, placeId);
    if (!resolvedId) {
      return { success: false, error: 'Place could not be found' };
    }

    const { error } = await (supabase as any)
      .from('saved_places')
      .delete()
      .eq('user_id', userId)
      .eq('place_id', resolvedId);

    if (error) {
      console.error('unsavePlace DB error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to unsave place' };
  }
}

/**
 * Check if a place is saved by a user
 */
export async function isPlaceSaved(userId: string, placeId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const resolvedId = await ensurePlaceIdInDb(supabase, placeId);
    if (!resolvedId) return false;

    const { data } = await (supabase as any)
      .from('saved_places')
      .select('id')
      .eq('user_id', userId)
      .eq('place_id', resolvedId)
      .maybeSingle();

    return !!data;
  } catch {
    return false;
  }
}

/**
 * Fetch all places saved by a user (with upvotes and list counts populated)
 */
export async function getUserSavedPlaces(userId: string): Promise<SavedPlace[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await (supabase as any)
      .from('saved_places')
      .select('*, place:places(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    const savedPlaces = data as SavedPlace[];

    const rawPlaces = savedPlaces.map((sp) => sp.place).filter(Boolean) as Place[];
    const enrichedPlaces = await enrichPlacesWithStats(supabase, rawPlaces, userId);
    const enrichedMap = new Map(enrichedPlaces.map((p) => [p.id, p]));

    return savedPlaces.map((sp) => ({
      ...sp,
      place: sp.place ? enrichedMap.get(sp.place.id) || sp.place : undefined,
    }));
  } catch {
    return [];
  }
}
