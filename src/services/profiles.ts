import { createClient } from '@/lib/supabase/server';
import { Profile, WanderList } from '@/types/database';

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) return null;
    return data as Profile;
  } catch {
    return null;
  }
}

export async function getPublicProfileByUsernameOrId(
  identifier: string
): Promise<{ profile: Profile; publicLists: WanderList[] } | null> {
  try {
    const supabase = await createClient();
    const cleanIdent = identifier.toLowerCase().trim();

    // Query profile by username or id
    let { data: profile } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('username', cleanIdent)
      .maybeSingle();

    if (!profile) {
      const { data: profileById } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', identifier)
        .maybeSingle();
      profile = profileById;
    }

    if (!profile) return null;

    // Fetch ONLY public lists belonging to this profile
    const { data: publicLists } = await (supabase as any)
      .from('wander_lists')
      .select('*, owner:profiles(*)')
      .eq('owner_id', profile.id)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    return {
      profile: {
        ...profile,
        public_lists_count: (publicLists ?? []).length,
      } as Profile,
      publicLists: (publicLists ?? []) as WanderList[],
    };
  } catch {
    return null;
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'display_name' | 'username' | 'bio' | 'location' | 'avatar_url'>>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Validate username if updating
    if (updates.username) {
      const cleanUsername = updates.username.toLowerCase().trim();
      if (!/^[a-z0-9_-]{3,30}$/.test(cleanUsername)) {
        return {
          success: false,
          error: 'Username must be 3-30 characters long and contain only letters, numbers, hyphens, or underscores.',
        };
      }

      // Check for reserved usernames
      const reserved = ['admin', 'api', 'auth', 'dashboard', 'settings', 'explore', 'discover', 'create', 'login', 'signup', 'u', 'l', 'blend'];
      if (reserved.includes(cleanUsername)) {
        return { success: false, error: 'This username is reserved.' };
      }

      // Check uniqueness
      const { data: existing } = await (supabase as any)
        .from('profiles')
        .select('id')
        .eq('username', cleanUsername)
        .neq('id', userId)
        .maybeSingle();

      if (existing) {
        return { success: false, error: 'Username is already taken.' };
      }

      updates.username = cleanUsername;
    }

    const { error } = await (supabase as any)
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Update failed' };
  }
}
