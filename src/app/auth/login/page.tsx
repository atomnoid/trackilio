import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { TrackilioBalloonLogo } from '@/components/brand/TrackilioBalloonLogo';

export const metadata: Metadata = {
  title: 'Log In to Trackilio',
  description: 'Sign in to access and manage your travel lists.',
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedParams = await searchParams;
  const rawRedirect = resolvedParams.redirect || '/dashboard';
  const redirectUrl =
    rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') && !rawRedirect.includes(':')
      ? rawRedirect
      : '/dashboard';

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16 space-y-6">
      <div className="text-center space-y-3">
        <div className="flex justify-center pb-1">
          <TrackilioBalloonLogo size={72} animated={true} />
        </div>
        <h1 className="font-sans text-3xl font-black text-[#222222]">Welcome Back</h1>
        <p className="text-xs sm:text-sm text-[#6B6862] font-normal">Sign in to your Trackilio account</p>
      </div>

      {resolvedParams.error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-700 text-center">
          {resolvedParams.error}
        </div>
      )}

      <LoginForm redirectUrl={redirectUrl} />

      <p className="text-center text-xs text-gray-500 font-medium">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="font-extrabold text-[#C53678] hover:text-[#FF5841] transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}
