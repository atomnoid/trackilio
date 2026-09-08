import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const displayName = formData.get('displayName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/dashboard');
}
