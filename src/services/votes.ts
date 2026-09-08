import { createClient } from '@/lib/supabase/server';
import { VoteType } from '@/types/database';

/**
 * Simple toggle-vote helper used by /api/votes route (up-only).
 * Calling it again removes the vote (toggle).
 */
export async function toggleVote(
  listPlaceId: string,
  userId: string
): Promise<{ voted: boolean; error?: string }> {
  const result = await voteOnListPlace({ listPlaceId, userId, voteType: 'up' });
  if (!result.success) return { voted: false, error: result.error };
  return { voted: result.action !== 'removed' };
}

export async function voteOnListPlace(params: {
  listPlaceId: string;
  userId: string;
  voteType: VoteType;
}): Promise<{ success: boolean; action?: 'added' | 'updated' | 'removed'; error?: string }> {
  try {
    const supabase = await createClient();

    // Check if user already voted on this place
    const { data: existing } = await (supabase as any)
      .from('votes')
      .select('id, vote_type')
      .eq('list_place_id', params.listPlaceId)
      .eq('user_id', params.userId)
      .maybeSingle();

    if (existing) {
      if (existing.vote_type === params.voteType) {
        // Toggle vote off if clicking same vote type
        const { error } = await (supabase as any)
          .from('votes')
          .delete()
          .eq('id', existing.id);

        if (error) return { success: false, error: error.message };
        return { success: true, action: 'removed' };
      } else {
        // Switch vote type (up -> down or down -> up)
        const { error } = await (supabase as any)
          .from('votes')
          .update({ vote_type: params.voteType })
          .eq('id', existing.id);

        if (error) return { success: false, error: error.message };
        return { success: true, action: 'updated' };
      }
    }

    // Insert new vote
    const { error } = await (supabase as any).from('votes').insert({
      list_place_id: params.listPlaceId,
      user_id: params.userId,
      vote_type: params.voteType,
    });

    if (error) return { success: false, error: error.message };
    return { success: true, action: 'added' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Vote failed' };
  }
}
