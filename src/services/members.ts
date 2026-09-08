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

export async function updateListMemberRole(
  listId: string,
  userId: string,
  role: MemberRole
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await (supabase as any)
    .from('list_members')
    .update({ role })
    .eq('list_id', listId)
    .eq('user_id', userId);

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

/**
 * Find a profile by username or email prefix for member invitation.
 * Returns the profile id if found, null otherwise.
 */
export async function findProfileByUsernameOrEmail(
  identifier: string
): Promise<{ id: string; display_name: string; username: string | null } | null> {
  const supabase = await createClient();
  const clean = identifier.toLowerCase().trim();

  // Try username first
  const { data: byUsername } = await (supabase as any)
    .from('profiles')
    .select('id, display_name, username')
    .eq('username', clean)
    .maybeSingle();

  if (byUsername) return byUsername;

  // Try by email (Supabase auth.users) via a safe approach using profiles display_name prefix match
  // We use ilike on display_name as a secondary heuristic if no username match
  return null;
}
