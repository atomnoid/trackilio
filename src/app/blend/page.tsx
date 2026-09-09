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
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C5ADC5] to-[#B2B5E0] text-white px-4 py-1.5 text-xs font-extrabold shadow-2xs">
          <Sparkles className="h-3.5 w-3.5" />
          Travel Taste Match
        </span>
        <h1 className="font-sans text-4xl sm:text-5xl font-black text-[#2A2735] leading-tight">
          What&apos;s your{' '}
          <span className="bg-gradient-to-r from-[#8E6D8E] to-[#6469AC] bg-clip-text text-transparent italic font-serif font-normal">
            Blend?
          </span>
        </h1>
        <p className="text-sm sm:text-base text-[#595567] font-medium max-w-md mx-auto leading-relaxed">
          Enter any traveler&apos;s @username to calculate your compatibility score based on shared dream spots, destinations, and travel styles.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-[#E7E0EE] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="space-y-1 pb-2 border-b border-[#F3EFF7]">
          <h2 className="font-sans text-base font-black text-[#2A2735] flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-[#6469AC]" /> Start New Blend
          </h2>
          <p className="text-xs text-[#847F95] font-medium">
            Saved to both of your Blend history lists automatically.
          </p>
        </div>
        <BlendForm prefillUsername={prefillUsername} />
      </div>

      {/* Saved Blends Section */}
      {userBlends.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#E7E0EE]">
            <h2 className="font-sans text-xl font-black text-[#2A2735] flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-[#6469AC]" /> Your Saved Blends
            </h2>
            <span className="text-xs font-bold text-[#8E6D8E] bg-[#F6F1F6] px-2.5 py-1 rounded-full border border-[#E7E0EE]">
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
      <div className="rounded-3xl bg-gradient-to-br from-[#F6F1F6] via-[#FAF9FC] to-[#F1F3FB] border border-[#E7E0EE] p-6 sm:p-8 space-y-6">
        <h2 className="font-sans text-base font-black text-[#2A2735]">
          How Blend works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Users className="h-5 w-5 text-[#6469AC]" />,
              title: 'Public lists only',
              desc: 'Compares public travel lists only — private guides stay completely confidential.',
            },
            {
              icon: <MapPin className="h-5 w-5 text-[#8E6D8E]" />,
              title: 'Place & vibe overlap',
              desc: "Scores match % based on overlapping spots, countries, and categories.",
            },
            {
              icon: <Shuffle className="h-5 w-5 text-[#6469AC]" />,
              title: 'Two-way saved blends',
              desc: 'Both travelers get access to the saved Blend in their dashboard profile.',
            },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-2xl bg-white/80 border border-[#E7E0EE] space-y-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#F6F1F6] to-[#F1F3FB] border border-[#E7E0EE] flex items-center justify-center shadow-2xs">
                {item.icon}
              </div>
              <h3 className="font-sans text-xs font-black text-[#2A2735]">
                {item.title}
              </h3>
              <p className="text-[11px] text-[#595567] font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
