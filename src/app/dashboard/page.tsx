import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getUserWanderLists } from '@/services/lists';
import { getProfile } from '@/services/profiles';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { PlusCircle, Compass, Globe, Lock, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | Trackilio',
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200/80 pb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-violet-600 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-violet-500/25 border-2 border-white">
            {profile?.display_name?.charAt(0).toUpperCase() || 'T'}
          </div>
          <div className="space-y-1">
            <h1 className="font-display text-3xl font-black text-slate-900">
              Welcome back 👋, {profile?.display_name || 'Traveler'}
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Manage your personal, public, and collaborative Trackilio Lists.
            </p>
          </div>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-500/25 hover:shadow-2xl hover:scale-105 active-press transition-all self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4 stroke-[2.2]" /> Create New List
        </Link>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-2 card-tactile">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Trackilio Lists
          </span>
          <p className="text-4xl font-black font-display text-slate-900">{lists.length}</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-2 card-tactile">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-emerald-500" /> Public Lists
          </span>
          <p className="text-4xl font-black font-display text-slate-900">{publicLists.length}</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-2 card-tactile">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-slate-400" /> Private Lists
          </span>
          <p className="text-4xl font-black font-display text-slate-900">{privateLists.length}</p>
        </div>
      </div>

      {/* Trackilio Lists Grid Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-display text-2xl font-extrabold text-slate-900">
            Your Trackilio Lists ({lists.length})
          </h2>
        </div>

        {lists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lists.map((list) => (
              <WanderListCard key={list.id} list={list} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center space-y-5 shadow-sm max-w-lg mx-auto">
            <div className="h-16 w-16 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center mx-auto shadow-md">
              <Compass className="h-8 w-8 stroke-[2]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-extrabold text-slate-900">
                No Trackilio Lists yet
              </h3>
              <p className="text-slate-500 text-xs font-medium">
                Start building your first travel list for cafes, hidden spots, or upcoming trips.
              </p>
            </div>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 text-white font-bold px-6 py-3 text-xs shadow-lg shadow-violet-500/30 hover:bg-violet-700 active-press transition-colors"
            >
              <PlusCircle className="h-4 w-4" /> Create a Trackilio List
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
