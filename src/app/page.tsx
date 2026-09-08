import Link from 'next/link';
import { ArrowRight, Compass, Plus, MapPin } from 'lucide-react';
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
      <section className="relative pt-8 sm:pt-16 pb-12 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F3EFE6] border border-[#E2DAC8] px-3.5 py-1 text-xs font-bold text-[#18181B]">
                <span className="h-2 w-2 rounded-full bg-[#E0533C]" />
                Collaborative Travel Lists & Spot Discovery
              </span>

              <h1 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-[#18181B] leading-[1.1]">
                Collect places. <br />
                Plan trips. <br />
                <span className="font-serif italic text-[#E0533C] font-normal">
                  Go explore.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#71717A] max-w-xl leading-relaxed font-normal">
                Trackilio helps you organize cafes, hidden spots, and travel itineraries into shareable, curated lists. Collaborate with friends and discover user-generated travel guides worldwide.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#18181B] hover:bg-[#C8422C] px-7 py-4 text-sm font-bold text-white shadow-sm active-press transition-all"
                >
                  <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
                  Create your first list
                </Link>

                <Link
                  href="/discover"
                  className="inline-flex items-center gap-2 rounded-xl bg-white border border-[#E8E3D8] hover:border-[#18181B] px-7 py-4 text-sm font-bold text-[#18181B] shadow-2xs active-press transition-all"
                >
                  <Compass className="h-4.5 w-4.5 text-[#E0533C]" />
                  Discover public lists
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

      {/* Storytelling Grid: Collect, Organize, Plan, Share */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold tracking-widest uppercase text-[#E0533C]">
            How Trackilio Works
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl font-black text-[#18181B]">
            Built for travel discovery & trip planning
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="space-y-3.5">
            <CollectIllustration />
            <div className="space-y-1">
              <h3 className="font-sans text-base font-bold text-[#18181B]">1. Collect Places</h3>
              <p className="text-xs text-[#71717A] leading-relaxed font-medium">
                Save cafes, viewpoints, hotels, and local favorites with notes and Google Maps links.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="space-y-3.5">
            <OrganizeIllustration />
            <div className="space-y-1">
              <h3 className="font-sans text-base font-bold text-[#18181B]">2. Organize Priorities</h3>
              <p className="text-xs text-[#71717A] leading-relaxed font-medium">
                Sort locations into Must Visit, Want to Visit, or Maybe so you hit top spots first.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="space-y-3.5">
            <PlanIllustration />
            <div className="space-y-1">
              <h3 className="font-sans text-base font-bold text-[#18181B]">3. Map Route Paths</h3>
              <p className="text-xs text-[#71717A] leading-relaxed font-medium">
                Visualize multi-stop itineraries from start to finish without getting lost.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="space-y-3.5">
            <ShareIllustration />
            <div className="space-y-1">
              <h3 className="font-sans text-base font-bold text-[#18181B]">4. Plan & Share</h3>
              <p className="text-xs text-[#71717A] leading-relaxed font-medium">
                Invite friends as collaborators or publish public lists to help other travelers explore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Community Trackilio Lists */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E3D8] pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#E0533C]">
              Community Travel Guides
            </span>
            <h2 className="font-sans text-3xl font-black text-[#18181B]">
              Featured Trackilio Lists
            </h2>
          </div>
          <Link
            href="/discover"
            className="text-xs font-extrabold text-[#E0533C] hover:text-[#18181B] flex items-center gap-1 group transition-colors"
          >
            Explore all lists <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayLists.map((list) => (
            <WanderListCard key={list.id} list={list} />
          ))}
        </div>
      </section>

      {/* Destination Collections */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#18181B] text-white p-8 sm:p-12 space-y-8 shadow-sm">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-sans text-3xl font-black text-white">
              Explore Popular Destinations
            </h2>
            <p className="text-[#A1A1AA] text-xs font-medium">
              Browse crowd-sourced travel lists by country and city.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Japan', emoji: '⛩️', badge: 'Japan Guides' },
              { name: 'France', emoji: '🥐', badge: 'Paris & Bistros' },
              { name: 'India', emoji: '🕌', badge: 'Cafes & Culture' },
              { name: 'Indonesia', emoji: '🌴', badge: 'Bali Waterfalls' },
            ].map((dest) => (
              <Link
                key={dest.name}
                href={`/discover?destination=${dest.name}`}
                className="group relative rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col justify-between hover:bg-white/10 active-press transition-all duration-200"
              >
                <span className="text-2.5xl mb-3 group-hover:scale-110 transition-transform">
                  {dest.emoji}
                </span>
                <div>
                  <h3 className="font-sans text-base font-bold text-white">{dest.name}</h3>
                  <span className="text-[10px] text-[#A1A1AA] font-semibold flex items-center gap-1 mt-0.5">
                    Explore Guides <ArrowRight className="h-3 w-3 text-[#E0533C]" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#E0533C] text-white p-10 sm:p-14 text-center space-y-5 shadow-sm relative overflow-hidden">
          <h2 className="font-sans text-3xl sm:text-5xl font-black">
            Ready to organize your next adventure?
          </h2>
          <p className="text-white/90 max-w-lg mx-auto text-sm font-medium">
            Create your first Trackilio List in seconds. Keep it private or share it with travelers worldwide.
          </p>
          <div className="pt-2">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl bg-[#18181B] hover:bg-black px-7 py-3.5 text-sm font-extrabold text-white shadow-sm active-press transition-all"
            >
              Start Your List Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
