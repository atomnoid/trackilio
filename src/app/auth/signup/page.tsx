import type { Metadata } from 'next';
import Link from 'next/link';

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
    <div className="mx-auto max-w-md px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-sans text-3xl font-black text-[#2C2A29]">Join Trackilio ✨</h1>
        <p className="text-sm text-[#78726D] font-normal">Start organizing places, planning trips, and discovering content.</p>
      </div>

      {resolvedParams.error && (
        <div className="rounded-2xl bg-[#FBF0F0] border border-[#F2D5D5] p-4 text-xs font-semibold text-[#C87A7A] text-center">
          {resolvedParams.error}
        </div>
      )}

      <form action="/auth/signup/action" method="POST" className="bg-white border border-[#E6DFD5] rounded-3xl p-8 shadow-xs space-y-5">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#2C2A29]">Display Name</label>
          <input
            type="text"
            name="displayName"
            required
            placeholder="e.g. Elena Rostova"
            className="w-full rounded-2xl border border-[#E6DFD5] bg-[#FAF6F0] px-4 py-3 text-sm font-medium text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#2C2A29] focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#2C2A29]">Email Address</label>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-[#E6DFD5] bg-[#FAF6F0] px-4 py-3 text-sm font-medium text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#2C2A29] focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#2C2A29]">Password</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            placeholder="Minimum 6 characters"
            className="w-full rounded-2xl border border-[#E6DFD5] bg-[#FAF6F0] px-4 py-3 text-sm font-medium text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#2C2A29] focus:bg-white transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-[#4A6B5D] hover:bg-[#3B594B] text-white font-extrabold py-3.5 text-sm shadow-2xs active-press transition-all"
        >
          Create Account
        </button>
      </form>

      <p className="text-center text-xs text-[#78726D] font-medium">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-extrabold text-[#4A6B5D] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
