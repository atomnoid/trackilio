import { createClient } from '@/lib/supabase/server';
import { Profile, WanderList } from '@/types/database';
import { validateUsernameFormat, sanitizeUsername } from '@/lib/username';

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

export async function checkUsernameAvailability(
  rawUsername: string,
  excludeUserId?: string
): Promise<{ available: boolean; error?: string; cleanUsername: string }> {
  const validation = validateUsernameFormat(rawUsername);
  if (!validation.valid) {
    return {
      available: false,
      error: validation.error,
      cleanUsername: validation.cleanUsername,
    };
  }

  const clean = validation.cleanUsername;

  try {
    const supabase = await createClient();
    let query = (supabase as any)
      .from('profiles')
      .select('id')
      .eq('username', clean);

    if (excludeUserId) {
      query = query.neq('id', excludeUserId);
    }

    const { data: existing } = await query.maybeSingle();

    if (existing) {
      return {
        available: false,
        error: 'This username is already taken. Please choose another.',
        cleanUsername: clean,
      };
    }

    return {
      available: true,
      cleanUsername: clean,
    };
  } catch (err: any) {
    return {
      available: false,
      error: 'Unable to verify username availability at this moment.',
      cleanUsername: clean,
    };
  }
}

export async function getPublicProfileByUsernameOrId(
  identifier: string
): Promise<{ profile: Profile; publicLists: WanderList[] } | null> {
  try {
    const supabase = await createClient();
    const cleanIdent = sanitizeUsername(identifier);

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
        .eq('id', identifier.trim())
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
    if (updates.username !== undefined && updates.username !== null) {
      const check = await checkUsernameAvailability(updates.username, userId);
      if (!check.available) {
        return {
          success: false,
          error: check.error || 'Invalid username.',
        };
      }
      updates.username = check.cleanUsername;
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
