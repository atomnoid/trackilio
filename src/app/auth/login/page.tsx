import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Log In to MyWanderLists',
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
        <h1 className="font-editorial text-3xl font-bold text-stone-900">Welcome Back</h1>
        <p className="text-sm text-stone-600">Sign in to your MyWanderLists account</p>
      </div>

      {resolvedParams.error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-700 text-center">
          {resolvedParams.error}
        </div>
      )}

      <form action="/auth/login/action" method="POST" className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
        <input type="hidden" name="redirectUrl" value={resolvedParams.redirect || '/dashboard'} />

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-stone-900 text-white font-semibold py-2.5 text-sm hover:bg-stone-800 transition-colors shadow-sm"
        >
          Log In
        </button>
      </form>

      <p className="text-center text-xs text-stone-500">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="font-semibold text-terracotta hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
