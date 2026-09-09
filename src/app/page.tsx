import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getPublicWanderLists } from '@/services/lists';
import { getTodaysFact } from '@/services/dailyFacts';
import { WanderList } from '@/types/database';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { FunFactWidget } from '@/components/daily-fact/DailyFactCard';
import {
  MapIllustration,
  BlendIllustration,
  SaveFlowIllustration,
  CollabIllustration,
} from '@/components/illustrations/TrackilioIllustrations';
import { ArrowRightIcon } from '@/components/icons/Icons';

export const revalidate = 0;

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  const [featuredLists, todaysFact] = await Promise.all([
    getPublicWanderLists({ limit: 6 }),
    getTodaysFact(),
  ]);

  const fallbackLists: WanderList[] = [
    {
      id: 'demo-1',
      owner_id: 'demo-user',
      title: '7 Days in Kyoto: Cafés & Bamboo Groves',
      description: 'Slow-travel guide to Kyoto including hidden tea houses and morning shrines.',
      destination: 'Kyoto, Japan',
      cover_image: null,
      slug: '7-days-in-kyoto-cafes-bamboo-groves',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner: { id: 'demo-user', display_name: 'Elena Rostova', username: 'elena_travels', avatar_url: null, created_at: '', updated_at: '' },
    },
    {
      id: 'demo-2',
      owner_id: 'demo-user',
      title: 'Best Hidden Cafés in Kolkata',
      description: 'Colonial charm meets third-wave coffee culture across North & South Kolkata.',
      destination: 'Kolkata, India',
      cover_image: null,
      slug: 'best-hidden-cafes-in-kolkata',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner: { id: 'demo-user', display_name: 'Aarav Mehta', username: 'aarav_explores', avatar_url: null, created_at: '', updated_at: '' },
    },
    {
      id: 'demo-3',
      owner_id: 'demo-user',
      title: 'Paris Pastries & Bistro Wine Guide',
      description: 'Authentic Parisian bakeries, natural wine bars, and classic neighborhood bistros.',
      destination: 'Paris, France',
      cover_image: null,
      slug: 'paris-food-bucket-list-pastries-bistro-wine',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner: { id: 'demo-user', display_name: 'Claire Dubois', username: 'claire_paris', avatar_url: null, created_at: '', updated_at: '' },
    },
  ];

  const displayLists = featuredLists.length > 0 ? featuredLists : fallbackLists;

  return (
    <div className="space-y-20 sm:space-y-28 pb-24 overflow-x-hidden bg-[#FAF3E1]">
      {/* 1. HERO SECTION */}
      <section className="pt-8 sm:pt-16 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
            {/* Daily Travel Discovery Widget */}
            {todaysFact && (
              <div className="w-full">
                <FunFactWidget initialFact={todaysFact} variant="hero" />
              </div>
            )}

            <div className="space-y-4">
              <span className="inline-block rounded-full bg-[#F5E7C6] border border-[#E8DECA] px-4 py-1.5 text-xs font-bold text-[#222222]">
                Social travel discovery and planning
              </span>

              <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#222222] leading-[1.08]">
                Find places worth going to.
                <br />
                <span className="text-[#FA8112]">Save them. Share them.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#6B6862] max-w-2xl mx-auto font-normal leading-relaxed">
                Discover cafés, restaurants, date spots, and hidden gems that people actually recommend. Build lists with the people you travel and hang out with.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FA8112] hover:bg-[#E4720A] px-7 py-3.5 text-sm font-extrabold text-white shadow-xs active-press transition-colors"
              >
                <span>Start exploring</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl bg-white border border-[#E8DECA] hover:border-[#222222] px-6 py-3.5 text-sm font-bold text-[#222222] active-press transition-colors"
              >
                <span>See how Trackilio works</span>
              </Link>
            </div>

            {/* Visual Hero Illustration */}
            <div className="w-full pt-6 max-w-3xl">
              <MapIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT IS TRACKILIO? SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#F5E7C6] border border-[#E8DECA] p-8 sm:p-14 text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FA8112]">
              The Flow
            </span>
            <h2 className="font-sans text-2xl sm:text-4xl font-black text-[#222222]">
              Your places. Your people. Your plans.
            </h2>
            <p className="text-sm sm:text-base text-[#6B6862] leading-relaxed">
              Trackilio helps you discover spots, save the ones you love, and turn them into itineraries you can actually use.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            {[
              { step: '1', title: 'Discover', desc: 'Find cafes, spots, and lists from real people' },
              { step: '2', title: 'Save', desc: 'Bookmark places with personal notes' },
              { step: '3', title: 'Plan', desc: 'Group into lists with your travel friends' },
              { step: '4', title: 'Go', desc: 'Ready for your next weekend or journey' },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-2xl p-5 border border-[#E8DECA] space-y-2">
                <span className="inline-block text-xs font-black text-white bg-[#222222] w-6 h-6 rounded-lg text-center leading-6">
                  {s.step}
                </span>
                <h3 className="font-sans text-base font-extrabold text-[#222222]">{s.title}</h3>
                <p className="text-xs text-[#6B6862] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DISCOVER & SMART SEARCH SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FA8112]">
              Discovery & Smart Search
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-black text-[#222222]">
              Don&apos;t know where to go? Start here.
            </h2>
            <p className="text-sm text-[#6B6862] leading-relaxed">
              Search the way you talk. Type &ldquo;best cafés in Kolkata&rdquo; or &ldquo;hidden gems in Goa&rdquo; &mdash; Trackilio understands your intent without requiring rigid filters.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 bg-white border border-[#E8DECA] rounded-xl text-xs font-bold text-[#222222]">
                ☕ Cafés
              </span>
              <span className="px-3 py-1 bg-white border border-[#E8DECA] rounded-xl text-xs font-bold text-[#222222]">
                🍜 Restaurants
              </span>
              <span className="px-3 py-1 bg-white border border-[#E8DECA] rounded-xl text-xs font-bold text-[#222222]">
                ❤️ Date Spots
              </span>
              <span className="px-3 py-1 bg-white border border-[#E8DECA] rounded-xl text-xs font-bold text-[#222222]">
                💎 Hidden Gems
              </span>
              <span className="px-3 py-1 bg-white border border-[#E8DECA] rounded-xl text-xs font-bold text-[#222222]">
                🌿 Nature
              </span>
            </div>
            <div className="pt-2">
              <Link
                href="/discover"
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#FA8112] hover:underline"
              >
                <span>Try discovery search</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8DECA] p-6 sm:p-8 space-y-4">
            <div className="p-3 bg-[#FAF3E1] rounded-2xl border border-[#E8DECA] flex items-center gap-3">
              <span className="text-sm">🔍</span>
              <span className="text-xs font-bold text-[#222222]">&ldquo;top 10 best cafés in Kolkata&rdquo;</span>
            </div>
            <div className="space-y-2 pt-2">
              <div className="p-3 rounded-xl bg-white border border-[#E8DECA] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#222222]">Roastery Coffee House</div>
                  <div className="text-[10px] text-[#6B6862]">Kolkata • Café</div>
                </div>
                <span className="text-xs font-black text-[#FA8112]">▲ 48</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#E8DECA] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#222222]">Blue Tokai Coffee</div>
                  <div className="text-[10px] text-[#6B6862]">Park Street, Kolkata • Café</div>
                </div>
                <span className="text-xs font-black text-[#FA8112]">▲ 35</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SAVE PLACES & BUILD LISTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <SaveFlowIllustration />
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FA8112]">
              Saves & Lists
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-black text-[#222222]">
              Turn random saves into plans.
            </h2>
            <p className="text-sm text-[#6B6862] leading-relaxed">
              See somewhere you like? Save it with one tap. Group saved places into lists for weekend trips, date ideas, or your next dream flight.
            </p>
            <div className="pt-2">
              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#FA8112] hover:underline"
              >
                <span>Create a list now</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COLLABORATION SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FA8112]">
              Collaboration
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-black text-[#222222]">
              Planning with someone? Do it together.
            </h2>
            <p className="text-sm text-[#6B6862] leading-relaxed">
              Invite your friends or partner by @username. Build the list together with simple Editor or Viewer permissions.
            </p>
            <div className="space-y-2 pt-2 text-xs font-semibold text-[#222222]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FA8112]" />
                <span>Editor &mdash; can add &amp; organize places</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#222222]" />
                <span>Viewer &mdash; can vote and leave notes</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <CollabIllustration />
          </div>
        </div>
      </section>

      {/* 6. BLEND SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#F5E7C6] border border-[#E8DECA] p-8 sm:p-14 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#FA8112]">
                Travel Taste Match
              </span>
              <h2 className="font-sans text-3xl sm:text-4xl font-black text-[#222222]">
                How well do you and your person travel together?
              </h2>
              <p className="text-sm text-[#6B6862] leading-relaxed">
                Blend your public lists with any traveler to see how much your travel taste matches. Discover shared places and mutual destinations.
              </p>
              <div className="pt-2">
                <Link
                  href="/blend"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#222222] hover:bg-[#FA8112] px-6 py-3 text-xs font-extrabold text-white active-press transition-colors shadow-xs"
                >
                  <span>Try Blend</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <BlendIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* 7. VOTES & COMMUNITY SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Voting Box */}
          <div className="bg-white rounded-3xl border border-[#E8DECA] p-8 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FA8112]">
              Community Voting
            </span>
            <h3 className="font-sans text-2xl font-black text-[#222222]">
              Not every recommendation is worth the hype.
            </h3>
            <p className="text-xs text-[#6B6862] leading-relaxed">
              Upvote places you love. Downvote the ones you wouldn&apos;t recommend. See what the community honestly thinks.
            </p>
            <div className="p-4 bg-[#FAF3E1] rounded-2xl border border-[#E8DECA] flex items-center justify-between">
              <div>
                <div className="text-xs font-extrabold text-[#222222]">Fushimi Inari Taisha</div>
                <div className="text-[10px] text-[#6B6862]">Kyoto, Japan</div>
              </div>
              <div className="flex items-center gap-2 text-xs font-black">
                <span className="text-[#FA8112]">▲ 128</span>
                <span className="text-[#6B6862]">▼ 7</span>
              </div>
            </div>
          </div>

          {/* Comments Box */}
          <div className="bg-white rounded-3xl border border-[#E8DECA] p-8 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FA8112]">
              Real Notes
            </span>
            <h3 className="font-sans text-2xl font-black text-[#222222]">
              Leave a note for the next person.
            </h3>
            <p className="text-xs text-[#6B6862] leading-relaxed">
              Tell travelers what you wish you knew before visiting. Helpful tips, best timings, and secret orders.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#FAF3E1] rounded-xl border border-[#E8DECA] text-[#222222] font-medium">
                &ldquo;Go early at 7 AM. It gets very crowded after 9.&rdquo;
              </div>
              <div className="p-3 bg-[#FAF3E1] rounded-xl border border-[#E8DECA] text-[#222222] font-medium">
                &ldquo;Great spot for a date, but make sure to book ahead.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FEATURED COMMUNITY LISTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E8DECA]">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FA8112]">
              Community Collections
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-black text-[#222222]">
              Discover lists made by real people.
            </h2>
          </div>

          <Link
            href="/discover"
            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#222222] hover:text-[#FA8112] transition-colors shrink-0"
          >
            <span>Explore all lists</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayLists.map((list) => (
            <WanderListCard key={list.id} list={list} />
          ))}
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#222222] p-8 sm:p-14 text-center text-white space-y-6">
          <h2 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-[#FAF3E1]">
            Start planning your next outing today.
          </h2>
          <p className="text-sm sm:text-base text-[#F5E7C6] max-w-lg mx-auto leading-relaxed">
            Join Trackilio to collect your favorite spots, build lists with friends, and find places worth remembering.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FA8112] hover:bg-[#E4720A] text-white px-8 py-3.5 text-xs font-extrabold shadow-xs active-press transition-colors"
            >
              <span>Get Started Free</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FAF3E1] hover:bg-[#F5E7C6] text-[#222222] px-7 py-3.5 text-xs font-extrabold transition-colors"
            >
              Browse Guides
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
