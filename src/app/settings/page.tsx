import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProfile, updateProfile } from '@/services/profiles';

export const metadata: Metadata = {
  title: 'Account Settings',
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
    <div className="mx-auto max-w-xl px-4 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="font-editorial text-3xl font-bold text-stone-900">Account Settings</h1>
        <p className="text-sm text-stone-600">Update your profile details and preferences</p>
      </div>

      <form action={handleUpdateProfile} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Display Name</label>
          <input
            type="text"
            name="displayName"
            defaultValue={profile?.display_name || ''}
            required
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Email (Read Only)</label>
          <input
            type="email"
            value={user.email || ''}
            disabled
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-400 bg-stone-50 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-stone-900 text-white font-semibold py-2.5 text-sm hover:bg-stone-800 transition-colors shadow-sm"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
