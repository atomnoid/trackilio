import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProfile, updateProfile } from '@/services/profiles';

export const metadata: Metadata = {
  title: 'Account Settings | Trackilio',
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

  async function handleUpdateProfile(formData: FormData) {
    'use server';
    const displayName = formData.get('displayName') as string;
    const currentSupabase = await createClient();
    const { data: currentUser } = await currentSupabase.auth.getUser();

    if (currentUser.user && displayName?.trim()) {
      await updateProfile(currentUser.user.id, {
        display_name: displayName.trim(),
      });
    }

    redirect('/settings');
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 space-y-6">
      <div className="space-y-1">
        <h1 className="font-sans text-3xl font-black text-[#18181B]">Account Settings</h1>
        <p className="text-xs text-[#71717A] font-medium">Update your display name and profile details</p>
      </div>

      <form action={handleUpdateProfile} className="bg-white border border-[#E8E3D8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#18181B]">Display Name</label>
          <input
            type="text"
            name="displayName"
            defaultValue={profile?.display_name || ''}
            required
            className="w-full rounded-xl border border-[#E8E3D8] bg-[#FAF8F3] px-4 py-3 text-xs font-medium text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B] focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#18181B]">Email Address (Read Only)</label>
          <input
            type="email"
            value={user.email || ''}
            disabled
            className="w-full rounded-xl border border-[#E8E3D8] px-4 py-3 text-xs text-[#71717A] bg-[#FAF8F3] cursor-not-allowed font-medium"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#18181B] hover:bg-[#C8422C] text-white font-bold py-3 text-xs shadow-2xs active-press transition-all"
        >
          Save Profile Changes
        </button>
      </form>
    </div>
  );
}
