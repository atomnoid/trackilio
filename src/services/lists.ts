import { createClient } from '@/lib/supabase/server';
import { WanderList } from '@/types/database';
import { CURATED_LISTS } from '@/services/curatedData';

export function generateSlug(title: string): string {
  const clean = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return clean || 'wanderlist';
}

export async function getUniqueSlug(baseTitle: string): Promise<string> {
  const supabase = await createClient();
  const slug = generateSlug(baseTitle);

  try {
    const { data } = await (supabase as any)
      .from('wander_lists')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (!data) return slug;

    const randomSuffix = Math.random().toString(36).substring(2, 6);
    return `${slug}-${randomSuffix}`;
  } catch {
    return slug;
  }
}

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());

export async function ensureListIdInDb(supabase: any, listIdOrSlug: string): Promise<string | null> {
  const clean = listIdOrSlug.trim();
  if (isUUID(clean)) {
    const { data } = await supabase.from('wander_lists').select('id').eq('id', clean).maybeSingle();
    if (data) return data.id;
  }

  const { data: bySlug } = await supabase
    .from('wander_lists')
    .select('id')
    .or(`slug.eq.${clean},id.eq.${clean}`)
    .maybeSingle();

  if (bySlug) return bySlug.id;

  const curated = CURATED_LISTS.find(
    (l) => l.id === clean || l.slug === clean || l.slug.toLowerCase() === clean.toLowerCase()
  );

  if (curated) {
    const { data: existingCurated } = await supabase
      .from('wander_lists')
      .select('id')
      .eq('slug', curated.slug)
      .maybeSingle();

    if (existingCurated) return existingCurated.id;

    const { data: insertedList } = await supabase
      .from('wander_lists')
      .insert({
        title: curated.title,
        slug: curated.slug,
        description: curated.description,
        destination: curated.destination,
        cover_image: curated.cover_image,
        is_public: true,
      })
      .select('id')
      .maybeSingle();

    if (insertedList) return insertedList.id;
  }

  return null;
}

/**
 * Helper to enrich WanderLists with places_count
 */
async function enrichListsWithCounts(
  supabase: any,
  lists: WanderList[]
): Promise<WanderList[]> {
  if (lists.length === 0) return [];
  const listIds = lists.map((l) => l.id);

  try {
    const { data: lpData } = await supabase
      .from('list_places')
      .select('list_id')
      .in('list_id', listIds);

    const countMap = new Map<string, number>();
    (lpData ?? []).forEach((row: { list_id: string }) => {
      countMap.set(row.list_id, (countMap.get(row.list_id) ?? 0) + 1);
    });

    return lists.map((l) => ({
      ...l,
      places_count: countMap.get(l.id) ?? l.places_count ?? 0,
    }));
  } catch {
    return lists;
  }
}

