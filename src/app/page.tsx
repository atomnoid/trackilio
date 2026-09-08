import Link from 'next/link';
import { Sparkles, ArrowRight, Compass, Plus, MapPin, Heart, Shield, Users } from 'lucide-react';
import { getPublicWanderLists } from '@/services/lists';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { HeroMap } from '@/components/illustrations/HeroMap';
import {
  CollectIllustration,
  OrganizeIllustration,
  PlanIllustration,
  ShareIllustration,
} from '@/components/illustrations/StoryIllustrations';

export const revalidate = 60; // Refresh public landing every 60s

export default async function HomePage() {
  const featuredLists = await getPublicWanderLists({ limit: 6 });

  // Fallback demo data if DB has no lists yet
  const fallbackLists = [
    {
      id: 'demo-1',
      owner_id: 'demo-user',
      title: '7 Days in Kyoto: Cafes & Bamboo Groves',
      description: 'The ultimate slow-travel guide to Kyoto including hidden tea houses and early morning shrines.',
      destination: 'Kyoto, Japan',
      slug: '7-days-in-kyoto-cafes-bamboo-groves',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner: { id: 'demo-user', display_name: 'Elena Rostova', avatar_url: null, created_at: '', updated_at: '' },
    },
    {
      id: 'demo-2',
      owner_id: 'demo-user',
      title: 'Best Hidden Cafes in Kolkata',
      description: 'Colonial charm meets third-wave coffee culture across North & South Kolkata.',
      destination: 'Kolkata, India',
      slug: 'best-hidden-cafes-in-kolkata',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner: { id: 'demo-user', display_name: 'Aarav Mehta', avatar_url: null, created_at: '', updated_at: '' },
    },
    {
      id: 'demo-3',
      owner_id: 'demo-user',
      title: 'Paris Food Bucket List: Pastries & Bistro Wine',
      description: 'A curated list of authentic Parisian bakeries, natural wine bars, and classic bistros.',
      destination: 'Paris, France',
      slug: 'paris-food-bucket-list-pastries-bistro-wine',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner: { id: 'demo-user', display_name: 'Claire Dubois', avatar_url: null, created_at: '', updated_at: '' },
    },
  ];

  const displayLists = featuredLists.length > 0 ? featuredLists : fallbackLists;

  return (
    <div className="space-y-24 pb-24 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-14 pb-16 bg-gradient-to-b from-violet-100/60 via-[#F8F7FF] to-[#F8F7FF] overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 border border-violet-200 px-4 py-1.5 text-xs font-bold text-violet-800 shadow-sm">
                <Sparkles className="h-4 w-4 text-violet-600 animate-pulse" />
                Collaborative Travel Lists & Spot Discovery
              </div>

              <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                Collect places. <br />
                Plan trips. <br />
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-rose-500 bg-clip-text text-transparent">
                  Go explore.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
                Trackilio helps you organize cafes, hidden spots, and travel itineraries into beautifully shareable lists. Collaborate with friends and discover travel guides worldwide.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/40 hover:scale-[1.03] active-press transition-all"
                >
                  <Plus className="h-5 w-5 stroke-[3]" />
                  Create your first list
                </Link>

                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 rounded-full bg-white border-2 border-slate-200 px-7 py-4 text-sm font-bold text-slate-800 shadow-sm hover:border-violet-300 hover:bg-violet-50/50 active-press transition-all"
                >
                  <Compass className="h-5 w-5 text-violet-600" />
                  Explore public lists
                </Link>
              </div>
            </div>

            {/* Right Column: Interactive Map Illustration Centerpiece */}
            <div className="lg:col-span-5 relative">
              <HeroMap />
            </div>
          </div>
        </div>
      </section>

      {/* Storytelling Grid: Collect, Organize, Plan, Share */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase text-violet-600 bg-violet-100 px-3 py-1 rounded-full">
            How Trackilio Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Designed for travel discovery & trip planning
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="space-y-4">
            <CollectIllustration />
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-slate-900">1. Collect Places</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Save cafes, viewpoints, hotels, and local favorites with ratings and Google Maps links.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="space-y-4">
            <OrganizeIllustration />
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-slate-900">2. Organize Priorities</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Sort locations into Must Visit, Want to Visit, or Maybe so you hit top spots first.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="space-y-4">
            <PlanIllustration />
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-slate-900">3. Map Route Paths</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Visualize multi-stop itineraries from start to finish without getting lost.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="space-y-4">
            <ShareIllustration />
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-slate-900">4. Plan & Share</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Invite friends as collaborators or publish public lists to help other travelers explore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Trackilio Lists Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
              Community Favorites
            </span>
            <h2 className="font-display text-3xl font-extrabold text-slate-900">
              Featured Trackilio Lists
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 group"
          >
            Explore all lists <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayLists.map((list) => (
            <WanderListCard key={list.id} list={list} />
          ))}
        </div>
      </section>

      {/* Popular Vector Destination Collections */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white space-y-8 shadow-2xl">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-display text-3xl font-black text-white">
              Explore Top Destinations
            </h2>
            <p className="text-slate-300 text-sm">
              Discover crowd-sourced recommendations by destination.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Japan', emoji: '⛩️', bg: 'from-purple-600 to-rose-600' },
              { name: 'France', emoji: '🥐', bg: 'from-blue-600 to-indigo-600' },
              { name: 'India', emoji: '🕌', bg: 'from-amber-500 to-orange-600' },
              { name: 'Indonesia', emoji: '🌴', bg: 'from-emerald-600 to-teal-600' },
            ].map((dest) => (
              <Link
                key={dest.name}
                href={`/explore?destination=${dest.name}`}
                className={`group relative h-36 rounded-2xl bg-gradient-to-br ${dest.bg} p-5 flex flex-col justify-between border border-white/20 shadow-md card-tactile active-press`}
              >
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300">
                  {dest.emoji}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">{dest.name}</h3>
                  <span className="text-[11px] text-white/80 font-semibold flex items-center gap-1">
                    View Lists <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white p-10 sm:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="font-display text-3xl sm:text-5xl font-black">
              Ready to organize your next adventure?
            </h2>
            <p className="text-violet-100 max-w-lg mx-auto text-base font-medium">
              Create your first Trackilio List in seconds. Keep it private or share it with travelers worldwide.
            </p>
            <div className="pt-2">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-extrabold text-violet-700 shadow-xl hover:bg-violet-50 hover:scale-105 active-press transition-all"
              >
                Start Your List Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
