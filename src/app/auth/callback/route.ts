import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizeUsername, validateUsernameFormat } from '@/lib/username';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const rawNext = requestUrl.searchParams.get('next') || '/dashboard';

  // Sanitize redirect target to avoid open-redirect vulnerabilities
  const next =
    rawNext.startsWith('/') && !rawNext.startsWith('//') && !rawNext.includes(':')
      ? rawNext
      : '/dashboard';

  // If OAuth provider returned an error (e.g. user cancelled prompt)
  if (error) {
    console.warn('OAuth provider returned error:', error, errorDescription);
    const redirectError = encodeURIComponent(
      errorDescription || error || 'Google sign-in was cancelled or failed'
    );
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${redirectError}`);
  }

  if (code) {
    const supabase = await createClient();
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Failed to exchange auth code for session:', exchangeError);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent(exchangeError.message)}`
      );
    }

    // Auth succeeded! Enhance or sync profile with Google metadata
    const user = data?.session?.user;
    if (user) {
      try {
        const { data: profile } = await (supabase as any)
          .from('profiles')
          .select('id, display_name, username, avatar_url')
          .eq('id', user.id)
          .maybeSingle();

        const googleName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.display_name ||
          user.email?.split('@')[0] ||
          'Traveler';

        const googleAvatar =
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          null;

        if (!profile) {
          // If trigger didn't insert a profile row, create it now
          await (supabase as any).from('profiles').insert({
            id: user.id,
            display_name: googleName,
            avatar_url: googleAvatar,
          });
        } else {
          const updates: Record<string, any> = {};

          // Populate display name if missing or defaulted to email prefix
          if (!profile.display_name || profile.display_name === user.email?.split('@')[0]) {
            if (googleName) updates.display_name = googleName;
          }

          // Populate avatar if missing
          if (!profile.avatar_url && googleAvatar) {
            updates.avatar_url = googleAvatar;
          }

          // If user does not have a username yet, generate a clean default
          if (!profile.username && user.email) {
            try {
              const baseCandidate = sanitizeUsername(user.email.split('@')[0]);
              const validation = validateUsernameFormat(baseCandidate);
              if (validation.valid) {
                // Check if candidate is free
                const { data: existingUser } = await (supabase as any)
                  .from('profiles')
                  .select('id')
                  .eq('username', validation.cleanUsername)
                  .maybeSingle();

                if (!existingUser) {
                  updates.username = validation.cleanUsername;
                } else {
                  // Fallback: append a random 3-digit suffix
                  const suffixed = `${validation.cleanUsername.slice(0, 26)}_${Math.floor(100 + Math.random() * 900)}`;
                  const { data: suffixExists } = await (supabase as any)
                    .from('profiles')
                    .select('id')
                    .eq('username', suffixed)
                    .maybeSingle();
                  if (!suffixExists) {
                    updates.username = suffixed;
                  }
                }
              }
            } catch {
              // Ignore username generation errors; user can pick one in settings
            }
          }

          if (Object.keys(updates).length > 0) {
            await (supabase as any)
              .from('profiles')
              .update(updates)
              .eq('id', user.id);
          }
        }
      } catch (profileError) {
        // Log non-fatal error; user is still authenticated
        console.error('Error syncing profile from OAuth user metadata:', profileError);
      }
    }

    // Determine correct redirect URL taking reverse proxies into account
    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
    if (forwardedHost && process.env.NODE_ENV === 'production') {
      return NextResponse.redirect(`${forwardedProto}://${forwardedHost}${next}`);
    }

    return NextResponse.redirect(`${requestUrl.origin}${next}`);
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/auth/login?error=Invalid%20authorization%20request`
  );
}
