import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { voteOnListPlace } from '@/services/votes';
import { VoteType } from '@/types/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { listPlaceId, placeId, voteType = 'up' } = body;

    if (!listPlaceId && !placeId) {
      return NextResponse.json({ error: 'listPlaceId or placeId is required' }, { status: 400 });
    }

    const validVoteType: VoteType = voteType === 'down' ? 'down' : 'up';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Unauthenticated visitors on the internet:
    // They are permitted to upvote with their client local storage acting as persistent long memory.
    if (!user) {
      return NextResponse.json({
        success: true,
        guest: true,
        action: 'added',
        voteType: validVoteType,
      });
    }

    // 2. Authenticated users: persist to Supabase votes table
    let targetListPlaceId = listPlaceId;

    if (!targetListPlaceId && placeId) {
      const { data: lp } = await (supabase as any)
        .from('list_places')
        .select('id')
        .eq('place_id', placeId)
        .limit(1)
        .maybeSingle();

      if (lp?.id) {
        targetListPlaceId = lp.id;
      }
    }

    if (targetListPlaceId) {
      const result = await voteOnListPlace({
        listPlaceId: targetListPlaceId,
        userId: user.id,
        voteType: validVoteType,
      });

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        action: result.action,
        voteType: validVoteType,
      });
    }

    return NextResponse.json({
      success: true,
      action: 'added',
      voteType: validVoteType,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Vote failed' }, { status: 500 });
  }
}
