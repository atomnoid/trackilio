import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getUserWanderLists } from '@/services/lists';
import { getProfile } from '@/services/profiles';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { Plus, Compass, Globe, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Your Adventures | Trackilio',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#E8E3D8] pb-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-[#18181B] text-white font-black text-xl flex items-center justify-center border border-[#18181B] shadow-xs">
            {profile?.display_name?.charAt(0).toUpperCase() || 'T'}
          </div>
          <div className="space-y-0.5">
            <h1 className="font-sans text-3xl font-black text-[#18181B]">
              Your adventures
            </h1>
            <p className="text-xs font-medium text-[#71717A]">
              Welcome back, {profile?.display_name || 'Traveler'}. Manage your travel lists.
            </p>
          </div>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center gap-2 rounded-xl bg-[#18181B] hover:bg-[#C8422C] px-5 py-3 text-xs font-bold text-white shadow-2xs active-press transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" /> Create new list
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E8E3D8] rounded-2xl p-5 shadow-2xs space-y-1 editorial-card">
          <span className="text-[11px] font-extrabold text-[#71717A] uppercase tracking-wider">
            Total Lists
          </span>
          <p className="text-3xl font-black font-sans text-[#18181B]">{lists.length}</p>
        </div>

        <div className="bg-white border border-[#E8E3D8] rounded-2xl p-5 shadow-2xs space-y-1 editorial-card">
          <span className="text-[11px] font-extrabold text-[#2E7D32] uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-[#2E7D32]" /> Public Guides
          </span>
          <p className="text-3xl font-black font-sans text-[#18181B]">{publicLists.length}</p>
        </div>

        <div className="bg-white border border-[#E8E3D8] rounded-2xl p-5 shadow-2xs space-y-1 editorial-card">
          <span className="text-[11px] font-extrabold text-[#71717A] uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-[#71717A]" /> Private Lists
          </span>
          <p className="text-3xl font-black font-sans text-[#18181B]">{privateLists.length}</p>
        </div>
      </div>

      {/* Trackilio Lists Grid Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8E3D8] pb-3">
          <h2 className="font-sans text-2xl font-black text-[#18181B]">
            My Lists ({lists.length})
          </h2>
        </div>

        {lists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lists.map((list) => (
              <WanderListCard key={list.id} list={list} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-[#E8E3D8] p-12 text-center space-y-4 shadow-2xs max-w-lg mx-auto">
            <div className="h-14 w-14 rounded-2xl bg-[#F3EFE6] text-[#18181B] flex items-center justify-center mx-auto">
              <Compass className="h-7 w-7 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-sans text-xl font-bold text-[#18181B]">
                No adventures yet
              </h3>
              <p className="text-[#71717A] text-xs font-medium">
                Start collecting places for your next trip.
              </p>
            </div>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl bg-[#18181B] text-white font-extrabold px-5 py-2.5 text-xs shadow-2xs hover:bg-[#C8422C] active-press transition-colors"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" /> Create your first list
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