export async function getPublicWanderLists(params?: {
  destination?: string;
  query?: string;
  limit?: number;
  offset?: number;
  sort?: 'recent' | 'trending' | 'popular';
}): Promise<WanderList[]> {
  const limit = params?.limit ?? 24;
  const offset = params?.offset ?? 0;

  try {
    const supabase = await createClient();

    let q = (supabase as any)
      .from('wander_lists')
      .select('*, owner:profiles(*)')
      .eq('is_public', true);

    if (params?.destination) {
      q = q.ilike('destination', `%${params.destination}%`);
    }
    if (params?.query) {
      q = q.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%`);
    }

    if (params?.sort === 'popular') {
      // Popular: rank by net engagement (upvotes - downvotes)
      q = q.order('created_at', { ascending: false }).limit(200);
      const { data, error } = await q;

      if (!error && data && data.length > 0) {
        const lists = data as WanderList[];
        const listIds = lists.map((l: WanderList) => l.id);

        const voteResult = await (supabase as any)
          .from('list_places')
          .select('list_id, votes(vote_type)')
          .in('list_id', listIds);

        const engagementMap = new Map<string, number>();
        (voteResult.data ?? []).forEach((lp: any) => {
          const votes: any[] = lp.votes || [];
          const net =
            votes.filter((v: any) => v.vote_type !== 'down').length -
            votes.filter((v: any) => v.vote_type === 'down').length;
          engagementMap.set(lp.list_id, (engagementMap.get(lp.list_id) ?? 0) + net);
        });

        const sorted = [...lists].sort(
          (a: WanderList, b: WanderList) =>
            (engagementMap.get(b.id) ?? 0) - (engagementMap.get(a.id) ?? 0)
        ).slice(offset, offset + limit);

        return await enrichListsWithCounts(supabase, sorted);
      }
    } else if (params?.sort === 'trending') {
      q = q.order('updated_at', { ascending: false });
    } else {
      q = q.order('created_at', { ascending: false });
    }

    q = q.limit(limit);
    if (offset > 0) {
      q = q.range(offset, offset + limit - 1);
    }

    const { data, error } = await q;
    if (!error && data && data.length > 0) {
      const lists = data as WanderList[];
      return await enrichListsWithCounts(supabase, lists);
    }
  } catch (err: any) {
    console.warn('Error connecting to Supabase for WanderLists, using curated fallback:', err?.message || err);
  }

  // Fallback to CURATED_LISTS
  let filtered = [...CURATED_LISTS];

  if (params?.destination) {
    const dLower = params.destination.toLowerCase();
    filtered = filtered.filter(
      (l) => l.destination && l.destination.toLowerCase().includes(dLower)
    );
  }

  if (params?.query) {
    const qLower = params.query.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(qLower) ||
        (l.description && l.description.toLowerCase().includes(qLower)) ||
        (l.destination && l.destination.toLowerCase().includes(qLower))
    );
  }

  return filtered.slice(offset, offset + limit);
}

export async function getWanderListBySlug(slugOrId: string): Promise<WanderList | null> {
  const cleanParam = decodeURIComponent(slugOrId).trim().toLowerCase();
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId.trim());

  try {
    const supabase = await createClient();
    let data: WanderList | null = null;

    // 1. If it's a UUID, check by ID
    if (isUUID) {
      const { data: byIdData } = await (supabase as any)
        .from('wander_lists')
        .select('*, owner:profiles(*)')
        .eq('id', slugOrId.trim())
        .maybeSingle();
      data = byIdData;
    }

    // 2. Try matching by exact slug
    if (!data) {
      const { data: bySlugData } = await (supabase as any)
        .from('wander_lists')
        .select('*, owner:profiles(*)')
        .eq('slug', cleanParam)
        .maybeSingle();
      data = bySlugData;
    }

    // 3. Try case-insensitive slug match
    if (!data) {
      const { data: byIlikeSlug } = await (supabase as any)
        .from('wander_lists')
        .select('*, owner:profiles(*)')
        .ilike('slug', cleanParam)
        .limit(1)
        .maybeSingle();
      data = byIlikeSlug;
    }

    if (data) {
      const enriched = await enrichListsWithCounts(supabase, [data as WanderList]);
      return enriched[0] || data;
    }
  } catch (err: any) {
    console.warn('getWanderListBySlug error, falling back to curated:', err?.message || err);
  }

  // Fallback to CURATED_LISTS
  const curated =
    CURATED_LISTS.find(
      (l) =>
        l.id === slugOrId.trim() ||
        l.slug.toLowerCase() === cleanParam ||
        cleanParam.includes(l.slug.toLowerCase()) ||
        l.slug.toLowerCase().includes(cleanParam)
    ) || null;

  return curated;
}


export async function getUserWanderLists(userId: string): Promise<WanderList[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('wander_lists')
      .select('*, owner:profiles(*)')
      .eq('owner_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.warn('Unable to fetch user WanderLists:', error.message || error);
      return [];
    }
    const lists = (data ?? []) as WanderList[];
    return await enrichListsWithCounts(supabase, lists);
  } catch (err: any) {
    console.warn('Error fetching user WanderLists:', err?.message || err);
    return [];
  }
}

export async function getUserCollaboratedLists(userId: string): Promise<WanderList[]> {
  try {
    const supabase = await createClient();

    // 1. Lists where user is invited as a collaborator (not the owner)
    const { data: memberRows } = await (supabase as any)
      .from('list_members')
      .select('list_id, wander_lists!inner(owner_id)')
      .eq('user_id', userId)
      .neq('wander_lists.owner_id', userId);

    const memberListIds = (memberRows ?? []).map((m: any) => m.list_id);

    // 2. Lists owned by user that have at least one OTHER collaborator member
    const { data: ownedMemberRows } = await (supabase as any)
      .from('list_members')
      .select('list_id, wander_lists!inner(owner_id)')
      .eq('wander_lists.owner_id', userId)
      .neq('user_id', userId);

    const ownedCollabIds = (ownedMemberRows ?? []).map((m: any) => m.list_id);
    const combinedIds = Array.from(new Set([...memberListIds, ...ownedCollabIds]));

    if (combinedIds.length === 0) return [];

    const { data: lists, error } = await (supabase as any)
      .from('wander_lists')
      .select('*, owner:profiles(*)')
      .in('id', combinedIds)
      .order('updated_at', { ascending: false });

    if (error || !lists) return [];
    return await enrichListsWithCounts(supabase, lists as WanderList[]);
  } catch (err: any) {
    console.warn('Error fetching collaborated lists:', err?.message || err);
    return [];
  }
}

export async function ensureListIdInDb(supabase: any, listIdOrSlug: string): Promise<string | null> {
  const clean = listIdOrSlug.trim();
  if (!clean) return null;

  try {
    // 1. If valid UUID, check in wander_lists
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean)) {
      const { data, error } = await supabase
        .from('wander_lists')
        .select('id')
        .eq('id', clean)
        .maybeSingle();

      if (!error && data?.id) return data.id;
    }

    // 2. Check by slug
    try {
      const { data: bySlug, error: slugErr } = await supabase
        .from('wander_lists')
        .select('id')
        .eq('slug', clean.toLowerCase())
        .maybeSingle();

      if (!slugErr && bySlug?.id) return bySlug.id;
    } catch {
      // Fallthrough
    }

    // 3. Look up in CURATED_LISTS
    const curated = CURATED_LISTS.find(
      (l) =>
        l.id.toLowerCase() === clean.toLowerCase() ||
        l.slug.toLowerCase() === clean.toLowerCase() ||
        clean.toLowerCase().includes(l.slug.toLowerCase()) ||
        l.slug.toLowerCase().includes(clean.toLowerCase())
    );

    if (curated) {
      // Check if already in DB by slug
      try {
        const { data: existingCurated } = await supabase
          .from('wander_lists')
          .select('id')
          .eq('slug', curated.slug)
          .maybeSingle();

        if (existingCurated?.id) return existingCurated.id;
      } catch {
        // Fallthrough
      }

      // Check by title
      try {
        const { data: existingByTitle } = await supabase
          .from('wander_lists')
          .select('id')
          .ilike('title', curated.title)
          .maybeSingle();

        if (existingByTitle?.id) return existingByTitle.id;
      } catch {
        // Fallthrough
      }

      // Try inserting curated list
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const ownerId = user?.id || curated.owner_id || null;

        if (ownerId) {
          const { data: insList, error: insErr } = await supabase
            .from('wander_lists')
            .insert({
              owner_id: ownerId,
              title: curated.title,
              slug: curated.slug,
              description: curated.description || null,
              destination: curated.destination || null,
              cover_image: curated.cover_image || null,
              is_public: true,
            })
            .select('id');

          const insId = Array.isArray(insList) ? insList[0]?.id : (insList as any)?.id;
          if (!insErr && insId) return insId;
        }
      } catch {
        // Fallthrough
      }

      const { data: finalCheck } = await supabase
        .from('wander_lists')
        .select('id')
        .ilike('title', curated.title)
        .maybeSingle();

      if (finalCheck?.id) return finalCheck.id;
    }
  } catch (err: any) {
    console.error('ensureListIdInDb error:', err?.message || err);
  }

  return null;
}

export async function isListSaved(userId: string, listId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const resolvedId = await ensureListIdInDb(supabase, listId);
    if (!resolvedId) return false;

    const { data } = await (supabase as any)
      .from('saved_lists')
      .select('id')
      .eq('user_id', userId)
      .eq('list_id', resolvedId)
      .maybeSingle();

    return !!data;
  } catch {
    return false;
  }
}

export async function toggleSaveList(
  userId: string,
  listId: string
): Promise<{ saved: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const resolvedId = await ensureListIdInDb(supabase, listId);
    if (!resolvedId) {
      return { saved: false, error: 'List could not be resolved' };
    }

    const { data: existing } = await (supabase as any)
      .from('saved_lists')
      .select('id')
      .eq('user_id', userId)
      .eq('list_id', resolvedId)
      .maybeSingle();

    if (existing) {
      const { error } = await (supabase as any)
        .from('saved_lists')
        .delete()
        .eq('id', existing.id);

      if (error) return { saved: true, error: error.message };
      return { saved: false };
    } else {
      const { error } = await (supabase as any)
        .from('saved_lists')
        .insert({
          user_id: userId,
          list_id: resolvedId,
        });

      if (error) return { saved: false, error: error.message };
      return { saved: true };
    }
  } catch (err: any) {
    return { saved: false, error: err?.message || 'Failed to toggle save list' };
  }
}

export async function getUserSavedLists(userId: string): Promise<WanderList[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('saved_lists')
      .select('list_id, wander_lists(*, owner:profiles(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    const lists = data.map((d: any) => d.wander_lists).filter(Boolean) as WanderList[];
    return await enrichListsWithCounts(supabase, lists);
  } catch {
    return [];
  }
}

export async function createWanderList(params: {
  ownerId: string;
  title: string;
  description?: string;
  destination?: string;
  coverImage?: string;
  isPublic: boolean;
}): Promise<{ slug?: string; error?: string }> {
  const supabase = await createClient();
  const slug = await getUniqueSlug(params.title);

  const { data, error } = await (supabase as any)
    .from('wander_lists')
    .insert({
      owner_id: params.ownerId,
      title: params.title,
      description: params.description || null,
      destination: params.destination || null,
      cover_image: params.coverImage || null,
      slug,
      is_public: params.isPublic,
    })
    .select('id, slug')
    .single();

  if (error) return { error: error.message };

  // Add owner as list_member
  await (supabase as any).from('list_members').insert({
    list_id: data.id,
    user_id: params.ownerId,
    role: 'owner',
  });

  return { slug: data.slug };
}

export async function updateWanderList(
  listId: string,
  updates: {
    title?: string;
    description?: string;
    destination?: string;
    isPublic?: boolean;
    coverImage?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.description !== undefined) payload.description = updates.description || null;
  if (updates.destination !== undefined) payload.destination = updates.destination || null;
  if (updates.isPublic !== undefined) payload.is_public = updates.isPublic;
  if (updates.coverImage !== undefined) payload.cover_image = updates.coverImage || null;

  const { error } = await (supabase as any)
    .from('wander_lists')
    .update(payload)
    .eq('id', listId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteWanderList(
  listId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await (supabase as any)
    .from('wander_lists')
    .delete()
    .eq('id', listId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
