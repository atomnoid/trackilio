import { NextResponse } from 'next/server';
import { getRandomFact } from '@/services/dailyFacts';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeId = searchParams.get('exclude') || undefined;
    const fact = await getRandomFact(excludeId);
    return NextResponse.json({ success: true, fact });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch fun fact' },
      { status: 500 }
    );
  }
}
