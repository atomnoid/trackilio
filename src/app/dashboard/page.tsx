import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserWanderLists } from '@/services/lists';
import { getUserSavedPlaces } from '@/services/places';
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

  const [profile, lists, savedPlaces] = await Promise.all([
    getProfile(user.id),
    getUserWanderLists(user.id),
    getUserSavedPlaces(user.id),
  ]);

  const displayName = profile?.display_name || user.email?.split('@')[0] || 'Traveler';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <InteractiveDashboard
        userDisplayName={displayName}
        initialLists={lists}
        initialSavedPlaces={savedPlaces}
        userId={user.id}
      />
    </div>
  );
}
