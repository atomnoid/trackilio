import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getPlaceBySlugOrId } from '@/services/places';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { PlaceJsonLd } from '@/components/seo/PlaceJsonLd';
import { SavePlaceButton } from '@/components/places/SavePlaceButton';
import { UpvoteButton } from '@/components/places/UpvoteButton';
import { AddToListModal } from '@/components/places/AddToListModal';
import { PlaceDiscoveryCard } from '@/components/places/PlaceDiscoveryCard';
import { CommunityPlacePhotos } from '@/components/places/CommunityPlacePhotos';
import { PlaceHeroPhoto } from '@/components/places/PlaceHeroPhoto';
import { getSiteUrl } from '@/lib/utils';
import {
  PinIcon,
  GlobeIcon,
  ExternalLinkIcon,
  ArrowUpBigIcon,
  ListIcon,
  SparklesIcon,
  ArrowRightIcon,
  CompassIcon,
} from '@/components/icons/Icons';

export const revalidate = 3600;

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
      description: 'The requested place could not be found on Trackilio.',
    };
  }

  const { place } = result;
  const locationStr = [place.city || place.location, place.country].filter(Boolean).join(', ');
  const title = `${place.name}${locationStr ? ` — ${locationStr}` : ''} | Trackilio`;
  const description =
    place.description?.slice(0, 160) ||
    `Explore ${place.name} on Trackilio. Curated tips, community votes, and list saves for travelers.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${getSiteUrl()}/place/${place.slug || slug}`,
      siteName: 'Trackilio',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
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
  const hasMapUrl = Boolean(
    place.maps_url &&
    place.maps_url.trim().length > 0 &&
    /^https?:\/\//i.test(place.maps_url.trim())
  );
  const locationDisplay = [place.address, place.city || place.location, place.country]
    .filter(Boolean)
    .join(', ');
  const upvotes = place.upvotes_count ?? 0;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 bg-[#FAF3E1]">
      {/* Auto Scroll to Top on Mount */}
      <ScrollToTop />

      {/* Structured Data */}
      <PlaceJsonLd place={place} />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-bold text-[#6B6862]">
        <Link href="/" className="hover:text-[#222222] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/discover" className="hover:text-[#222222] transition-colors">
          Discover
        </Link>
        <span>/</span>
        <span className="text-[#222222] font-extrabold truncate max-w-[200px]">
          {place.name}
        </span>
      </nav>

      {/* Place Hero Card */}
      <section className="rounded-3xl bg-white border border-[#E8DECA] p-6 sm:p-10 shadow-xs space-y-6">
        {/* Place Hero Banner */}
        {place.image_url && (
          <PlaceHeroPhoto
            imageUrl={place.image_url}
            placeName={place.name}
          />
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DECA]">
          {/* Category & Tags & Upvotes Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5E7C6] border border-[#E8DECA] px-3.5 py-1 text-xs font-black text-[#222222]">
              <CompassIcon className="h-3.5 w-3.5 text-[#FA8112]" />
              {place.category || 'Spot'}
            </span>

            {upvotes > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF3E1] border border-[#E8DECA] px-3.5 py-1 text-xs font-black text-[#FA8112]">
                <ArrowUpBigIcon className="h-4 w-4 fill-[#FA8112]" />
                <span>{upvotes} Upvote{upvotes !== 1 ? 's' : ''}</span>
              </span>
            )}

            {/* Place Tags */}
            {place.tags && place.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {place.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-[#FAF3E1] border border-[#E8DECA] px-3 py-1 text-xs font-extrabold text-[#6B6862]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons: Upvote, Save, Add to List */}
          <div className="flex items-center gap-2">
            <UpvoteButton
              placeId={place.id}
              slug={place.slug}
              initialUpvotes={upvotes}
              initialUpvoted={place.user_vote_type === 'up'}
              showText={true}
            />
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
          <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-black text-[#222222] tracking-tight">
            {place.name}
          </h1>

          {locationDisplay && (
            <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-[#FA8112]">
              <PinIcon className="h-4 w-4 shrink-0" />
              <span>{locationDisplay}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {place.description && (
          <p className="text-sm sm:text-base text-[#6B6862] leading-relaxed font-normal max-w-3xl">
            {place.description}
          </p>
        )}

        {/* Featured Insider Note */}
        {place.note && (
          <div className="rounded-2xl bg-[#FFF9EE] border border-[#F5E7C6] p-4 text-sm space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-black text-[#FA8112] uppercase tracking-wide">
              <span>💬</span>
              <span>Featured Insider Tip</span>
            </div>
            <p className="text-[#222222] font-semibold italic leading-relaxed">
              &ldquo;{place.note}&rdquo;
            </p>
          </div>
        )}

        {/* Map Links & Website — ONLY shown if provided */}
        {(hasMapUrl || place.website) && (
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold">
            {hasMapUrl && (
              <a
                href={place.maps_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-[#FAF3E1] border border-[#E8DECA] hover:bg-white hover:border-[#222222] text-[#222222] px-4 py-2.5 transition-colors active-press shadow-2xs"
              >
                <PinIcon className="h-3.5 w-3.5 text-[#FA8112]" />
                <span>Open in Maps</span>
                <ExternalLinkIcon className="h-3 w-3 text-[#6B6862]" />
              </a>
            )}

            {place.website && (
              <a
                href={place.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-[#FAF3E1] border border-[#E8DECA] hover:bg-white hover:border-[#222222] text-[#222222] px-4 py-2.5 transition-colors active-press shadow-2xs"
              >
                <GlobeIcon className="h-3.5 w-3.5 text-[#222222]" />
                <span>Official Website</span>
                <ExternalLinkIcon className="h-3 w-3 text-[#6B6862]" />
              </a>
            )}
          </div>
        )}
      </section>

      {/* Community Photos Section */}
      <CommunityPlacePhotos
        placeId={place.id}
        placeName={place.name}
        initialPhotos={place.photos || []}
        currentUserId={user?.id}
      />

      {/* Traveler & Community Notes Section */}
      {place.notes && place.notes.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DECA]">
            <h2 className="font-sans text-xl font-black text-[#222222] flex items-center gap-2">
              <span className="text-xl">💬</span>
              Traveler Notes & Tips ({place.notes.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {place.notes.map((n, idx) => (
              <div
                key={n.id || idx}
                className="rounded-2xl bg-white border border-[#E8DECA] p-5 space-y-3 shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#6B6862]">
                    <span className="text-[#FA8112] font-black">{n.author_name || 'Traveler'}</span>
                    {n.list_title && n.list_slug && (
                      <Link
                        href={`/l/${n.list_slug}`}
                        className="hover:underline text-[#6B6862] hover:text-[#222222] truncate max-w-[180px]"
                      >
                        From: {n.list_title}
                      </Link>
                    )}
                  </div>
                  <p className="text-sm font-medium text-[#222222] leading-relaxed italic">
                    &ldquo;{n.note}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Found in Curated Collections */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DECA]">
          <h2 className="font-sans text-xl font-black text-[#222222] flex items-center gap-2">
            <ListIcon className="h-5 w-5 text-[#FA8112]" />
            Found in Curated Lists ({relatedLists.length})
          </h2>
        </div>

        {relatedLists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedLists.map((list) => (
              <Link
                key={list.id}
                href={`/l/${list.slug}`}
                className="block p-5 rounded-3xl bg-white border border-[#E8DECA] hover:border-[#222222] hover:-translate-y-1 transition-all shadow-2xs group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-sans text-base font-black text-[#222222] group-hover:text-[#FA8112] transition-colors line-clamp-1">
                      {list.title}
                    </h3>
                    <p className="text-xs text-[#6B6862] font-medium">
                      Curated by <span className="font-bold text-[#222222]">{list.owner_name}</span>
                      {list.destination ? ` • ${list.destination}` : ''}
                    </p>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-[#FA8112] group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-[#E8DECA] p-8 text-center space-y-3 shadow-2xs">
            <p className="text-xs font-medium text-[#6B6862]">
              Be the first to add <span className="font-bold text-[#222222]">{place.name}</span> to a travel list!
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
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DECA]">
            <h2 className="font-sans text-xl sm:text-2xl font-black text-[#222222] flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-[#FA8112]" />
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
