import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { followUser, unfollowUser, getFollowers, getFollowing } from '@/services/follows';

export const dynamic = 'force-dynamic';

async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// POST /api/follows — follow a user
export async function POST(request: Request) {
  try {
    const followerId = await getAuthenticatedUserId();
    if (!followerId) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const body = await request.json();
    const { followingId } = body;

    if (!followingId || typeof followingId !== 'string') {
      return NextResponse.json({ error: 'followingId is required.' }, { status: 400 });
    }

    if (followerId === followingId) {
      return NextResponse.json({ error: 'You cannot follow yourself.' }, { status: 400 });
    }

    // Verify target user exists
    const supabase = await createClient();
    const { data: targetProfile } = await (supabase as any)
      .from('profiles')
      .select('id')
      .eq('id', followingId)
      .maybeSingle();

    if (!targetProfile) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const result = await followUser(followerId, followingId);

    if (!result.success) {
      // Handle duplicate follow gracefully
      if (result.error?.includes('Already following') || result.error?.includes('23505')) {
        return NextResponse.json({ following: true, message: 'Already following.' });
      }
      console.error('Follow API error from service:', result.error);
      return NextResponse.json({ error: result.error || 'Failed to follow user.' }, { status: 400 });
    }

    return NextResponse.json({ following: true });
  } catch (err: any) {
    console.error('Follow API POST exception:', err?.message || err);
    return NextResponse.json({ error: err?.message || 'Failed to follow user.' }, { status: 500 });
  }
}


// DELETE /api/follows — unfollow a user
export async function DELETE(request: Request) {
  try {
    const followerId = await getAuthenticatedUserId();
    if (!followerId) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const body = await request.json();
    const { followingId } = body;

    if (!followingId || typeof followingId !== 'string') {
      return NextResponse.json({ error: 'followingId is required.' }, { status: 400 });
    }

    const result = await unfollowUser(followerId, followingId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ following: false });
  } catch (err: any) {
    console.error('Follow API DELETE error:', err?.message);
    return NextResponse.json({ error: 'Failed to unfollow user.' }, { status: 500 });
  }
}

// GET /api/follows?userId=...&type=followers|following
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'followers';

    if (!userId) {
      return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
    }

    if (type !== 'followers' && type !== 'following') {
      return NextResponse.json({ error: 'type must be followers or following.' }, { status: 400 });
    }

    const profiles = type === 'followers'
      ? await getFollowers(userId)
      : await getFollowing(userId);

    return NextResponse.json({ profiles });
  } catch (err: any) {
    console.error('Follow API GET error:', err?.message);
    return NextResponse.json({ error: 'Failed to fetch follow list.' }, { status: 500 });
  }
}
