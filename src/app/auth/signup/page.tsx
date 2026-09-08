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
        <h1 className="font-display text-3xl font-black text-slate-900">Join Trackilio ✨</h1>
        <p className="text-sm text-slate-600 font-normal">Start organizing places, planning trips, and discovering content.</p>
      </div>

      {resolvedParams.error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-700 text-center">
          {resolvedParams.error}
        </div>
      )}

      <form action="/auth/signup/action" method="POST" className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-violet-500/5 space-y-5">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-800">Display Name</label>
          <input
            type="text"
            name="displayName"
            required
            placeholder="e.g. Elena Rostova"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-800">Email Address</label>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-800">Password</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            placeholder="Minimum 6 characters"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-extrabold py-3.5 text-sm shadow-lg shadow-violet-500/25 hover:shadow-xl hover:scale-[1.01] active-press transition-all"
        >
          Create Account
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 font-medium">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-extrabold text-violet-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
