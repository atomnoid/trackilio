import { createClient } from '@/lib/supabase/server';
import { Comment } from '@/types/database';

export async function addComment(params: {
  listPlaceId: string;
  userId: string;
  content: string;
}): Promise<{ comment?: Comment; error?: string }> {
  if (!params.content.trim()) {
    return { error: 'Comment content cannot be empty' };
  }

  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('comments')
    .insert({
      list_place_id: params.listPlaceId,
      user_id: params.userId,
      content: params.content.trim(),
    })
    .select('*, profile:profiles(*)')
    .single();

  if (error) return { error: error.message };
  return { comment: data as Comment };
}

export async function deleteComment(
  commentId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await (supabase as any)
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
