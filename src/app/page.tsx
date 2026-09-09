import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Compass, Plus, Users, Sparkles, MapPin } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getPublicWanderLists } from '@/services/lists';
import { getTodaysFact } from '@/services/dailyFacts';
import { WanderList } from '@/types/database';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { FunFactWidget } from '@/components/daily-fact/DailyFactCard';

export const revalidate = 0; // Dynamic check for user auth state

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is already signed in, immediately redirect to their dashboard / travel lists
  if (user) {
    redirect('/dashboard');
  }

  const [featuredLists, todaysFact] = await Promise.all([
    getPublicWanderLists({ limit: 6 }),
    getTodaysFact(),
  ]);

  // Fallback demo data if DB has no lists yet
  const fallbackLists: WanderList[] = [
    {
      id: 'demo-1',
      owner_id: 'demo-user',
      title: '7 Days in Kyoto: Cafes & Bamboo Groves',
      description: 'The ultimate slow-travel guide to Kyoto including hidden tea houses and early morning shrines.',
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
      title: 'Best Hidden Cafes in Kolkata',
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
      title: 'Paris Food Bucket List: Pastries & Bistro Wine',
      description: 'A curated list of authentic Parisian bakeries, natural wine bars, and classic bistros.',
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
    <div className="space-y-24 pb-24 overflow-x-hidden">
      {/* Hero Section — Flat, Bold, Mila-inspired */}
      <section className="relative pt-10 sm:pt-20 pb-16 overflow-hidden">
        {/* Ambient background blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#FF5841]/10 blur-3xl pointer-events-none" />
        <div className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-[#C53678]/10 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-7">
            {/* Top Interactive Fun Fact Widget */}
            {todaysFact && (
              <div className="w-full pb-2 animate-fade-in">
                <FunFactWidget initialFact={todaysFact} variant="hero" />
              </div>
            )}

            {/* Eyebrow */}
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFEAE6] border border-[#FFD3CC] px-4 py-1.5 text-xs font-black text-[#FF5841]">
              <span className="h-2 w-2 rounded-full bg-[#FF5841] animate-pulse" />
              Collaborative Travel Lists & Taste Blend
            </span>

            {/* Headline */}
            <h1 className="font-sans text-5xl sm:text-7xl font-black tracking-tight text-gray-900 leading-[1.05]">
              Collect places.{' '}
              <br className="hidden sm:block" />
              Plan{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-[#FF5841] to-[#C53678] bg-clip-text text-transparent">
                  together.
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5841] to-[#C53678] rounded-full opacity-30" />
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-xl text-gray-500 max-w-2xl leading-relaxed font-normal">
              Trackilio helps you organize cafes, viewpoints, and dream journeys into beautiful, shareable guides. Invite friends by @username to collaborate and discover your shared travel vibe.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#FF5841] hover:bg-[#E84430] px-8 py-4 text-sm font-black text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active-press"
              >
                <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
                <span>Create your first list</span>
              </Link>

              <Link
                href="/blend"
                className="inline-flex items-center gap-2 rounded-2xl bg-white border-2 border-[#FF5841]/20 hover:border-[#FF5841]/60 px-7 py-4 text-sm font-bold text-[#C53678] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active-press"
              >
                <Sparkles className="h-4.5 w-4.5 text-[#FF5841]" />
                <span>Match Travel Blend</span>
              </Link>

              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 px-7 py-4 text-sm font-bold text-gray-600 hover:text-gray-900 transition-all hover:-translate-y-0.5 active-press"
              >
                <Compass className="h-4.5 w-4.5" />
                <span>Explore Guides</span>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#FF5841]" />
                Save any place
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#C53678]" />
                Invite by @username
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#FF5841]" />
                Discover travel matches
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards: How It Works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black tracking-widest uppercase text-[#FF5841]">
            How Trackilio Works
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl font-black text-gray-900">
            Plan your next adventure in 4 steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Collect Places',
              description: 'Save cafes, viewpoints, hotels, and local gems with custom notes and Google Maps links.',
              emoji: '📍',
              color: 'from-[#FF5841] to-[#FF7A5C]',
              bg: 'bg-[#FFEAE6]',
            },
            {
              step: '02',
              title: 'Organize Priorities',
              description: 'Group spots by Must Visit, Want to Visit, and Visited to streamline your daily itineraries.',
              emoji: '🗂️',
              color: 'from-[#C53678] to-[#E05090]',
              bg: 'bg-[#F9E2EE]',
            },
            {
              step: '03',
              title: 'Collaborate Live',
              description: 'Invite any @username as an Editor or Viewer to co-build itineraries in real-time with friends.',
              emoji: '🤝',
              color: 'from-[#FF5841] to-[#C53678]',
              bg: 'bg-[#FFEAE6]',
            },
            {
              step: '04',
              title: 'Blend Travel Taste',
              description: 'Discover matching places and destinations with travel twins — results saved for both automatically.',
              emoji: '✨',
              color: 'from-[#C53678] to-[#FF5841]',
              bg: 'bg-[#F9E2EE]',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="group bg-white p-6 rounded-3xl border border-gray-100 hover:border-[#FF5841]/20 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 space-y-4"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg} text-2xl`}>
                {item.emoji}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                    {item.step}
                  </span>
                  <h3 className="font-sans text-base font-black text-gray-900">{item.title}</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Community Travel Lists */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF5841]">
              Community Guides
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-black text-gray-900">
              Trending Itineraries & Collections
            </h2>
          </div>

          <Link
            href="/discover"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#C53678] hover:text-[#FF5841] transition-colors shrink-0"
          >
            <span>Explore all lists</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayLists.map((list) => (
            <WanderListCard key={list.id} list={list} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FF5841] to-[#C53678] p-8 sm:p-14 text-center text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative z-10 space-y-5">
            <h2 className="font-sans text-3xl sm:text-4xl font-black tracking-tight">
              Start planning your next trip today
            </h2>
            <p className="text-sm sm:text-base font-medium opacity-85 max-w-xl mx-auto">
              Join Trackilio and create beautiful, collaborative travel lists in minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-2xl bg-white text-[#FF5841] px-8 py-4 text-sm font-black shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active-press"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                Get Started Free
              </Link>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/40 hover:border-white/70 text-white px-7 py-4 text-sm font-bold transition-all hover:-translate-y-0.5"
              >
                <Compass className="h-4 w-4" />
                Browse Guides
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
