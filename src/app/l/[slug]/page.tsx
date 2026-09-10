import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getWanderListBySlug, isListSaved } from '@/services/lists';
import { getPlacesForList } from '@/services/places';
import { getListMembers } from '@/services/members';
import { createClient } from '@/lib/supabase/server';
import { PlaceCard } from '@/components/places/PlaceCard';
import { PlaceForm } from '@/components/places/PlaceForm';
import { WanderListJsonLd } from '@/components/seo/WanderListJsonLd';
import { MembersPanel } from '@/components/lists/MembersPanel';
import { ListHeaderActions } from '@/components/lists/ListHeaderActions';
import { PinIcon, GlobeIcon, LockIcon, CalendarIcon, UsersIcon, SparklesIcon } from '@/components/icons/Icons';
import { formatDate, getSiteUrl } from '@/lib/utils';

export const revalidate = 60;

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

  const siteUrl = getSiteUrl();
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

  const [places, members, savedStatus] = await Promise.all([
    getPlacesForList(list.id, user?.id),
    getListMembers(list.id),
    user ? isListSaved(user.id, list.id) : Promise.resolve(false),
  ]);

  const isOwner = user?.id === list.owner_id;
  const currentMember = members.find((m) => m.user_id === user?.id);
  const isMember = !!currentMember;

  // Private list security boundary: only owner and collaborators can view
  if (!list.is_public && !isOwner && !isMember) {
    notFound();
  }

  const canEdit = isOwner || currentMember?.role === 'editor';
  const hasCollaborators = members.length > 1;


  return (
    <div className="pb-24 space-y-10">
      {/* JSON-LD Structured Data */}
      {list.is_public && <WanderListJsonLd list={list} places={places} />}

      {/* Modern Flat Design List Header (No Black Theme, Compact & Beautiful) */}
      <section className="relative bg-white/95 backdrop-blur-md border-b border-[#EFE9EC] py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Top Status & Actions Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black shadow-2xs ${
                  list.is_public
                    ? 'bg-[#FFEAE6] text-[#FF5841] border border-[#FFD3CC]'
                    : 'bg-[#F6F4F8] text-[#4F4B5E] border border-[#EFE9EC]'
                }`}
              >
                {list.is_public ? <GlobeIcon className="h-3.5 w-3.5" /> : <LockIcon className="h-3.5 w-3.5" />}
                <span>{list.is_public ? 'Public Guide' : 'Private Itinerary'}</span>
              </span>

              {hasCollaborators && (
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black bg-[#F9E2EE] text-[#C53678] border border-[#F4CDDF]">
                  <UsersIcon className="h-3.5 w-3.5" />
                  <span>{members.length} Collaborators</span>
                </span>
              )}
            </div>

            {/* Save List, Add Collaborator, Edit List & Share Buttons at Top Header */}
            <ListHeaderActions
              listId={list.id}
              listTitle={list.title}
              listDescription={list.description}
              listDestination={list.destination}
              isOwner={isOwner}
              canEdit={canEdit}
              isPublic={list.is_public}
              initialSaved={savedStatus}
            />
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            {list.destination && (
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#FF5841] bg-[#FFF5F3] px-3 py-1 rounded-xl border border-[#FFEAE6]">
                <PinIcon className="h-3.5 w-3.5" />
                <span>{list.destination}</span>
              </div>
            )}
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A1723]">
              {list.title}
            </h1>
            {list.description && (
              <p className="text-sm sm:text-base text-[#4F4B5E] max-w-3xl leading-relaxed font-normal">
                {list.description}
              </p>
            )}
          </div>

          {/* Metadata Meta Bar */}
          <div className="flex flex-wrap items-center gap-5 pt-4 border-t border-[#EFE9EC] text-xs text-[#7E7890] font-medium">
            <Link
              href={list.owner?.username ? `/u/${list.owner.username}` : '#'}
              className="flex items-center gap-2 group hover:opacity-85 transition-opacity"
            >
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#FF5841] to-[#C53678] text-white font-bold flex items-center justify-center text-[10px] shadow-2xs">
                {list.owner?.display_name?.charAt(0).toUpperCase() || 'T'}
              </div>
              <span className="text-[#1A1723] font-bold group-hover:text-[#FF5841] transition-colors">
                {list.owner?.display_name || 'Traveler'}
                {list.owner?.username && (
                  <span className="text-[#7E7890] font-normal ml-1">@{list.owner.username}</span>
                )}
              </span>
            </Link>

            <div className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 text-[#7E7890]" />
              <span>Updated {formatDate(list.updated_at)}</span>
            </div>

            <div>
              <strong className="text-[#1A1723] font-bold">{places.length}</strong> Places Saved
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Places List */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE9EC]">
              <h2 className="font-sans text-xl font-black text-[#1A1723]">
                Saved Places ({places.length})
              </h2>
            </div>

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
              <div className="rounded-3xl bg-white border border-[#EFE9EC] p-10 text-center space-y-3 shadow-2xs">
                <PinIcon className="mx-auto h-9 w-9 text-[#FF5841] stroke-[1.8]" />
                <h3 className="font-sans text-base font-bold text-[#1A1723]">No places added yet</h3>
                <p className="text-xs text-[#7E7890] max-w-sm mx-auto font-medium">
                  Add your favorite cafes, hotels, sights, and hidden gems to this itinerary.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            {isOwner ? (
              <div className="sticky top-24 space-y-6">
                <PlaceForm listId={list.id} currentUserId={user?.id} />
                <MembersPanel
                  listId={list.id}
                  ownerId={list.owner_id}
                  initialMembers={members as any}
                  currentUserId={user!.id}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-3xl bg-white border border-[#EFE9EC] p-6 space-y-2.5 shadow-2xs">
                  <h3 className="font-sans text-sm font-bold text-[#1A1723]">About this guide</h3>
                  <p className="text-xs text-[#4F4B5E] leading-relaxed font-medium">
                    This travel list was created by {list.owner?.display_name || 'a traveler'} for {list.destination || 'exploring places'}. Bookmark it to save it in your travel dashboard!
                  </p>
                </div>
                {user && (
                  <MembersPanel
                    listId={list.id}
                    ownerId={list.owner_id}
                    initialMembers={members as any}
                    currentUserId={user.id}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
