import { createClient } from '@/lib/supabase/server';
import { ListMember, MemberRole } from '@/types/database';

export async function getListMembers(listId: string): Promise<ListMember[]> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('list_members')
    .select('*, profile:profiles(*)')
    .eq('list_id', listId);

  if (error) return [];
  return (data ?? []) as ListMember[];
}

export async function addListMember(params: {
  listId: string;
  userId: string;
  role: MemberRole;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await (supabase as any).from('list_members').insert({
    list_id: params.listId,
    user_id: params.userId,
    role: params.role,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function removeListMember(
  listId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await (supabase as any)
    .from('list_members')
    .delete()
    .eq('list_id', listId)
    .eq('user_id', userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
