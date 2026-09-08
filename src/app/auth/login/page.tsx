import type { Metadata } from 'next';
import Link from 'next/link';

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

  return (
    <div className="mx-auto max-w-md px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-sans text-3xl font-black text-[#2C2A29]">Welcome Back 👋</h1>
        <p className="text-sm text-[#78726D] font-normal">Sign in to your Trackilio account</p>
      </div>

      {resolvedParams.error && (
        <div className="rounded-2xl bg-[#FBF0F0] border border-[#F2D5D5] p-4 text-xs font-semibold text-[#C87A7A] text-center">
          {resolvedParams.error}
        </div>
      )}

      <form action="/auth/login/action" method="POST" className="bg-white border border-[#E6DFD5] rounded-3xl p-8 shadow-xs space-y-5">
        <input type="hidden" name="redirectUrl" value={resolvedParams.redirect || '/dashboard'} />

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
            placeholder="••••••••"
            className="w-full rounded-2xl border border-[#E6DFD5] bg-[#FAF6F0] px-4 py-3 text-sm font-medium text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#2C2A29] focus:bg-white transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-[#4A6B5D] hover:bg-[#3B594B] text-white font-extrabold py-3.5 text-sm shadow-2xs active-press transition-all"
        >
          Log In
        </button>
      </form>

      <p className="text-center text-xs text-[#78726D] font-medium">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="font-extrabold text-[#4A6B5D] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
