'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GoogleIcon, SpinnerIcon } from '@/components/icons/Icons';

interface GoogleAuthButtonProps {
  /**
   * Action button text, e.g. "Continue with Google" or "Sign up with Google"
   * Default: "Continue with Google"
   */
  text?: string;
  /**
   * Relative destination URL after successful authentication
   * Default: "/dashboard"
   */
  redirectUrl?: string;
  /**
   * Optional callback when an error occurs during OAuth initiation
   */
  onError?: (error: string) => void;
  /**
   * Optional custom classes
   */
  className?: string;
}

export function GoogleAuthButton({
  text = 'Continue with Google',
  redirectUrl = '/dashboard',
  onError,
  className = '',
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setLocalError(null);

    try {
      const supabase = createClient();
      
      // Compute absolute callback URL using current origin
      const origin =
        typeof window !== 'undefined' && window.location.origin
          ? window.location.origin
          : '';
      
      const callbackUrl = new URL('/auth/callback', origin || 'http://localhost:3000');
      if (redirectUrl) {
        callbackUrl.searchParams.set('next', redirectUrl);
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl.toString(),
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        throw error;
      }

      // If data.url is returned, some browsers or environments might need manual window.location assignment
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      const msg = err?.message || 'Could not start Google Sign-In. Please try again.';
      setLocalError(msg);
      onError?.(msg);
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      {localError && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 text-center animate-fade-in">
          {localError}
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        aria-label={text}
        className={`w-full relative flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50/90 active:bg-gray-100 text-gray-700 font-bold py-3.5 px-4 text-sm shadow-xs hover:shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 ${className}`}
      >
        {loading ? (
          <>
            <SpinnerIcon className="h-5 w-5 animate-spin text-gray-500" />
            <span className="text-gray-600 font-semibold">Connecting to Google…</span>
          </>
        ) : (
          <>
            <GoogleIcon className="h-5 w-5 shrink-0" />
            <span className="tracking-tight">{text}</span>
          </>
        )}
      </button>
    </div>
  );
}
