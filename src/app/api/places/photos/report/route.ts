import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { photoId, reason } = await request.json();

    if (!photoId) {
      return NextResponse.json({ error: 'Missing photoId' }, { status: 400 });
    }

    const { error } = await (supabase as any)
      .from('place_photos')
      .update({
        flagged_for_review: true,
        flag_reason: (reason || 'User reported photo').slice(0, 500),
      })
      .eq('id', photoId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Photo reported for moderation' });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to report photo' }, { status: 500 });
  }
}
