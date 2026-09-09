import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserWanderLists, getUserCollaboratedLists } from '@/services/lists';
import { getUserSavedPlaces } from '@/services/places';
import { getProfile } from '@/services/profiles';
import { getUserBlendSessions } from '@/services/blend';
import { InteractiveDashboard } from '@/components/dashboard/InteractiveDashboard';

export const metadata: Metadata = {
  title: 'My Travel Hub & Collaborated Lists | Trackilio',
  description: 'Manage your curated lists, collaborative itineraries, and Travel Blend matches.',
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

  const [profile, ownedLists, collabLists, savedPlaces, blendSessions] = await Promise.all([
    getProfile(user.id),
    getUserWanderLists(user.id),
    getUserCollaboratedLists(user.id),
    getUserSavedPlaces(user.id),
    getUserBlendSessions(user.id),
  ]);

  const displayName = profile?.display_name || user.email?.split('@')[0] || 'Traveler';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <InteractiveDashboard
        userDisplayName={displayName}
        initialLists={ownedLists}
        initialCollabLists={collabLists}
        initialSavedPlaces={savedPlaces}
        initialBlendSessions={blendSessions}
        userId={user.id}
      />
    </div>
  );
}
