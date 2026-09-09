import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateWanderList, deleteWanderList } from '@/services/lists';

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { listId, title, description, destination, isPublic } = body;

  if (!listId) {
    return NextResponse.json({ error: 'listId is required' }, { status: 400 });
  }

  // Check if user is owner or editor
  const { data: member } = await (supabase as any)
    .from('list_members')
    .select('role')
    .eq('list_id', listId)
    .eq('user_id', user.id)
    .maybeSingle();

  const { data: list } = await (supabase as any)
    .from('wander_lists')
    .select('owner_id')
    .eq('id', listId)
    .maybeSingle();

  const isOwner = list?.owner_id === user.id || member?.role === 'owner';
  const isEditor = member?.role === 'editor';

  if (!isOwner && !isEditor) {
    return NextResponse.json({ error: 'Forbidden: you cannot edit this list' }, { status: 403 });
  }

  const result = await updateWanderList(listId, {
    title: title?.trim(),
    description: description !== undefined ? description.trim() : undefined,
    destination: destination !== undefined ? destination.trim() : undefined,
    isPublic: typeof isPublic === 'boolean' ? isPublic : undefined,
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
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
  const { listId } = body;

  if (!listId) {
    return NextResponse.json({ error: 'listId is required' }, { status: 400 });
  }

  // Only owner can delete list
  const { data: list } = await (supabase as any)
    .from('wander_lists')
    .select('owner_id')
    .eq('id', listId)
    .maybeSingle();

  if (!list || list.owner_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden: only list owner can delete list' }, { status: 403 });
  }

  const result = await deleteWanderList(listId);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
