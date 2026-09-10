import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/** POST /api/blend/invite — create a blend invite link */
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to create a Blend invite.' }, { status: 401 });
  }

  const { data: invite, error } = await (supabase as any)
    .from('blend_invites')
    .insert({ inviter_id: user.id })
    .select('token')
    .single();

  if (error || !invite) {
    return NextResponse.json({ error: 'Failed to create invite link.' }, { status: 500 });
  }

  return NextResponse.json({
    token: invite.token,
    url: `${siteUrl}/blend/invite/${invite.token}`,
  });
}

/** GET /api/blend/invite?token=xxx — fetch invite info for the accept page */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: invite, error } = await (supabase as any)
    .from('blend_invites')
    .select('*, inviter:profiles!inviter_id(display_name, username, avatar_url)')
    .eq('token', token)
    .maybeSingle();

  if (error || !invite) {
    return NextResponse.json({ error: 'Invite not found or expired' }, { status: 404 });
  }

  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: 'This invite link has expired.' }, { status: 410 });
  }

  if (invite.accepted_at) {
    return NextResponse.json({ error: 'This invite has already been used.', blendId: invite.blend_id }, { status: 409 });
  }

  return NextResponse.json({ invite });
}
