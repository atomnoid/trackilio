import { createClient } from '@/lib/supabase/server';
import { ListPlace, Place, PriorityLevel, SavedPlace, VisitStatus, VoteType } from '@/types/database';

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

  if (error || !listPlaces) return [];

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
  try {
    const supabase = await createClient();
    const limit = params?.limit ?? 30;
    const offset = params?.offset ?? 0;

    let q = (supabase as any).from('places').select('*');

    if (params?.query) {
      q = q.or(`name.ilike.%${params.query}%,location.ilike.%${params.query}%,category.ilike.%${params.query}%`);
    }

    if (params?.city) {
      q = q.or(`city.ilike.%${params.city}%,location.ilike.%${params.city}%`);
    }

    if (params?.category && params.category !== 'All') {
      q = q.ilike('category', `%${params.category}%`);
    }

    if (params?.tag) {
      q = q.contains('tags', [params.tag]);
    }

    // Fetch batch of places
    q = q.order('created_at', { ascending: false }).limit(100);

    const { data: rawPlaces, error } = await q;

    if (error || !rawPlaces) {
      console.warn('Unable to query places from Supabase:', error?.message || error);
      return [];
    }

    if (rawPlaces.length === 0) return [];

    const placeIds = rawPlaces.map((p) => p.id);

    // Batch fetch list_places links to calculate list appearances and votes
    const [listPlacesRes, savedRes] = await Promise.all([
      (supabase as any)
        .from('list_places')
        .select(`
          place_id,
          list:wander_lists(is_public),
          votes(vote_type)
        `)
        .in('place_id', placeIds),
      params?.currentUserId
        ? (supabase as any)
            .from('saved_places')
            .select('place_id')
            .eq('user_id', params.currentUserId)
            .in('place_id', placeIds)
        : Promise.resolve({ data: [] }),
    ]);

    const userSavedSet = new Set((savedRes.data ?? []).map((s: any) => s.place_id));

    // Aggregate engagement per place
    const statsMap = new Map<
      string,
      { upvotes: number; downvotes: number; lists: number }
    >();

    (listPlacesRes.data ?? []).forEach((lp: any) => {
      const current = statsMap.get(lp.place_id) || {
        upvotes: 0,
        downvotes: 0,
        lists: 0,
      };

      if (lp.list?.is_public) {
        current.lists += 1;
      }

      const votes = lp.votes || [];
      const up = votes.filter((v: any) => v.vote_type !== 'down').length;
      const down = votes.filter((v: any) => v.vote_type === 'down').length;
      current.upvotes += up;
      current.downvotes += down;

      statsMap.set(lp.place_id, current);
    });

    const enriched = rawPlaces.map((p) => {
      const stats = statsMap.get(p.id) || { upvotes: 0, downvotes: 0, lists: 0 };
      const communityScore = stats.upvotes - stats.downvotes + stats.lists * 3;
      const slug = p.slug || generatePlaceSlug(p.name, p.location || p.city);

      return {
        ...p,
        slug,
        upvotes_count: stats.upvotes,
        downvotes_count: stats.downvotes,
        community_score: communityScore,
        lists_count: stats.lists,
        is_saved: userSavedSet.has(p.id),
      };
    });

    // Sort by requested ranking
    const sort = params?.sort ?? 'trending';
    if (sort === 'popular' || sort === 'trending') {
      enriched.sort((a, b) => (b.upvotes_count ?? 0) - (a.upvotes_count ?? 0));
    } else if (sort === 'rated') {
      enriched.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return enriched.slice(offset, offset + limit);
  } catch (err: any) {
    console.warn('Error fetching public places:', err?.message || err);
    return [];
  }
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
  try {
    const supabase = await createClient();
    const clean = identifier.toLowerCase().trim();

    // Query place by slug or ID
    let { data: place } = await (supabase as any)
      .from('places')
      .select('*')
      .eq('slug', clean)
      .maybeSingle();

    if (!place) {
      const { data: byId } = await (supabase as any)
        .from('places')
        .select('*')
        .eq('id', identifier)
        .maybeSingle();
      place = byId;
    }

    if (!place) return null;

    const slug = place.slug || generatePlaceSlug(place.name, place.location || place.city);

    // Fetch lists containing this place and votes
    const [listPlacesRes, savedRes, relatedRes] = await Promise.all([
      (supabase as any)
        .from('list_places')
        .select(`
          id,
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

      const votes = lp.votes || [];
      upvotes += votes.filter((v: any) => v.vote_type !== 'down').length;
      downvotes += votes.filter((v: any) => v.vote_type === 'down').length;

      if (currentUserId && !userVoteType) {
        const myVote = votes.find((v: any) => v.user_id === currentUserId);
        if (myVote) userVoteType = myVote.vote_type || 'up';
      }
    });

    const communityScore = upvotes - downvotes + relatedLists.length * 3;

    return {
      place: {
        ...place,
        slug,
        upvotes_count: upvotes,
        downvotes_count: downvotes,
        community_score: communityScore,
        lists_count: relatedLists.length,
        is_saved: isSaved,
        user_vote_type: userVoteType,
      },
      relatedLists,
      relatedPlaces: (relatedRes.data ?? []) as Place[],
    };
  } catch (err: any) {
    console.warn('Error fetching place by slug:', err?.message || err);
    return null;
  }
}

/**
 * Save a place for a user
 */
export async function savePlace(
  userId: string,
  placeId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await (supabase as any).from('saved_places').insert({
    user_id: userId,
    place_id: placeId,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * Remove a saved place
 */
export async function unsavePlace(
  userId: string,
  placeId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await (supabase as any)
    .from('saved_places')
    .delete()
    .eq('user_id', userId)
    .eq('place_id', placeId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * Check if a place is saved by a user
 */
export async function isPlaceSaved(userId: string, placeId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data } = await (supabase as any)
    .from('saved_places')
    .select('id')
    .eq('user_id', userId)
    .eq('place_id', placeId)
    .maybeSingle();

  return !!data;
}

/**
 * Fetch all places saved by a user
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
    return data as SavedPlace[];
  } catch {
    return [];
  }
}
