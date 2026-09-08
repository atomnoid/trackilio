import Link from 'next/link';
import { Compass, MapPin, Sparkles, Users, ArrowRight, Heart } from 'lucide-react';
import { getPublicWanderLists } from '@/services/lists';
import { WanderListCard } from '@/components/lists/WanderListCard';

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
      cover_image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
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
      cover_image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
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
      cover_image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      slug: 'paris-food-bucket-list-pastries-bistro-wine',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner: { id: 'demo-user', display_name: 'Claire Dubois', avatar_url: null, created_at: '', updated_at: '' },
    },
  ];

  const displayLists = featuredLists.length > 0 ? featuredLists : fallbackLists;

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 bg-gradient-to-b from-amber-50/50 via-cream to-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3.5 py-1 text-xs font-semibold text-amber-900 border border-amber-200">
                <Sparkles className="h-3.5 w-3.5 text-amber-700" />
                Collaborative & Discoverable Travel Lists
              </span>

              <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-stone-900 leading-[1.1]">
                Plan places <br className="hidden sm:inline" />
                <span className="text-terracotta italic">worth remembering.</span>
              </h1>

              <p className="text-lg text-stone-600 max-w-xl leading-relaxed">
                Create personal travel bucket lists, collaborate with friends, and publish your favorite spots for travelers worldwide to discover.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-stone-800 transition-all hover:scale-[1.02]"
                >
                  Create a WanderList
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 rounded-xl bg-white border border-stone-300 px-6 py-3.5 text-sm font-semibold text-stone-800 shadow-sm hover:border-stone-400 hover:bg-stone-50 transition-all"
                >
                  Explore WanderLists
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden shadow-2xl border border-stone-200 bg-white rotate-1 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80"
                  alt="Travel Hero"
                  className="h-80 w-full object-cover"
                />
                <div className="p-6 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                      Featured Destination
                    </span>
                    <span className="text-xs font-medium text-stone-400">12 Places</span>
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-stone-900">
                    Highland Roadtrip & Hidden Lochs
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2">
                    Castles, coastal drives, and remote cozy pubs in Scotland.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured WanderLists */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-stone-200/80 pb-4">
          <div>
            <h2 className="font-editorial text-3xl font-bold text-stone-900">
              Featured WanderLists
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Curated user-generated travel guides from around the world.
            </p>
          </div>
          <Link
            href="/explore"
            className="text-sm font-semibold text-terracotta hover:underline flex items-center gap-1"
          >
            View all lists <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayLists.map((list) => (
            <WanderListCard key={list.id} list={list} />
          ))}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="bg-sand/60 py-16 border-y border-stone-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-editorial text-3xl font-bold text-stone-900">
              Explore Popular Destinations
            </h2>
            <p className="text-sm text-stone-600">
              Find community-recommended spots in top travel destinations.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80' },
              { name: 'Bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80' },
              { name: 'Paris', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80' },
              { name: 'India', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80' },
            ].map((dest) => (
              <Link
                key={dest.name}
                href={`/explore?destination=${dest.name}`}
                className="group relative h-40 rounded-xl overflow-hidden shadow-sm border border-stone-200"
              >
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-4">
                  <span className="font-editorial text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                    {dest.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-editorial text-3xl font-bold text-stone-900">
            How MyWanderLists Works
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            A travel discovery platform designed for editorial simplicity and collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl bg-white border border-stone-200 p-8 space-y-4 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-stone-900">1. Organize Places</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Group cafes, landmarks, hotels, and hidden gems into custom lists with priority ratings and Google Maps links.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-stone-200 p-8 space-y-4 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-stone-900">2. Collaborate</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Invite friends or travel partners as editors or viewers. Upvote top spots and leave recommendation comments.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-stone-200 p-8 space-y-4 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-800">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-stone-900">3. Inspire Others</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Publish public WanderLists to share your travel expertise with the global travel community via SEO-friendly URLs.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-stone-900 text-white p-10 sm:p-16 text-center space-y-6 shadow-xl relative overflow-hidden">
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold">
            Ready to organize your next adventure?
          </h2>
          <p className="text-stone-300 max-w-lg mx-auto text-base">
            Create your first WanderList in seconds. Keep it private or share it with the world.
          </p>
          <div className="pt-2">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl bg-terracotta px-8 py-4 text-sm font-semibold text-white shadow-md hover:bg-amber-700 transition-all hover:scale-105"
            >
              Start Your WanderList
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
