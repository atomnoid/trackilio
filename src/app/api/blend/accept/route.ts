import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateAndCreateBlend } from '@/services/blend';

/** POST /api/blend/accept — accept a blend invite and create the session */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to accept a Blend invite.' }, { status: 401 });
  }

  const { token } = await request.json();
  if (!token) {
    return NextResponse.json({ error: 'Token is required.' }, { status: 400 });
  }

  // Fetch and validate invite
  const { data: invite, error: inviteErr } = await (supabase as any)
    .from('blend_invites')
    .select('*')
    .eq('token', token)
    .maybeSingle();

  if (inviteErr || !invite) {
    return NextResponse.json({ error: 'Invite not found.' }, { status: 404 });
  }
  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: 'This invite link has expired.' }, { status: 410 });
  }
  if (invite.accepted_at) {
    return NextResponse.json({ blendId: invite.blend_id, alreadyAccepted: true });
  }
  if (invite.inviter_id === user.id) {
    return NextResponse.json({ error: 'You cannot accept your own Blend invite.' }, { status: 400 });
  }

  // Create the blend
  const result = await calculateAndCreateBlend(invite.inviter_id, user.id);
  if (result.error || !result.blendId) {
    return NextResponse.json({ error: result.error || 'Failed to create Blend.' }, { status: 500 });
  }

  // Mark invite as accepted
  await (supabase as any)
    .from('blend_invites')
    .update({ accepted_at: new Date().toISOString(), blend_id: result.blendId })
    .eq('token', token);

  return NextResponse.json({ blendId: result.blendId });
}
