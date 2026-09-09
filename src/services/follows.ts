/**
 * follows.ts
 * Follow/unfollow service — server-side only, always validates auth.uid().
 */

import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';

export async function followUser(
  followerId: string,
  followingId: string
): Promise<{ success: boolean; error?: string }> {
  if (followerId === followingId) {
    return { success: false, error: 'You cannot follow yourself.' };
  }

  try {
    const supabase = await createClient();

    const { error } = await (supabase as any).from('follows').insert({
      follower_id: followerId,
      following_id: followingId,
    });

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'Already following this user.' };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to follow user.' };
  }
}

export async function unfollowUser(
  followerId: string,
  followingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await (supabase as any)
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to unfollow user.' };
  }
}

export async function isFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { data } = await (supabase as any)
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();

    return !!data;
  } catch {
    return false;
  }
}

export async function getFollowCounts(
  userId: string
): Promise<{ followers: number; following: number }> {
  try {
    const supabase = await createClient();

    const [followersRes, followingRes] = await Promise.all([
      (supabase as any)
        .from('follows')
        .select('id', { count: 'exact', head: true })
        .eq('following_id', userId),
      (supabase as any)
        .from('follows')
        .select('id', { count: 'exact', head: true })
        .eq('follower_id', userId),
    ]);

    return {
      followers: followersRes.count ?? 0,
      following: followingRes.count ?? 0,
    };
  } catch {
    return { followers: 0, following: 0 };
  }
}

export async function getFollowers(userId: string): Promise<Profile[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await (supabase as any)
      .from('follows')
      .select('follower:profiles!follower_id(*)')
      .eq('following_id', userId)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !data) return [];
    return (data as any[]).map((row) => row.follower).filter(Boolean) as Profile[];
  } catch {
    return [];
  }
}

export async function getFollowing(userId: string): Promise<Profile[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await (supabase as any)
      .from('follows')
      .select('following:profiles!following_id(*)')
      .eq('follower_id', userId)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !data) return [];
    return (data as any[]).map((row) => row.following).filter(Boolean) as Profile[];
  } catch {
    return [];
  }
}
