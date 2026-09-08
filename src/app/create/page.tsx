import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createWanderList } from '@/services/lists';
import { PlusCircle, Globe, Lock, MapPin } from 'lucide-react';

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
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EFE6] border border-[#E2DAC8] px-3.5 py-1 text-xs font-bold text-[#18181B]">
          <span className="h-2 w-2 rounded-full bg-[#E0533C]" /> New Travel Collection
        </span>
        <h1 className="font-sans text-4xl font-black text-[#18181B]">
          Create a Trackilio List
        </h1>
        <p className="text-xs sm:text-sm text-[#71717A] font-normal">
          Group cafes, hidden spots, and travel itineraries into a shareable list.
        </p>
      </div>

      <form
        action={handleCreateAction}
        className="bg-white border border-[#E8E3D8] rounded-3xl p-6 sm:p-10 shadow-xs space-y-7"
      >
        {/* Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold text-[#18181B]">
            List Title <span className="text-[#E0533C]">*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g. 7 Days in Kyoto or Best Hidden Cafes in Kolkata"
            className="w-full rounded-xl border border-[#E8E3D8] bg-[#FAF8F3] px-4 py-3 text-xs font-medium text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B] focus:bg-white transition-all"
          />
        </div>

        {/* Destination */}
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold text-[#18181B]">
            Destination / Region
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-[#E0533C]" />
            <input
              type="text"
              name="destination"
              placeholder="e.g. Kyoto, Japan or North Kolkata"
              className="w-full rounded-xl border border-[#E8E3D8] bg-[#FAF8F3] pl-11 pr-4 py-3 text-xs font-medium text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold text-[#18181B]">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Describe what makes this list special, who it's for, or best time to visit..."
            className="w-full rounded-xl border border-[#E8E3D8] bg-[#FAF8F3] px-4 py-3 text-xs font-medium text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B] focus:bg-white transition-all"
          />
        </div>

        {/* Visibility */}
        <div className="space-y-3 pt-3 border-t border-[#E8E3D8]">
          <label className="block text-xs font-extrabold text-[#18181B]">
            List Privacy & Access
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="relative flex items-start gap-3 rounded-2xl border border-[#E8E3D8] p-4 cursor-pointer hover:border-[#18181B] has-[:checked]:border-[#18181B] has-[:checked]:bg-[#FAF8F3] transition-all">
              <input
                type="radio"
                name="isPublic"
                value="true"
                defaultChecked
                className="mt-1 text-[#18181B] focus:ring-[#18181B]"
              />
              <div>
                <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#18181B]">
                  <Globe className="h-4 w-4 text-[#2E7D32]" /> Public List
                </span>
                <p className="text-[11px] text-[#71717A] mt-1 font-medium leading-relaxed">
                  Anyone can discover this list on Discover & search engines.
                </p>
              </div>
            </label>

            <label className="relative flex items-start gap-3 rounded-2xl border border-[#E8E3D8] p-4 cursor-pointer hover:border-[#18181B] has-[:checked]:border-[#18181B] has-[:checked]:bg-[#FAF8F3] transition-all">
              <input
                type="radio"
                name="isPublic"
                value="false"
                className="mt-1 text-[#18181B] focus:ring-[#18181B]"
              />
              <div>
                <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#18181B]">
                  <Lock className="h-4 w-4 text-[#71717A]" /> Private List
                </span>
                <p className="text-[11px] text-[#71717A] mt-1 font-medium leading-relaxed">
                  Only accessible by you and invited collaborators.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-xl bg-[#18181B] hover:bg-[#C8422C] text-white font-bold py-3.5 text-xs shadow-2xs active-press transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="h-4.5 w-4.5 stroke-[2.2]" /> Create Trackilio List
        </button>
      </form>
    </div>
  );
}
