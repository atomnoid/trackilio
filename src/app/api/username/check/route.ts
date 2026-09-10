import { NextResponse } from 'next/server';
import { checkUsernameAvailability } from '@/services/profiles';
import { validateUsernameFormat } from '@/lib/username';
import { createClient } from '@/lib/supabase/server';

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

  // Validate format first (fast, no DB)
  const validation = validateUsernameFormat(username);
  if (!validation.valid) {
    return NextResponse.json({
      available: false,
      error: validation.error,
      cleanUsername: validation.cleanUsername,
    });
  }

  const clean = validation.cleanUsername;

  try {
    // Use the DB-level function that only checks *confirmed* users,
    // so orphaned usernames from abandoned signups don't block availability.
    const supabase = await createClient();
    const { data: isAvailable, error: rpcError } = await (supabase as any).rpc(
      'is_username_available',
      {
        p_username: clean,
        p_exclude_user_id: excludeUserId || null,
      }
    );

    if (!rpcError && typeof isAvailable === 'boolean') {
      return NextResponse.json({
        available: isAvailable,
        cleanUsername: clean,
        error: isAvailable ? undefined : 'This username is already taken. Please choose another.',
      });
    }
  } catch {
    // fall through to service-level check
  }

  // Fallback: service-level check (also handles confirmed-user join with graceful fallback)
  const result = await checkUsernameAvailability(username, excludeUserId);
  return NextResponse.json(result);
}

