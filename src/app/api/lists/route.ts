import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createWanderList } from '@/services/lists';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Please log in to create a list.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, destination, isPublic = true } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
    }

    const res = await createWanderList({
      ownerId: user.id,
      title: title.trim(),
      description: description?.trim(),
      destination: destination?.trim(),
      isPublic: Boolean(isPublic),
    });

    if (res.error || !res.slug) {
      return NextResponse.json({ error: res.error || 'Failed to create list' }, { status: 500 });
    }

    return NextResponse.json({ success: true, slug: res.slug });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
