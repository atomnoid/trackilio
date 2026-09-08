import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createWanderList } from '@/services/lists';
import { PlusCircle, Globe, Lock, Sparkles, MapPin } from 'lucide-react';
import { ListCover } from '@/components/lists/ListCover';

export const metadata: Metadata = {
  title: 'Create a Trackilio List',
  description: 'Organize your travel plans and share recommendations with Trackilio.',
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
      isPublic,
    });

    if (res.slug) {
      redirect(`/l/${res.slug}`);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3.5 py-1 text-xs font-bold text-violet-700">
          <Sparkles className="h-3.5 w-3.5 text-violet-600" /> New Collection
        </span>
        <h1 className="font-display text-4xl font-black text-slate-900">
          Create a Trackilio List
        </h1>
        <p className="text-sm text-slate-600 font-normal">
          Group places, cafes, bucket list spots, and itinerary notes for your next trip.
        </p>
      </div>

      <form
        action={handleCreateAction}
        className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-violet-500/5 space-y-8"
      >
        {/* Step 1: Title */}
        <div className="space-y-2">
          <label className="block text-sm font-extrabold text-slate-900">
            List Title <span className="text-violet-600">*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g. 7 Days in Kyoto or Best Hidden Cafes in Kolkata"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white transition-all"
          />
        </div>

        {/* Step 2: Destination */}
        <div className="space-y-2">
          <label className="block text-sm font-extrabold text-slate-900">
            Destination / Region
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-violet-600" />
            <input
              type="text"
              name="destination"
              placeholder="e.g. Kyoto, Japan or North Kolkata"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Step 3: Description */}
        <div className="space-y-2">
          <label className="block text-sm font-extrabold text-slate-900">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Describe what makes this list special, who it's for, or the best time to visit..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white transition-all"
          />
        </div>

        {/* Step 4: Visibility Selection */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="block text-sm font-extrabold text-slate-900">
            List Visibility
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="relative flex items-start gap-3 rounded-2xl border-2 border-slate-200 p-4 cursor-pointer hover:border-violet-500 has-[:checked]:border-violet-600 has-[:checked]:bg-violet-50/40 transition-all">
              <input
                type="radio"
                name="isPublic"
                value="true"
                defaultChecked
                className="mt-1 text-violet-600 focus:ring-violet-600"
              />
              <div>
                <span className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                  <Globe className="h-4 w-4 text-emerald-600" /> Public List
                </span>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Anyone can discover this list on Explore & search engines.
                </p>
              </div>
            </label>

            <label className="relative flex items-start gap-3 rounded-2xl border-2 border-slate-200 p-4 cursor-pointer hover:border-violet-500 has-[:checked]:border-violet-600 has-[:checked]:bg-violet-50/40 transition-all">
              <input
                type="radio"
                name="isPublic"
                value="false"
                className="mt-1 text-violet-600 focus:ring-violet-600"
              />
              <div>
                <span className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                  <Lock className="h-4 w-4 text-slate-600" /> Private List
                </span>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Only people you invite can see or edit this list.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-extrabold py-4 text-sm shadow-xl shadow-violet-500/25 hover:shadow-2xl hover:shadow-violet-500/35 hover:scale-[1.01] active-press transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="h-5 w-5 stroke-[2.2]" /> Create Trackilio List
        </button>
      </form>
    </div>
  );
}
