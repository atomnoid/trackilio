import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPublicProfileByUsernameOrId } from '@/services/profiles';
import { isFollowing as checkIsFollowing } from '@/services/follows';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { ProfileJsonLd } from '@/components/seo/ProfileJsonLd';
import { FollowButton } from '@/components/profile/FollowButton';
import { FollowStats } from '@/components/profile/FollowStats';
import { PinIcon, ArrowRightIcon } from '@/components/icons/Icons';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 60;

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const result = await getPublicProfileByUsernameOrId(username);

  if (!result) {
    return {
      title: 'Traveler Not Found | Trackilio',
      robots: { index: false, follow: false },
    };
  }

  const { profile } = result;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonicalUrl = `${siteUrl}/u/${profile.username ?? username}`;
  const displayName = profile.display_name || profile.username || 'Traveler';
  const listCount = profile.public_lists_count ?? 0;

  return {
    title: `${displayName}'s Travel Lists (${listCount} Public Lists) | Trackilio`,
    description:
      profile.bio ||
      `Explore ${displayName}'s curated travel lists and discover great places on Trackilio.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${displayName} on Trackilio`,
      description:
        profile.bio ||
        `${displayName} has shared ${listCount} travel list${listCount !== 1 ? 's' : ''} on Trackilio.`,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary',
      title: `${displayName} on Trackilio`,
      description:
        profile.bio ||
        `${displayName} shares travel discovery lists on Trackilio.`,
    },
  };
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const result = await getPublicProfileByUsernameOrId(username);

  if (!result) notFound();

  const { profile, publicLists } = result;
  const displayName = profile.display_name || profile.username || 'Traveler';
  const initials = displayName.slice(0, 2).toUpperCase();
  const listCount = publicLists.length;

  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const isSelf = currentUser && currentUser.id === profile.id;
  const initialIsFollowing = currentUser && !isSelf
    ? await checkIsFollowing(currentUser.id, profile.id)
    : false;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 bg-[#FAF3E1]">
      {/* Structured Data */}
      <ProfileJsonLd
        profile={profile}
        publicListsCount={listCount}
        username={profile.username ?? username}
      />

      {/* Profile Header Card */}
      <header className="rounded-3xl bg-white border border-[#E8DECA] p-6 sm:p-8 md:p-10 shadow-2xs relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border border-[#E8DECA]"
              />
            ) : (
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-[#222222] text-[#FAF3E1] font-black text-2xl sm:text-3xl flex items-center justify-center">
                {initials}
              </div>
            )}
          </div>

          {/* Profile Identity */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-sans text-2xl sm:text-3xl font-black text-[#222222] tracking-tight">
                {displayName}
              </h1>
              {profile.username && (
                <span className="rounded-full bg-[#F5E7C6] border border-[#E8DECA] px-3 py-0.5 text-xs font-bold text-[#222222]">
                  @{profile.username}
                </span>
              )}
            </div>

            {profile.bio && (
              <p className="text-sm text-[#6B6862] leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            )}

            {/* Badges / Stats */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-bold text-[#6B6862]">
              {profile.location && (
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FAF3E1] border border-[#E8DECA] px-3 py-1 text-[#222222]">
                  <PinIcon className="w-3 h-3 text-[#FA8112]" />
                  {profile.location}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#F5E7C6] border border-[#E8DECA] px-3 py-1 text-[#222222]">
                {listCount} Public List{listCount !== 1 ? 's' : ''}
              </span>

              {/* Followers & Following Clickable Stats */}
              <FollowStats
                userId={profile.id}
                initialFollowersCount={profile.followers_count || 0}
                initialFollowingCount={profile.following_count || 0}
                displayName={displayName}
              />
            </div>
          </div>

          {/* Actions: Edit Profile (if self) or Follow */}
          <div className="pt-2 sm:pt-0 w-full sm:w-auto flex flex-wrap sm:flex-nowrap gap-2 shrink-0">
            {isSelf ? (
              <Link
                href="/settings"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#FAF3E1] hover:bg-[#F5E7C6] border border-[#E8DECA] text-[#222222] font-bold px-4 py-2 text-xs active-press transition-colors"
              >
                <span>Edit Settings</span>
              </Link>
            ) : (
              <FollowButton
                targetUserId={profile.id}
                initialIsFollowing={initialIsFollowing}
                className="w-full sm:w-auto"
              />
            )}
          </div>
        </div>
      </header>

      {/* Curated Lists Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8DECA]">
          <h2 className="font-sans text-xl font-black text-[#222222]">
            Public Travel Lists ({listCount})
          </h2>
        </div>

        {listCount > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {publicLists.map((list) => (
              <WanderListCard key={list.id} list={list} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#E8DECA] bg-white p-10 text-center space-y-3 shadow-2xs">
            <h3 className="font-sans text-base font-bold text-[#222222]">
              No public lists yet
            </h3>
            <p className="text-xs text-[#6B6862] max-w-sm mx-auto">
              {displayName} hasn&apos;t shared any public travel lists yet. Check back soon for new itineraries!
            </p>
            <div className="pt-2">
              <Link
                href="/discover"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#222222] hover:text-[#FA8112] transition-colors"
              >
                <span>Discover other travelers&apos; lists</span>
                <ArrowRightIcon className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
