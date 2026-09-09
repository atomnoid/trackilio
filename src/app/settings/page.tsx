import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/services/profiles';
import { SettingsForm } from '@/components/settings/SettingsForm';
import { Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Account Settings | Trackilio',
  description: 'Manage your unique username, display name, bio, and profile settings.',
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/settings');
  }

  const profile = await getProfile(user.id);

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:py-12 space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEAE6] border border-[#FFD3CC] px-3 py-1 text-xs font-bold text-[#FF5841]">
          <Settings className="h-3.5 w-3.5" /> Account & Profile
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          Customize your @username, bio, location, and travel identity.
        </p>
      </div>

      <SettingsForm initialProfile={profile} userEmail={user.email || ''} userId={user.id} />
    </div>
  );
}
