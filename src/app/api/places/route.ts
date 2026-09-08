import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { addPlaceToList } from '@/services/places';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { listId, name, location, country, category, mapsUrl, note, priority, status } = body;

  if (!listId || !name?.trim()) {
    return NextResponse.json({ error: 'listId and name are required' }, { status: 400 });
  }

  const result = await addPlaceToList({
    listId,
    name: name.trim(),
    location: location?.trim(),
    country: country?.trim(),
    category: category || 'Sight',
    mapsUrl: mapsUrl?.trim(),
    note: note?.trim(),
    priority,
    status,
    addedBy: user.id,
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
