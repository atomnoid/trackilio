import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BlendForm } from '@/components/blend/BlendForm';
import { Sparkles, Users, MapPin, Shuffle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blend — Travel Taste Match | Trackilio',
  description:
    'Compare travel tastes with anyone on Trackilio. Discover what places, destinations, and categories you both love. Find your Travel Twin!',
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

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#4A6B5D] text-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          Travel Taste Match
        </span>
        <h1 className="font-sans text-4xl sm:text-5xl font-black text-[#2C2A29] leading-tight">
          What's your{' '}
          <span className="font-serif italic text-[#4A6B5D] font-normal">
            Blend?
          </span>
        </h1>
        <p className="text-sm sm:text-base text-[#78726D] font-medium max-w-md mx-auto leading-relaxed">
          Enter a Trackilio username to see how your travel interests align. We'll score your match based on shared places, destinations, and travel categories.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-3xl bg-white border border-[#E6DFD5] p-8 shadow-sm space-y-6">
        <BlendForm prefillUsername={prefillUsername} />
      </div>

      {/* How it works */}
      <div className="rounded-3xl bg-[#F5F1E8] border border-[#E6DFD5] p-8 space-y-6">
        <h2 className="font-sans text-base font-black text-[#2C2A29]">
          How Blend works
        </h2>
        <div className="space-y-4">
          {[
            {
              icon: <Users className="h-5 w-5 text-[#4A6B5D]" />,
              title: 'Public lists only',
              desc: 'Blend only compares public travel lists — your private lists stay completely private.',
            },
            {
              icon: <MapPin className="h-5 w-5 text-[#4A6B5D]" />,
              title: 'Place & destination overlap',
              desc: "We compare places you've both saved, shared destinations, and travel categories.",
            },
            {
              icon: <Shuffle className="h-5 w-5 text-[#4A6B5D]" />,
              title: 'Shareable results',
              desc: 'Get a unique link to share your Blend score with friends on social media.',
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="mt-0.5 shrink-0 h-9 w-9 rounded-xl bg-white border border-[#E6DFD5] flex items-center justify-center shadow-sm">
                {item.icon}
              </div>
              <div>
                <h3 className="font-sans text-sm font-bold text-[#2C2A29]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#78726D] font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
