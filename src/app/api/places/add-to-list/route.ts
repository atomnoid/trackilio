import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { addExistingPlaceToList } from '@/services/places';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { listId, placeId, note, priority, status } = body;

  if (!listId || !placeId) {
    return NextResponse.json(
      { error: 'listId and placeId are required' },
      { status: 400 }
    );
  }

  // Verify write permissions on the list
  const { data: listData } = await (supabase as any)
    .from('wander_lists')
    .select('id, owner_id')
    .eq('id', listId)
    .maybeSingle();

  if (!listData) {
    return NextResponse.json({ error: 'List not found' }, { status: 404 });
  }

  const result = await addExistingPlaceToList({
    listId,
    placeId,
    note,
    priority,
    status,
    addedBy: user.id,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
