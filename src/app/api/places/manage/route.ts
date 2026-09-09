import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PriorityLevel, VisitStatus } from '@/types/database';

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { listPlaceId, name, location, country, category, tags, note, priority, status, mapsUrl } = body;

  if (!listPlaceId) {
    return NextResponse.json({ error: 'listPlaceId is required' }, { status: 400 });
  }

  // Check write access on the parent list
  const { data: listPlace } = await (supabase as any)
    .from('list_places')
    .select('list_id, place_id')
    .eq('id', listPlaceId)
    .maybeSingle();

  if (!listPlace) {
    return NextResponse.json({ error: 'List place not found' }, { status: 404 });
  }

  const { data: canWrite } = await (supabase as any).rpc('can_write_list', {
    list_id: listPlace.list_id,
    user_id: user.id,
  });

  if (!canWrite) {
    return NextResponse.json({ error: 'Forbidden: you cannot edit this place in the list' }, { status: 403 });
  }

  // Update list_place metadata
  const listPlacePayload: Record<string, any> = { updated_at: new Date().toISOString() };
  if (note !== undefined) listPlacePayload.note = note ? note.trim() : null;
  if (priority !== undefined) listPlacePayload.priority = priority as PriorityLevel;
  if (status !== undefined) listPlacePayload.status = status as VisitStatus;

  await (supabase as any)
    .from('list_places')
    .update(listPlacePayload)
    .eq('id', listPlaceId);

  // Update canonical place name/location/category/tags if provided
  if (name || location || country || category || tags || mapsUrl !== undefined) {
    const placePayload: Record<string, any> = { updated_at: new Date().toISOString() };
    if (name) placePayload.name = name.trim();
    if (location !== undefined) placePayload.location = location ? location.trim() : null;
    if (country !== undefined) placePayload.country = country ? country.trim() : null;
    if (category) placePayload.category = category;
    if (tags !== undefined) placePayload.tags = Array.isArray(tags) ? tags.slice(0, 3) : [];
    if (mapsUrl !== undefined) placePayload.maps_url = mapsUrl ? mapsUrl.trim() : null;

    await (supabase as any)
      .from('places')
      .update(placePayload)
      .eq('id', listPlace.place_id);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
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

  // Check write access on list
  const { data: listPlace } = await (supabase as any)
    .from('list_places')
    .select('list_id')
    .eq('id', listPlaceId)
    .maybeSingle();

  if (!listPlace) {
    return NextResponse.json({ error: 'Place not found in list' }, { status: 404 });
  }

  const { data: canWrite } = await (supabase as any).rpc('can_write_list', {
    list_id: listPlace.list_id,
    user_id: user.id,
  });

  if (!canWrite) {
    return NextResponse.json({ error: 'Forbidden: you cannot remove places from this list' }, { status: 403 });
  }

  const { error } = await (supabase as any)
    .from('list_places')
    .delete()
    .eq('id', listPlaceId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
