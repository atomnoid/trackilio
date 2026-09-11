import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CreateListForm } from '@/components/lists/CreateListForm';

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

      <CreateListForm />
    </div>
  );
}
