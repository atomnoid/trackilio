import { createClient } from '@/lib/supabase/server';

export async function toggleVote(
  listPlaceId: string,
  userId: string
): Promise<{ voted: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: existing } = await (supabase as any)
    .from('votes')
    .select('id')
    .eq('list_place_id', listPlaceId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    const { error } = await (supabase as any)
      .from('votes')
      .delete()
      .eq('id', existing.id);
    if (error) return { voted: true, error: error.message };
    return { voted: false };
  } else {
    const { error } = await (supabase as any).from('votes').insert({
      list_place_id: listPlaceId,
      user_id: userId,
    });
    if (error) return { voted: false, error: error.message };
    return { voted: true };
  }
}
