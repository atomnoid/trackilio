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
  Flame,
  Layers,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Send,
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
  const title = `${place.name}${loc ? ` in ${loc}` : ''} — Recommendations & Reviews | Trackilio`;
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

  const { place, relatedLists, relatedPlaces, comments } = data;
  const mapUrl = getExternalMapUrl(place);
  const embedUrl = getOpenStreetMapEmbedUrl({ lat: place.lat, lng: place.lng });
  const locationDisplay = [place.address, place.city || place.location, place.country]
    .filter(Boolean)
    .join(', ');
  const score = place.community_score ?? 0;

  let scoreLabel = 'New on Trackilio';
  if (score >= 10) scoreLabel = 'Loved by the Trackilio community 🔥';
  else if (score >= 3) scoreLabel = 'Popular recommendation ✨';
  else if (score > 0) scoreLabel = 'Growing community pick 📍';

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Structured Data */}
      <PlaceJsonLd place={place} />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-[#78726D]">
        <Link href="/" className="hover:text-[#2C2A29] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/discover" className="hover:text-[#2C2A29] transition-colors">
          Discover
        </Link>
        <span>/</span>
        <span className="text-[#2C2A29] font-bold truncate max-w-[200px]">
          {place.name}
        </span>
      </nav>

      {/* Place Hero Card */}
      <section className="rounded-3xl bg-white border border-[#E6DFD5] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F3ECE1]">
          {/* Category & Community Score Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0F5F2] border border-[#D5E3DC] px-3 py-1 text-xs font-bold text-[#3B594B]">
              <Compass className="h-3.5 w-3.5" />
              {place.category || 'Spot'}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF6F0] border border-[#EAE4D9] px-3 py-1 text-xs font-bold text-[#78726D]">
              <span>{scoreLabel}</span>
            </span>
          </div>

          {/* Action Buttons: Save, Add to List, Share */}
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
          <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-black text-[#2C2A29] tracking-tight">
            {place.name}
          </h1>

          {locationDisplay && (
            <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[#4A6B5D]">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{locationDisplay}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {place.description && (
          <p className="text-sm sm:text-base text-[#4A4643] leading-relaxed font-normal max-w-3xl">
            {place.description}
          </p>
        )}

        {/* Map Links & Website */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold">
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#F8F6F0] border border-[#EAE4D9] hover:bg-[#F3ECE1] text-[#2C2A29] px-3.5 py-2 transition-colors active-press"
          >
            <MapPin className="h-3.5 w-3.5 text-[#4A6B5D]" />
            <span>Open in Maps</span>
            <ExternalLink className="h-3 w-3 text-[#78726D]" />
          </a>

          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#F8F6F0] border border-[#EAE4D9] hover:bg-[#F3ECE1] text-[#2C2A29] px-3.5 py-2 transition-colors active-press"
            >
              <Globe className="h-3.5 w-3.5 text-[#4A6B5D]" />
              <span>Official Website</span>
              <ExternalLink className="h-3 w-3 text-[#78726D]" />
            </a>
          )}
        </div>

        {/* Optional Interactive Map Embed */}
        {embedUrl && (
          <div className="rounded-2xl overflow-hidden border border-[#E6DFD5] h-56 sm:h-72 w-full mt-4">
            <iframe
              title={`Map of ${place.name}`}
              src={embedUrl}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        )}
      </section>

      {/* Two Column Layout: Lists & Community Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Curated Collections containing this place */}
        <div className="md:col-span-6 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6DFD5]">
            <h2 className="font-sans text-xl font-black text-[#2C2A29] flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#4A6B5D]" />
              Found in Curated Lists ({relatedLists.length})
            </h2>
          </div>

          {relatedLists.length > 0 ? (
            <div className="space-y-3">
              {relatedLists.map((list) => (
                <Link
                  key={list.id}
                  href={`/l/${list.slug}`}
                  className="block p-4 rounded-2xl bg-white border border-[#E6DFD5] hover:border-[#D5E3DC] hover:-translate-y-0.5 transition-all shadow-2xs group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-sans text-sm font-bold text-[#2C2A29] group-hover:text-[#4A6B5D] transition-colors">
                        {list.title}
                      </h3>
                      <p className="text-xs text-[#78726D] font-medium pt-0.5">
                        Curated by <span className="font-bold text-[#4A4643]">{list.owner_name}</span>
                        {list.destination ? ` • ${list.destination}` : ''}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#4A6B5D] group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-[#E6DFD5] p-6 text-center space-y-2 shadow-2xs">
              <p className="text-xs font-medium text-[#78726D]">
                Be the first to add <span className="font-bold">{place.name}</span> to a travel list!
              </p>
              <AddToListModal
                placeId={place.id}
                placeName={place.name}
                currentUserId={user?.id}
              />
            </div>
          )}
        </div>

        {/* Right Column: Community Discussion & Recommendations */}
        <div className="md:col-span-6 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6DFD5]">
            <h2 className="font-sans text-xl font-black text-[#2C2A29] flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#4A6B5D]" />
              Community Opinions ({comments.length})
            </h2>
          </div>

          {comments.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 rounded-2xl bg-white border border-[#E6DFD5] space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2C2A29]">
                      {comment.profile?.display_name || comment.profile?.username || 'Traveler'}
                    </span>
                    <span className="text-[10px] text-[#9E968F]">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#4A4643] leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-[#E6DFD5] p-6 text-center space-y-2 shadow-2xs">
              <p className="text-xs text-[#78726D] font-medium">
                No community notes yet. Add this place to your list to share your thoughts!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Similar / Related Places in the same category */}
      {relatedPlaces.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6DFD5]">
            <h2 className="font-sans text-xl sm:text-2xl font-black text-[#2C2A29] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#D96B43]" />
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
