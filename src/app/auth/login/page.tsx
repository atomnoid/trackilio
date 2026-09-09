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
        <h1 className="font-sans text-3xl font-black text-gray-900">Welcome Back 👋</h1>
        <p className="text-sm text-gray-500 font-normal">Sign in to your Trackilio account</p>
      </div>

      {resolvedParams.error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-700 text-center">
          {resolvedParams.error}
        </div>
      )}

      <form action="/auth/login/action" method="POST" className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-5">
        <input type="hidden" name="redirectUrl" value={resolvedParams.redirect || '/dashboard'} />

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-800">Email Address</label>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/40 focus:border-[#FF5841]/50 focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-800">Password</label>
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5841]/40 focus:border-[#FF5841]/50 focus:bg-white transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-[#FF5841] hover:bg-[#E84430] text-white font-black py-3.5 text-sm shadow-sm active-press transition-all"
        >
          Log In
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 font-medium">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="font-extrabold text-[#C53678] hover:text-[#FF5841] transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}
