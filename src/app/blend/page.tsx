import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BlendForm } from '@/components/blend/BlendForm';
import { getUserBlendSessions } from '@/services/blend';
import { BlendHistoryCard } from '@/components/blend/BlendHistoryCard';
import { BlendIllustration } from '@/components/illustrations/TrackilioIllustrations';

export const metadata: Metadata = {
  title: 'Blend — Travel Taste Match | Trackilio',
  description:
    'Compare travel tastes with anyone on Trackilio. Discover shared places, destinations, and travel vibes. Saved automatically for both travelers!',
};

interface BlendPageProps {
  searchParams: Promise<{ with?: string }>;
}

export default async function BlendPage({ searchParams }: BlendPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/blend');
  }

  const resolvedParams = await searchParams;
  const prefillUsername = resolvedParams.with || '';

  const userBlends = await getUserBlendSessions(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14 space-y-12 bg-[#FAF3E1]">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="inline-block rounded-full bg-[#F5E7C6] border border-[#E8DECA] px-4 py-1 text-xs font-extrabold text-[#222222]">
          Travel Taste Match
        </span>
        <h1 className="font-sans text-4xl sm:text-5xl font-black text-[#222222] leading-tight">
          What&apos;s your <span className="text-[#FA8112]">Blend?</span>
        </h1>
        <p className="text-sm sm:text-base text-[#6B6862] font-normal max-w-md mx-auto leading-relaxed">
          Enter any traveler&apos;s @username to calculate your compatibility score based on shared places and destinations.
        </p>

        <div className="pt-2 max-w-md mx-auto">
          <BlendIllustration />
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl bg-white border border-[#E8DECA] p-6 sm:p-8 space-y-5">
        <div className="space-y-1 pb-2 border-b border-[#E8DECA]">
          <h2 className="font-sans text-base font-black text-[#222222]">
            Start a New Blend
          </h2>
          <p className="text-xs text-[#6B6862]">
            Saved to both of your profiles automatically.
          </p>
        </div>
        <BlendForm prefillUsername={prefillUsername} />
      </div>

      {/* Saved Blends Section */}
      {userBlends.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8DECA]">
            <h2 className="font-sans text-lg font-black text-[#222222]">
              Your Saved Blends
            </h2>
            <span className="text-xs font-bold text-[#222222] bg-[#F5E7C6] px-2.5 py-0.5 rounded-full">
              {userBlends.length} match{userBlends.length !== 1 ? 'es' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userBlends.map((b) => (
              <BlendHistoryCard key={b.id} blend={b} />
            ))}
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="rounded-2xl bg-[#F5E7C6] border border-[#E8DECA] p-6 sm:p-8 space-y-4">
        <h2 className="font-sans text-base font-black text-[#222222]">
          How Blend works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Public lists only',
              desc: 'Compares public travel lists only — private guides stay completely confidential.',
            },
            {
              title: 'Place & vibe overlap',
              desc: 'Scores match % based on overlapping spots, countries, and categories.',
            },
            {
              title: 'Two-way saved blends',
              desc: 'Both travelers get access to the saved Blend in their dashboard.',
            },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-xl bg-white border border-[#E8DECA] space-y-1.5">
              <h3 className="font-sans text-xs font-black text-[#222222]">
                {item.title}
              </h3>
              <p className="text-[11px] text-[#6B6862] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
