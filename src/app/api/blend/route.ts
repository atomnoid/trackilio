import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateAndCreateBlend } from '@/services/blend';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to use Blend.' }, { status: 401 });
  }

  const body = await request.json();
  const { withUsername } = body;

  if (!withUsername || typeof withUsername !== 'string') {
    return NextResponse.json({ error: 'A username or user ID is required.' }, { status: 400 });
  }

  // Use the current user's id as userA
  const result = await calculateAndCreateBlend(user.id, withUsername.trim());

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ blendId: result.blendId, result: result.result });
}
