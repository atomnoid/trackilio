import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserWanderLists } from '@/services/lists';
import { getProfile } from '@/services/profiles';
import { InteractiveDashboard } from '@/components/dashboard/InteractiveDashboard';

export const metadata: Metadata = {
  title: 'Your Workspace | Trackilio',
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
  const displayName = profile?.display_name || user.email?.split('@')[0] || 'Traveler';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <InteractiveDashboard
        userDisplayName={displayName}
        initialLists={lists}
        userId={user.id}
      />
    </div>
  );
}
