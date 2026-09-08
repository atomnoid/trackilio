import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { voteOnListPlace } from '@/services/votes';
import { VoteType } from '@/types/database';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { listPlaceId, voteType = 'up' } = body;

  if (!listPlaceId) {
    return NextResponse.json({ error: 'listPlaceId is required' }, { status: 400 });
  }

  const validVoteType: VoteType = voteType === 'down' ? 'down' : 'up';
  const result = await voteOnListPlace({
    listPlaceId,
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

