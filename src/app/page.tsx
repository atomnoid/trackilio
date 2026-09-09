import Link from 'next/link';
import { ArrowRight, Compass, Plus, Users, Sparkles } from 'lucide-react';
import { getPublicWanderLists } from '@/services/lists';
import { WanderList } from '@/types/database';
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
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-16 pb-12 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/90 border border-[#E7E0EE] px-4 py-1.5 text-xs font-bold text-[#6469AC] shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-[#C5ADC5]" />
                Collaborative Itineraries & Travel Taste Blend
              </span>

              <h1 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-[#2A2735] leading-[1.1]">
                Collect places. <br />
                Plan together. <br />
                <span className="bg-gradient-to-r from-[#8E6D8E] to-[#6469AC] bg-clip-text text-transparent italic font-serif font-normal">
                  Go explore.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#595567] max-w-xl leading-relaxed font-normal">
                Trackilio helps you organize cafes, viewpoints, and dream journeys into serene, shareable guides. Invite friends by @username to collaborate in real-time and discover matching travel vibes.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#C5ADC5] to-[#B2B5E0] hover:opacity-95 px-7 py-4 text-sm font-extrabold text-white shadow-xs active-press transition-all"
                >
                  <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
                  <span>Create your first list</span>
                </Link>

                <Link
                  href="/blend"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/95 border border-[#E7E0EE] hover:border-[#C5ADC5] px-6 py-4 text-sm font-bold text-[#6469AC] shadow-2xs active-press transition-all"
                >
                  <Sparkles className="h-4.5 w-4.5 text-[#C5ADC5]" />
                  <span>Match Travel Blend</span>
                </Link>

                <Link
                  href="/discover"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/70 hover:bg-white border border-[#E7E0EE] px-6 py-4 text-sm font-bold text-[#595567] active-press transition-all"
                >
                  <Compass className="h-4.5 w-4.5 text-[#8E6D8E]" />
                  <span>Explore Guides</span>
                </Link>
              </div>
            </div>

            {/* Right Column: HeroMap Interactive Travel Centerpiece */}
            <div className="lg:col-span-5 relative">
              <HeroMap />
            </div>
          </div>
        </div>
      </section>

      {/* Storytelling Grid: Collect, Collaborate, Plan, Blend */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold tracking-widest uppercase text-[#8E6D8E]">
            How Trackilio Works
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl font-black text-[#2A2735]">
            Mindful travel discovery & group planning
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-3.5 bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-[#E7E0EE] shadow-2xs">
            <CollectIllustration />
            <div className="space-y-1">
              <h3 className="font-sans text-base font-bold text-[#2A2735]">1. Collect Places</h3>
              <p className="text-xs text-[#595567] leading-relaxed font-medium">
                Save cafes, viewpoints, hotels, and local gems with custom notes and Google Maps locations.
              </p>
            </div>
          </div>

          <div className="space-y-3.5 bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-[#E7E0EE] shadow-2xs">
            <OrganizeIllustration />
            <div className="space-y-1">
              <h3 className="font-sans text-base font-bold text-[#2A2735]">2. Organize Priorities</h3>
              <p className="text-xs text-[#595567] leading-relaxed font-medium">
                Group spots by Must Visit, Want to Visit, and Visited to streamline daily itineraries.
              </p>
            </div>
          </div>

          <div className="space-y-3.5 bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-[#E7E0EE] shadow-2xs">
            <PlanIllustration />
            <div className="space-y-1">
              <h3 className="font-sans text-base font-bold text-[#2A2735]">3. Real-Time Collaboration</h3>
              <p className="text-xs text-[#595567] leading-relaxed font-medium">
                Invite any @username as an Editor or Viewer to co-build itineraries with friends.
              </p>
            </div>
          </div>

          <div className="space-y-3.5 bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-[#E7E0EE] shadow-2xs">
            <ShareIllustration />
            <div className="space-y-1">
              <h3 className="font-sans text-base font-bold text-[#2A2735]">4. Travel Taste Blend</h3>
              <p className="text-xs text-[#595567] leading-relaxed font-medium">
                Discover matching places and destinations with travel twins, saved for both users automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Community Travel Lists */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#E7E0EE]">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#8E6D8E]">
              Community Guides
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-black text-[#2A2735]">
              Trending Itineraries & Collections
            </h2>
          </div>

          <Link
            href="/discover"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#6469AC] hover:underline shrink-0"
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
    </div>
  );
}
