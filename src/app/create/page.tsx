import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createWanderList } from '@/services/lists';
import { PlusCircle, Globe, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Create a New WanderList',
  description: 'Organize your travel plans and share recommendations.',
  robots: { index: false, follow: false },
};

export default async function CreatePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/create');
  }

  async function handleCreateAction(formData: FormData) {
    'use server';

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const destination = formData.get('destination') as string;
    const coverImage = formData.get('coverImage') as string;
    const isPublic = formData.get('isPublic') === 'true';

    if (!title || !title.trim()) {
      return;
    }

    const currentSupabase = await createClient();
    const { data: currentUser } = await currentSupabase.auth.getUser();
    if (!currentUser.user) return;

    const res = await createWanderList({
      ownerId: currentUser.user.id,
      title: title.trim(),
      description: description?.trim(),
      destination: destination?.trim(),
      coverImage: coverImage?.trim(),
      isPublic,
    });

    if (res.slug) {
      redirect(`/l/${res.slug}`);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="font-editorial text-4xl font-bold text-stone-900">
          Create a WanderList
        </h1>
        <p className="text-sm text-stone-600">
          Group places, cafes, bucket list spots, and itinerary notes.
        </p>
      </div>

      <form action={handleCreateAction} className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-stone-900 mb-1">
            List Title *
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g. My 7 Days in Japan or Best Cafes in Kolkata"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-900 mb-1">
            Destination / Region
          </label>
          <input
            type="text"
            name="destination"
            placeholder="e.g. Kyoto, Japan or Himachal Pradesh"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-900 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Describe what makes this list special, who it's for, or best time to visit..."
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-900 mb-1">
            Cover Image URL (Optional)
          </label>
          <input
            type="url"
            name="coverImage"
            placeholder="https://images.unsplash.com/..."
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="space-y-2 pt-2 border-t border-stone-100">
          <label className="block text-sm font-semibold text-stone-900">
            Privacy & Visibility
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="relative flex items-start gap-3 rounded-xl border border-stone-200 p-4 cursor-pointer hover:border-amber-500 has-[:checked]:border-amber-600 has-[:checked]:bg-amber-50/40">
              <input type="radio" name="isPublic" value="true" defaultChecked className="mt-1" />
              <div>
                <span className="flex items-center gap-1 text-sm font-bold text-stone-900">
                  <Globe className="h-4 w-4 text-emerald-700" /> Public
                </span>
                <p className="text-xs text-stone-500 mt-0.5">
                  Discoverable on Explore & search engines.
                </p>
              </div>
            </label>

            <label className="relative flex items-start gap-3 rounded-xl border border-stone-200 p-4 cursor-pointer hover:border-amber-500 has-[:checked]:border-amber-600 has-[:checked]:bg-amber-50/40">
              <input type="radio" name="isPublic" value="false" className="mt-1" />
              <div>
                <span className="flex items-center gap-1 text-sm font-bold text-stone-900">
                  <Lock className="h-4 w-4 text-stone-600" /> Private
                </span>
                <p className="text-xs text-stone-500 mt-0.5">
                  Only accessible by you and invited collaborators.
                </p>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-stone-900 text-white font-semibold py-3 text-sm hover:bg-stone-800 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <PlusCircle className="h-4 w-4" /> Create WanderList
        </button>
      </form>
    </div>
  );
}
