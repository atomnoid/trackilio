import { NextResponse } from 'next/server';
import { checkUsernameAvailability } from '@/services/profiles';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const excludeUserId = searchParams.get('excludeUserId') || undefined;

  if (!username) {
    return NextResponse.json(
      { available: false, error: 'Username is required', cleanUsername: '' },
      { status: 400 }
    );
  }

  const result = await checkUsernameAvailability(username, excludeUserId);
  return NextResponse.json(result);
}
