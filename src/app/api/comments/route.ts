import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { addComment } from '@/services/comments';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { listPlaceId, content } = body;

  if (!listPlaceId || !content?.trim()) {
    return NextResponse.json({ error: 'listPlaceId and content are required' }, { status: 400 });
  }

  const result = await addComment({
    listPlaceId,
    userId: user.id,
    content: content.trim(),
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ comment: result.comment });
}
