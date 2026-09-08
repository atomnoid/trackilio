import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getListMembers,
  addListMember,
  removeListMember,
  updateListMemberRole,
  findProfileByUsernameOrEmail,
} from '@/services/members';
import { MemberRole } from '@/types/database';

/** GET /api/members?listId=xxx — returns all members for a list (owner only) */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const listId = searchParams.get('listId');
  if (!listId) return NextResponse.json({ error: 'listId is required' }, { status: 400 });

  // Verify caller is owner of this list
  const { data: listData } = await (supabase as any)
    .from('wander_lists')
    .select('owner_id')
    .eq('id', listId)
    .maybeSingle();

  if (!listData) return NextResponse.json({ error: 'List not found' }, { status: 404 });
  if (listData.owner_id !== user.id)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const members = await getListMembers(listId);
  return NextResponse.json({ members });
}

/** POST /api/members — invite a member by username */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { listId, username, role = 'viewer' } = body;

  if (!listId || !username) {
    return NextResponse.json({ error: 'listId and username are required' }, { status: 400 });
  }

  const validRoles: MemberRole[] = ['editor', 'viewer'];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: 'Role must be editor or viewer' }, { status: 400 });
  }

  // Verify caller is owner of this list
  const { data: listData } = await (supabase as any)
    .from('wander_lists')
    .select('owner_id')
    .eq('id', listId)
    .maybeSingle();

  if (!listData) return NextResponse.json({ error: 'List not found' }, { status: 404 });
  if (listData.owner_id !== user.id)
    return NextResponse.json({ error: 'Only the list owner can invite members' }, { status: 403 });

  // Find the profile by username
  const profile = await findProfileByUsernameOrEmail(username);
  if (!profile) {
    return NextResponse.json(
      { error: `No Trackilio user found with username "${username}"` },
      { status: 404 }
    );
  }

  if (profile.id === user.id) {
    return NextResponse.json({ error: 'You are already the owner of this list' }, { status: 400 });
  }

  const result = await addListMember({ listId, userId: profile.id, role: role as MemberRole });

  if (!result.success) {
    // Duplicate entry = already a member
    if (result.error?.includes('duplicate') || result.error?.includes('unique')) {
      return NextResponse.json({ error: 'This user is already a member of this list' }, { status: 409 });
    }
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    member: { id: profile.id, display_name: profile.display_name, username: profile.username, role },
  });
}

/** PATCH /api/members — update a member's role */
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { listId, userId, role } = body;

  if (!listId || !userId || !role) {
    return NextResponse.json({ error: 'listId, userId, and role are required' }, { status: 400 });
  }

  const validRoles: MemberRole[] = ['editor', 'viewer'];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: 'Role must be editor or viewer' }, { status: 400 });
  }

  // Verify caller is owner
  const { data: listData } = await (supabase as any)
    .from('wander_lists')
    .select('owner_id')
    .eq('id', listId)
    .maybeSingle();

  if (!listData || listData.owner_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const result = await updateListMemberRole(listId, userId, role as MemberRole);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 });

  return NextResponse.json({ success: true });
}

/** DELETE /api/members — remove a member */
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { listId, userId } = body;

  if (!listId || !userId) {
    return NextResponse.json({ error: 'listId and userId are required' }, { status: 400 });
  }

  // Verify caller is owner (or the member themselves leaving)
  const { data: listData } = await (supabase as any)
    .from('wander_lists')
    .select('owner_id')
    .eq('id', listId)
    .maybeSingle();

  if (!listData) return NextResponse.json({ error: 'List not found' }, { status: 404 });

  const isOwner = listData.owner_id === user.id;
  const isSelf = userId === user.id;

  if (!isOwner && !isSelf) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Owner cannot be removed
  if (userId === listData.owner_id) {
    return NextResponse.json({ error: 'Cannot remove the list owner' }, { status: 400 });
  }

  const result = await removeListMember(listId, userId);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 });

  return NextResponse.json({ success: true });
}
