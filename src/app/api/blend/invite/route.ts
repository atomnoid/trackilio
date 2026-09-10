import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSiteUrl } from '@/lib/utils';

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    // Insert new blend invite row
    const { data: invite, error: insertError } = await (supabase as any)
      .from('blend_invites')
      .insert({
        inviter_id: user.id,
      })
      .select('id, token, expires_at')
      .single();

    if (insertError) {
      console.error('Failed to create blend invite:', insertError);
      return NextResponse.json({ error: 'Failed to create invite link.' }, { status: 500 });
    }

    const siteUrl = getSiteUrl();
    const inviteUrl = `${siteUrl}/blend/invite/${invite.token}`;

    return NextResponse.json({
      token: invite.token,
      url: inviteUrl,
      expiresAt: invite.expires_at,
    });
  } catch (error) {
    console.error('Blend invite creation error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: invite, error } = await (supabase as any)
      .from('blend_invites')
      .select('id, token, inviter_id, blend_id, accepted_at, expires_at, created_at')
      .eq('token', token)
      .single();

    if (error || !invite) {
      return NextResponse.json({ error: 'Invite not found.' }, { status: 404 });
    }

    // Fetch inviter profile
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('id, display_name, username, avatar_url')
      .eq('id', invite.inviter_id)
      .single();

    const isExpired = new Date(invite.expires_at) < new Date();
    const isAccepted = !!invite.accepted_at;

    return NextResponse.json({
      invite,
      inviter: profile || { display_name: 'Traveler', username: null, avatar_url: null },
      isExpired,
      isAccepted,
    });
  } catch (error) {
    console.error('Blend invite fetch error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
