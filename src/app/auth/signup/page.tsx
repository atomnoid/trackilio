import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign Up for MyWanderLists',
  description: 'Create an account to build and share travel lists.',
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
        <h1 className="font-editorial text-3xl font-bold text-stone-900">Join MyWanderLists</h1>
        <p className="text-sm text-stone-600">Start organizing and discovering places worth remembering</p>
      </div>

      {resolvedParams.error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-700 text-center">
          {resolvedParams.error}
        </div>
      )}

      <form action="/auth/signup/action" method="POST" className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Display Name</label>
          <input
            type="text"
            name="displayName"
            required
            placeholder="e.g. Elena Rostova"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

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
            minLength={6}
            placeholder="Minimum 6 characters"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-stone-900 text-white font-semibold py-2.5 text-sm hover:bg-stone-800 transition-colors shadow-sm"
        >
          Create Account
        </button>
      </form>

      <p className="text-center text-xs text-stone-500">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-semibold text-terracotta hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
