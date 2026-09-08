import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createWanderList } from '@/services/lists';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, destination } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await createWanderList({
      ownerId: user.id,
      title: title.trim(),
      destination: destination ? destination.trim() : undefined,
      isPublic: true,
    });

    if (res.error) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }

    return NextResponse.json({ slug: res.slug });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
