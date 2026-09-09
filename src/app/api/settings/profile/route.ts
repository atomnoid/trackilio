import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateProfile } from '@/services/profiles';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { displayName, username, bio, location, avatarUrl } = body;

    if (!displayName?.trim()) {
      return NextResponse.json({ error: 'Display name is required.' }, { status: 400 });
    }

    const result = await updateProfile(user.id, {
      display_name: displayName.trim(),
      username: username ? username.trim() : undefined,
      bio: bio ? bio.trim() : null,
      location: location ? location.trim() : null,
      avatar_url: avatarUrl ? avatarUrl.trim() : null,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to update profile.' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error updating profile.' }, { status: 500 });
  }
}
