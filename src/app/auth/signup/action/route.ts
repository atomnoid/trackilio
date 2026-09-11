import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkUsernameAvailability } from '@/services/profiles';

export async function POST(request: Request) {
  const formData = await request.formData();
  const displayName = (formData.get('displayName') as string)?.trim();
  const rawUsername = formData.get('username') as string;
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  if (!displayName) {
    return NextResponse.json({ error: 'Display name is required.' }, { status: 400 });
  }

  // Validate username
  const usernameCheck = await checkUsernameAvailability(rawUsername || '');
  if (!usernameCheck.available) {
    return NextResponse.json(
      { error: usernameCheck.error || 'Invalid username.' },
      { status: 400 }
    );
  }

  const cleanUser = usernameCheck.cleanUsername;
  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        username: cleanUser,
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Supabase silently "succeeds" for existing emails but returns an empty identities array.
  // Detect this and surface a clear, user-friendly error instead.
  if (!authData.user || (authData.user.identities && authData.user.identities.length === 0)) {
    return NextResponse.json(
      { error: 'This email is already registered. Try logging in instead.', emailTaken: true },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Verification email sent to your mail. Please verify your email before logging in.',
  });
}
