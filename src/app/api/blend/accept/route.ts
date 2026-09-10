import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateAndCreateBlend } from '@/services/blend';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Please log in to accept this Blend invite.' }, { status: 401 });
    }

    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: 'Invite token is required.' }, { status: 400 });
    }

    // Fetch the invite
    const { data: invite, error: fetchErr } = await (supabase as any)
      .from('blend_invites')
      .select('id, token, inviter_id, blend_id, accepted_at, expires_at')
      .eq('token', token)
      .single();

    if (fetchErr || !invite) {
      return NextResponse.json({ error: 'Invalid or expired invite link.' }, { status: 404 });
    }

    if (new Date(invite.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This invite link has expired.' }, { status: 410 });
    }

    if (invite.inviter_id === user.id) {
      return NextResponse.json({ error: 'You cannot accept your own Blend invite.' }, { status: 400 });
    }

    // If already accepted and has blend_id, return existing blend
    if (invite.accepted_at && invite.blend_id) {
      return NextResponse.json({ blendId: invite.blend_id });
    }

    // Calculate and create the blend session
    const blendRes = await calculateAndCreateBlend(invite.inviter_id, user.id);
    if (blendRes.error || !blendRes.blendId) {
      return NextResponse.json({ error: blendRes.error || 'Failed to calculate Blend match.' }, { status: 400 });
    }

    // Update invite record
    await (supabase as any)
      .from('blend_invites')
      .update({
        blend_id: blendRes.blendId,
        accepted_at: new Date().toISOString(),
      })
      .eq('id', invite.id);

    return NextResponse.json({
      blendId: blendRes.blendId,
      result: blendRes.result,
    });
  } catch (error) {
    console.error('Blend accept error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
