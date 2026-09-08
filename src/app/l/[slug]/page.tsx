import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getWanderListBySlug } from '@/services/lists';
import { getPlacesForList } from '@/services/places';
import { createClient } from '@/lib/supabase/server';
import { PlaceCard } from '@/components/places/PlaceCard';
import { PlaceForm } from '@/components/places/PlaceForm';
import { ShareButton } from '@/components/ui/ShareButton';
import { WanderListJsonLd } from '@/components/seo/WanderListJsonLd';
import { MapPin, Globe, Lock, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { ListCover } from '@/components/lists/ListCover';

export const revalidate = 10;

interface WanderListPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: WanderListPageProps): Promise<Metadata> {
  const { slug } = await params;
  const list = await getWanderListBySlug(slug);

  if (!list || !list.is_public) {
    return {
      title: 'Trackilio List Not Found',
      robots: { index: false, follow: false },
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonicalUrl = `${siteUrl}/l/${list.slug}`;
  const placeCount = list.places_count || 0;

  return {
    title: `${list.title} — ${placeCount > 0 ? `${placeCount} Places to Visit` : 'Travel List'} | Trackilio`,
    description:
      list.description ||
      `A curated travel list of places to visit for ${list.destination || 'your next adventure'}, created by the Trackilio community.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${list.title} | Trackilio`,
      description:
        list.description || `A curated travel list of places for ${list.destination || 'your next trip'}.`,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${list.title} | Trackilio`,
      description: list.description || `Travel list for ${list.destination || 'places worth remembering'}.`,
    },
  };
}

export default async function PublicWanderListPage({ params }: WanderListPageProps) {
  const { slug } = await params;
  const list = await getWanderListBySlug(slug);

  if (!list) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = user?.id === list.owner_id;

  // Private list security boundary
  if (!list.is_public && !isOwner) {
    notFound();
  }

  const places = await getPlacesForList(list.id, user?.id);

  return (
    <div className="pb-24 space-y-12">
      {/* JSON-LD Structured Data */}
      {list.is_public && <WanderListJsonLd list={list} places={places} />}

      {/* Hero Header with Vector Cover */}
      <section className="relative bg-[#18181B] text-white overflow-hidden pb-12">
        <ListCover
          title={list.title}
          destination={list.destination || ''}
          variant="hero"
        />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold shadow-2xs ${
                list.is_public
                  ? 'bg-[#E8F5E9] text-[#2E7D32]'
                  : 'bg-white/10 text-white'
              }`}
            >
              {list.is_public ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
              {list.is_public ? 'Public Trackilio List' : 'Private Trackilio List'}
            </span>

            {list.is_public && <ShareButton title={list.title} />}
          </div>

          <div className="space-y-2">
            {list.destination && (
              <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-300">
                <MapPin className="h-4 w-4" />
                <span>{list.destination}</span>
              </div>
            )}
            <h1 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-white">
              {list.title}
            </h1>
            {list.description && (
              <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed font-normal">
                {list.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-[#E0533C] text-white font-bold flex items-center justify-center text-[10px]">
                {list.owner?.display_name?.charAt(0).toUpperCase() || 'T'}
              </div>
              <span>Created by <strong className="text-white">{list.owner?.display_name || 'Traveler'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Updated {formatDate(list.updated_at)}</span>
            </div>
            <div>
              <strong className="text-white font-bold">{places.length}</strong> Places Saved
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Places List */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-sans text-2xl font-black text-[#18181B] border-b border-[#E8E3D8] pb-3">
              Saved Places ({places.length})
            </h2>

            {places.length > 0 ? (
              <div className="space-y-4">
                {places.map((lp) => (
                  <PlaceCard
                    key={lp.id}
                    listPlace={lp}
                    currentUserId={user?.id}
                    canEdit={isOwner}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-white border border-[#E8E3D8] p-10 text-center space-y-3 shadow-2xs">
                <MapPin className="mx-auto h-9 w-9 text-[#E0533C] stroke-[1.8]" />
                <h3 className="font-sans text-lg font-bold text-[#18181B]">No places added yet</h3>
                <p className="text-xs text-[#71717A] max-w-sm mx-auto font-medium">
                  Add your favorite cafes, hotels, sights, and hidden gems to this Trackilio List.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            {isOwner ? (
              <div className="sticky top-24">
                <PlaceForm listId={list.id} currentUserId={user?.id} />
              </div>
            ) : (
              <div className="rounded-3xl bg-[#F5F1E8] border border-[#E2DAC8] p-6 space-y-2.5">
                <h3 className="font-sans text-base font-bold text-[#18181B]">About this list</h3>
                <p className="text-xs text-[#71717A] leading-relaxed font-medium">
                  This list was created by {list.owner?.display_name || 'a traveler'} for {list.destination || 'exploring places'}. Upvote your favorite spots or add a recommendation comment!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
