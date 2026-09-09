import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { checkUsernameAvailability } from '@/services/profiles';
import { sanitizeUsername } from '@/lib/username';

export async function POST(request: Request) {
  const formData = await request.formData();
  const displayName = (formData.get('displayName') as string)?.trim();
  const rawUsername = formData.get('username') as string;
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  if (!displayName) {
    redirect(`/auth/signup?error=${encodeURIComponent('Display name is required.')}`);
  }

  // Validate username
  const usernameCheck = await checkUsernameAvailability(rawUsername || '');
  if (!usernameCheck.available) {
    redirect(`/auth/signup?error=${encodeURIComponent(usernameCheck.error || 'Invalid username.')}`);
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
    redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`);
  }

  // Ensure profile has username immediately if user was created
  if (authData.user) {
    try {
      await (supabase as any)
        .from('profiles')
        .upsert({
          id: authData.user.id,
          display_name: displayName,
          username: cleanUser,
          updated_at: new Date().toISOString(),
        });
    } catch {
      // Handled by handle_new_user trigger fallback
    }
  }

  redirect('/dashboard');
}
