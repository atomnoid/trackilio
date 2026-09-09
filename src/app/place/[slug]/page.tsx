import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getPlaceBySlugOrId } from '@/services/places';
import { PlaceJsonLd } from '@/components/seo/PlaceJsonLd';
import { SavePlaceButton } from '@/components/places/SavePlaceButton';
import { AddToListModal } from '@/components/places/AddToListModal';
import { PlaceDiscoveryCard } from '@/components/places/PlaceDiscoveryCard';
import { getExternalMapUrl, getOpenStreetMapEmbedUrl } from '@/lib/maps';
import {
  MapPin,
  Globe,
  ExternalLink,
  ArrowBigUp,
  Layers,
  Sparkles,
  ArrowRight,
  Compass,
} from 'lucide-react';

export const revalidate = 60;

interface PlaceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PlaceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPlaceBySlugOrId(slug);

  if (!result) {
    return {
      title: 'Place Not Found | Trackilio',
      robots: { index: false, follow: false },
    };
  }

  const { place } = result;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonicalUrl = `${siteUrl}/place/${place.slug || slug}`;
  const loc = place.city || place.location || place.country || '';
  const title = `${place.name}${loc ? ` in ${loc}` : ''} — Recommendations | Trackilio`;
  const description =
    place.description ||
    `Discover ${place.name}${loc ? ` in ${loc}` : ''} on Trackilio. Explore community recommendations, curate your travel lists, and save hidden gems.`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data = await getPlaceBySlugOrId(slug, user?.id);
  if (!data) notFound();

  const { place, relatedLists, relatedPlaces } = data;
  const mapUrl = getExternalMapUrl(place);
  const embedUrl = getOpenStreetMapEmbedUrl({ lat: place.lat, lng: place.lng });
  const locationDisplay = [place.address, place.city || place.location, place.country]
    .filter(Boolean)
    .join(', ');
  const upvotes = place.upvotes_count ?? 0;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Structured Data */}
      <PlaceJsonLd place={place} />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link href="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/discover" className="hover:text-black transition-colors">
          Discover
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-bold truncate max-w-[200px]">
          {place.name}
        </span>
      </nav>

      {/* Place Hero Card */}
      <section className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          {/* Category & Tags & Upvotes Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEAE6] border border-[#FFD3CC] px-3.5 py-1 text-xs font-bold text-[#FF5841]">
              <Compass className="h-3.5 w-3.5" />
              {place.category || 'Spot'}
            </span>

            {upvotes > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEAE6] border border-[#FFD3CC] px-3.5 py-1 text-xs font-black text-[#FF5841]">
                <ArrowBigUp className="h-4 w-4 fill-[#FF5841]" />
                <span>{upvotes} Upvote{upvotes !== 1 ? 's' : ''}</span>
              </span>
            )}

            {/* Place Tags */}
            {place.tags && place.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {place.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-[#FDF4F8] border border-[#F4CDDF] px-3 py-1 text-xs font-extrabold text-[#C53678]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons: Save, Add to List */}
          <div className="flex items-center gap-2">
            <SavePlaceButton
              placeId={place.id}
              initialSaved={place.is_saved}
              currentUserId={user?.id}
              showText={true}
            />
            <AddToListModal
              placeId={place.id}
              placeName={place.name}
              currentUserId={user?.id}
            />
          </div>
        </div>

        {/* Place Title & Location */}
        <div className="space-y-3">
          <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            {place.name}
          </h1>

          {locationDisplay && (
            <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[#FF5841]">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{locationDisplay}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {place.description && (
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal max-w-3xl">
            {place.description}
          </p>
        )}

        {/* Map Links & Website */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold">
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-white hover:border-[#FF5841]/40 text-gray-800 px-4 py-2.5 transition-colors active-press"
          >
            <MapPin className="h-3.5 w-3.5 text-[#FF5841]" />
            <span>Open in Maps</span>
            <ExternalLink className="h-3 w-3 text-gray-400" />
          </a>

          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-white hover:border-[#FF5841]/40 text-gray-800 px-4 py-2.5 transition-colors active-press"
            >
              <Globe className="h-3.5 w-3.5 text-[#C53678]" />
              <span>Official Website</span>
              <ExternalLink className="h-3 w-3 text-gray-400" />
            </a>
          )}
        </div>

        {/* Optional Interactive Map Embed */}
        {embedUrl && (
          <div className="rounded-2xl overflow-hidden border border-gray-200 h-56 sm:h-72 w-full mt-4">
            <iframe
              title={`Map of ${place.name}`}
              src={embedUrl}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        )}
      </section>

      {/* Found in Curated Collections */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h2 className="font-sans text-xl font-black text-gray-900 flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#FF5841]" />
            Found in Curated Lists ({relatedLists.length})
          </h2>
        </div>

        {relatedLists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedLists.map((list) => (
              <Link
                key={list.id}
                href={`/l/${list.slug}`}
                className="block p-5 rounded-3xl bg-white border border-gray-100 hover:border-[#FF5841]/30 hover:-translate-y-1 transition-all shadow-2xs group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-sans text-base font-bold text-gray-900 group-hover:text-[#FF5841] transition-colors line-clamp-1">
                      {list.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Curated by <span className="font-bold text-gray-800">{list.owner_name}</span>
                      {list.destination ? ` • ${list.destination}` : ''}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#C53678] group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-gray-100 p-8 text-center space-y-3 shadow-2xs">
            <p className="text-xs font-medium text-gray-500">
              Be the first to add <span className="font-bold text-gray-900">{place.name}</span> to a travel list!
            </p>
            <AddToListModal
              placeId={place.id}
              placeName={place.name}
              currentUserId={user?.id}
            />
          </div>
        )}
      </section>

      {/* Similar / Related Places in the same category */}
      {relatedPlaces.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <h2 className="font-sans text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#C53678]" />
              More {place.category ? `${place.category} Spots` : 'Places'} to Explore
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {relatedPlaces.map((rp) => (
              <PlaceDiscoveryCard
                key={rp.id}
                place={rp}
                currentUserId={user?.id}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
