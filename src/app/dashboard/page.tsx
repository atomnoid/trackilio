import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getUserWanderLists } from '@/services/lists';
import { getProfile } from '@/services/profiles';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { PlusCircle, Compass, User, Globe, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | MyWanderLists',
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/dashboard');
  }

  const profile = await getProfile(user.id);
  const lists = await getUserWanderLists(user.id);

  const publicLists = lists.filter((l) => l.is_public);
  const privateLists = lists.filter((l) => !l.is_public);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-stone-200 pb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-900 font-bold text-2xl border-2 border-amber-200">
            {profile?.display_name?.charAt(0).toUpperCase() || 'T'}
          </div>
          <div>
            <h1 className="font-editorial text-3xl font-bold text-stone-900">
              Welcome, {profile?.display_name || 'Traveler'}
            </h1>
            <p className="text-sm text-stone-500">
              Manage your personal and collaborative travel lists.
            </p>
          </div>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" /> Create New List
        </Link>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Lists</span>
          <p className="text-3xl font-bold font-editorial text-stone-900">{lists.length}</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <Globe className="h-3.5 w-3.5 text-emerald-600" /> Public Lists
          </span>
          <p className="text-3xl font-bold font-editorial text-stone-900">{publicLists.length}</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <Lock className="h-3.5 w-3.5 text-stone-500" /> Private Lists
          </span>
          <p className="text-3xl font-bold font-editorial text-stone-900">{privateLists.length}</p>
        </div>
      </div>

      {/* WanderLists Section */}
      <div className="space-y-6">
        <h2 className="font-editorial text-2xl font-bold text-stone-900">
          Your WanderLists ({lists.length})
        </h2>

        {lists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lists.map((list) => (
              <WanderListCard key={list.id} list={list} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-stone-200 p-12 text-center space-y-4">
            <Compass className="mx-auto h-12 w-12 text-stone-300" />
            <h3 className="font-editorial text-2xl font-bold text-stone-900">
              No WanderLists yet
            </h3>
            <p className="text-stone-600 text-sm max-w-md mx-auto">
              Start building your first travel list for cafes, hidden spots, or upcoming trips.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl bg-terracotta text-white font-semibold px-6 py-2.5 text-sm hover:bg-amber-800 transition-colors"
            >
              Create a WanderList
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
