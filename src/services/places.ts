import { createClient } from '@/lib/supabase/server';
import { ListPlace, PriorityLevel, VisitStatus } from '@/types/database';

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
      votes(id, user_id),
      comments(*, profile:profiles(*))
    `)
    .eq('list_id', listId)
    .order('created_at', { ascending: true });

  if (error || !listPlaces) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return listPlaces.map((lp: any) => {
    const votesArr = lp.votes || [];
    const hasVoted = currentUserId
      ? votesArr.some((v: { user_id: string }) => v.user_id === currentUserId)
      : false;

    return {
      ...lp,
      votes_count: votesArr.length,
      user_has_voted: hasVoted,
      comments: lp.comments || [],
    };
  }) as ListPlace[];
}

export async function addPlaceToList(params: {
  listId: string;
  name: string;
  location?: string;
  country?: string;
  category?: string;
  mapsUrl?: string;
  note?: string;
  priority?: PriorityLevel;
  status?: VisitStatus;
  addedBy?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: place, error: placeError } = await (supabase as any)
    .from('places')
    .insert({
      name: params.name,
      location: params.location || null,
      country: params.country || null,
      category: params.category || 'Sight',
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
  return { success: true };
}

export async function removePlaceFromList(
  listPlaceId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await (supabase as any)
    .from('list_places')
    .delete()
    .eq('id', listPlaceId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
