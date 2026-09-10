import type { Metadata } from 'next';
import Link from 'next/link';
import { SignupForm } from '@/components/auth/SignupForm';
import { TrackilioBalloonLogo } from '@/components/brand/TrackilioBalloonLogo';

export const metadata: Metadata = {
  title: 'Sign Up for Trackilio',
  description: 'Create an account to build and share interactive travel lists.',
  robots: { index: false, follow: false },
};

interface SignupPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const resolvedParams = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16 space-y-6">
      <div className="text-center space-y-3">
        <div className="flex justify-center pb-1">
          <TrackilioBalloonLogo size={72} animated={true} />
        </div>
        <h1 className="font-sans text-3xl sm:text-4xl font-black text-[#222222]">Join Trackilio</h1>
        <p className="text-xs sm:text-sm text-[#6B6862] font-normal">
          Pick your unique username, organize places, plan trips, and blend travel tastes.
        </p>
      </div>

      {resolvedParams.error && (
        <div className="rounded-2xl bg-[#FBF0F0] border border-[#F2D5D5] p-4 text-xs font-semibold text-[#C87A7A] text-center">
          {resolvedParams.error}
        </div>
      )}

      <SignupForm />

      <p className="text-center text-xs text-[#78726D] font-medium">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-extrabold text-[#4A6B5D] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
