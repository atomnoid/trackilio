import { createClient } from '@/lib/supabase/server';
import { getBlendInterpretation, calculateRawBlendScore } from '@/lib/blend.utils';
export { getBlendInterpretation } from '@/lib/blend.utils';
import { BlendSession, Profile, WanderList, ListPlace } from '@/types/database';

export interface BlendResult {
  score: number;
  label: string;
  sharedPlaces: Array<{ name: string; destination?: string }>;
  sharedDestinations: string[];
  sharedCategories: string[];
  userA: Profile;
  userB: Profile;
}



import { sanitizeUsername } from '@/lib/username';

export async function calculateAndCreateBlend(
  userAIdentifier: string,
  userBIdentifier: string
): Promise<{ blendId?: string; result?: BlendResult; error?: string }> {
  try {
    const supabase = await createClient();

    const cleanA = sanitizeUsername(userAIdentifier);
    const cleanB = sanitizeUsername(userBIdentifier);

    // Fetch Profile A
    let userA: any = null;
    if (userAIdentifier.includes('-') && userAIdentifier.length === 36) {
      const { data } = await (supabase as any).from('profiles').select('*').eq('id', userAIdentifier).maybeSingle();
      userA = data;
    }
    if (!userA && cleanA) {
      const { data } = await (supabase as any).from('profiles').select('*').eq('username', cleanA).maybeSingle();
      userA = data;
    }

    // Fetch Profile B
    let userB: any = null;
    if (userBIdentifier.includes('-') && userBIdentifier.length === 36) {
      const { data } = await (supabase as any).from('profiles').select('*').eq('id', userBIdentifier).maybeSingle();
      userB = data;
    }
    if (!userB && cleanB) {
      const { data } = await (supabase as any).from('profiles').select('*').eq('username', cleanB).maybeSingle();
      userB = data;
    }

    if (!userA || !userB) {
      return { error: 'One or both travelers could not be found. Please double check the @username.' };
    }

    if (userA.id === userB.id) {
      return { error: 'You cannot Blend with yourself!' };
    }

    // PRIVACY SECURITY BOUNDARY: Fetch ONLY PUBLIC lists for both users
    const { data: listsA } = await (supabase as any)
      .from('wander_lists')
      .select('id, destination')
      .eq('owner_id', userA.id)
      .eq('is_public', true);

    const { data: listsB } = await (supabase as any)
      .from('wander_lists')
      .select('id, destination')
      .eq('owner_id', userB.id)
      .eq('is_public', true);

    const listIdsA = (listsA ?? []).map((l: any) => l.id);
    const listIdsB = (listsB ?? []).map((l: any) => l.id);

    // Fetch places contained inside public lists
    let placesA: any[] = [];
    let placesB: any[] = [];

    if (listIdsA.length > 0) {
      const { data } = await (supabase as any)
        .from('list_places')
        .select('*, place:places(*)')
        .in('list_id', listIdsA);
      placesA = data ?? [];
    }

    if (listIdsB.length > 0) {
      const { data } = await (supabase as any)
        .from('list_places')
        .select('*, place:places(*)')
        .in('list_id', listIdsB);
      placesB = data ?? [];
    }

    // 1. Calculate Place Overlap (40%)
    const placeNamesA = new Set(placesA.map((p) => p.place?.name?.toLowerCase()).filter(Boolean));
    const sharedPlacesMap = new Map<string, { name: string; destination?: string }>();

    placesB.forEach((p) => {
      const nameLower = p.place?.name?.toLowerCase();
      if (nameLower && placeNamesA.has(nameLower)) {
        sharedPlacesMap.set(nameLower, {
          name: p.place.name,
          destination: p.place.location || p.place.country || undefined,
        });
      }
    });

    const sharedPlaces = Array.from(sharedPlacesMap.values());

    // 2. Calculate Destination Overlap (20%)
    const destsA = new Set(
      (listsA ?? []).map((l: any) => l.destination?.toLowerCase()).filter(Boolean)
    );
    const sharedDestsSet = new Set<string>();
    (listsB ?? []).forEach((l: any) => {
      if (l.destination && destsA.has(l.destination.toLowerCase())) {
        sharedDestsSet.add(l.destination);
      }
    });
    const sharedDestinations = Array.from(sharedDestsSet);

    // 3. Calculate Category Overlap (20%)
    const catsA = new Set(placesA.map((p) => p.place?.category?.toLowerCase()).filter(Boolean));
    const sharedCatsSet = new Set<string>();
    placesB.forEach((p) => {
      if (p.place?.category && catsA.has(p.place.category.toLowerCase())) {
        sharedCatsSet.add(p.place.category);
      }
    });
    const sharedCategories = Array.from(sharedCatsSet);

    // Calculate score (0-100) using shared pure function
    const score = calculateRawBlendScore({
      sharedPlacesCount: sharedPlaces.length,
      sharedDestinationsCount: sharedDestinations.length,
      sharedCategoriesCount: sharedCategories.length,
    });

    // Save blend session
    const { data: newSession, error: blendErr } = await (supabase as any)
      .from('blend_sessions')
      .insert({
        user_a_id: userA.id,
        user_b_id: userB.id,
        score,
        shared_places: sharedPlaces,
        shared_destinations: sharedDestinations,
      })
      .select('id')
      .single();

    if (blendErr) return { error: blendErr.message };

    return {
      blendId: newSession.id,
      result: {
        score,
        label: getBlendInterpretation(score),
        sharedPlaces,
        sharedDestinations,
        sharedCategories,
        userA,
        userB,
      },
    };
  } catch (err: any) {
    return { error: err?.message || 'Failed to generate Blend' };
  }
}

export async function getBlendSession(blendId: string): Promise<BlendResult | null> {
  try {
    const supabase = await createClient();
    const { data: session, error } = await (supabase as any)
      .from('blend_sessions')
      .select('*, user_a:profiles!user_a_id(*), user_b:profiles!user_b_id(*)')
      .eq('id', blendId)
      .maybeSingle();

    if (error || !session || !session.user_a || !session.user_b) return null;

    return {
      score: session.score,
      label: getBlendInterpretation(session.score),
      sharedPlaces: session.shared_places || [],
      sharedDestinations: session.shared_destinations || [],
      sharedCategories: [],
      userA: session.user_a,
      userB: session.user_b,
    };
  } catch {
    return null;
  }
}
