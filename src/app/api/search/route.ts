import { NextResponse } from 'next/server';
import { searchEverything } from '@/services/search';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const type = searchParams.get('type') || 'all'; // 'all' | 'places' | 'lists' | 'users'
    const limitParam = parseInt(searchParams.get('limit') || '10', 10);
    const limit = Math.min(Math.max(limitParam, 1), 50);

    if (!q || q.length < 1) {
      return NextResponse.json({ places: [], lists: [], users: [], intent: null });
    }

    const results = await searchEverything(q, {
      placesLimit: type === 'users' || type === 'lists' ? 0 : limit,
      listsLimit: type === 'users' || type === 'places' ? 0 : limit,
      usersLimit: type === 'places' || type === 'lists' ? 0 : limit,
    });

    return NextResponse.json({
      places: results.places,
      lists: results.lists,
      users: results.users,
      intent: results.intent,
    });
  } catch (err: any) {
    console.error('Search API error:', err?.message);
    return NextResponse.json(
      { error: 'Search failed', places: [], lists: [], users: [] },
      { status: 500 }
    );
  }
}
