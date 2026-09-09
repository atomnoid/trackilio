import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { toggleSaveList } from '@/services/lists';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Please log in to save lists.' }, { status: 401 });
  }

  try {
    const { listId } = await request.json();
    if (!listId) {
      return NextResponse.json({ error: 'List ID is required' }, { status: 400 });
    }

    const result = await toggleSaveList(user.id, listId);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, saved: result.saved });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
