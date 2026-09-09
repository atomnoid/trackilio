import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BlendForm } from '@/components/blend/BlendForm';
import { getUserBlendSessions } from '@/services/blend';
import { BlendHistoryCard } from '@/components/blend/BlendHistoryCard';
import { Sparkles, Users, MapPin, Shuffle, HeartHandshake } from 'lucide-react';

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

  // Load user's saved blend sessions
  const userBlends = await getUserBlendSessions(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14 space-y-12">
      {/* Serene Header */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white px-4 py-1.5 text-xs font-extrabold shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Travel Taste Match
        </span>
        <h1 className="font-sans text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
          What&apos;s your{' '}
          <span className="bg-gradient-to-r from-[#FF5841] to-[#C53678] bg-clip-text text-transparent">
            Blend?
          </span>
        </h1>
        <p className="text-sm sm:text-base text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
          Enter any traveler&apos;s @username to calculate your compatibility score based on shared dream spots, destinations, and travel styles.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="space-y-1 pb-2 border-b border-gray-100">
          <h2 className="font-sans text-base font-black text-gray-900 flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-[#FF5841]" /> Start New Blend
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            Saved to both of your Blend history lists automatically.
          </p>
        </div>
        <BlendForm prefillUsername={prefillUsername} />
      </div>

      {/* Saved Blends Section */}
      {userBlends.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 className="font-sans text-xl font-black text-gray-900 flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-[#C53678]" /> Your Saved Blends
            </h2>
            <span className="text-xs font-bold text-[#FF5841] bg-[#FFEAE6] px-2.5 py-1 rounded-full border border-[#FFD3CC]">
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
      <div className="rounded-3xl bg-[#FFEAE6]/30 border border-[#FFD3CC]/50 p-6 sm:p-8 space-y-6">
        <h2 className="font-sans text-base font-black text-gray-900">
          How Blend works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Users className="h-5 w-5 text-[#FF5841]" />,
              title: 'Public lists only',
              desc: 'Compares public travel lists only — private guides stay completely confidential.',
            },
            {
              icon: <MapPin className="h-5 w-5 text-[#C53678]" />,
              title: 'Place & vibe overlap',
              desc: "Scores match % based on overlapping spots, countries, and categories.",
            },
            {
              icon: <Shuffle className="h-5 w-5 text-[#FF5841]" />,
              title: 'Two-way saved blends',
              desc: 'Both travelers get access to the saved Blend in their dashboard profile.',
            },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-2xl bg-white border border-gray-100 space-y-2.5">
              <div className="h-9 w-9 rounded-xl bg-[#FFEAE6] border border-[#FFD3CC] flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="font-sans text-xs font-black text-gray-900">
                {item.title}
              </h3>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
