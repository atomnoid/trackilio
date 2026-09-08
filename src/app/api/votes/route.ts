import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { toggleVote } from '@/services/votes';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { listPlaceId } = body;

  if (!listPlaceId) {
    return NextResponse.json({ error: 'listPlaceId is required' }, { status: 400 });
  }

  const result = await toggleVote(listPlaceId, user.id);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ voted: result.voted });
}
