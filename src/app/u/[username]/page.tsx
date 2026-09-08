import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPublicProfileByUsernameOrId } from '@/services/profiles';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { DailyFactCard } from '@/components/daily-fact/DailyFactCard';
import { MapPin, Globe, Layers, Blend, ArrowRight, User } from 'lucide-react';

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

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header */}
      <section className="rounded-3xl bg-white border border-[#E6DFD5] p-8 sm:p-10 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border-2 border-[#E6DFD5] shadow-sm"
              />
            ) : (
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-[#2C2A29] text-white font-black text-2xl flex items-center justify-center shadow-sm">
                {initials}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-sans text-2xl sm:text-3xl font-black text-[#2C2A29]">
                {displayName}
              </h1>
              {profile.username && (
                <span className="rounded-full bg-[#F3ECE1] border border-[#E6DFD5] px-2.5 py-0.5 text-xs font-bold text-[#78726D]">
                  @{profile.username}
                </span>
              )}
            </div>

            {profile.bio && (
              <p className="text-sm text-[#78726D] font-medium leading-relaxed max-w-xl">
                {profile.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-bold text-[#78726D]">
              {profile.location && (
                <span className="flex items-center gap-1 text-[#4A6B5D]">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                {profile.public_lists_count ?? 0} Public Lists
              </span>
            </div>
          </div>

          {/* Blend CTA */}
          {profile.username && (
            <Link
              href={`/blend?with=${encodeURIComponent(profile.username)}`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4A6B5D] hover:bg-[#3B594B] text-white font-bold px-5 py-3 text-sm shadow-sm active-press transition-all shrink-0"
            >
              ✨ Blend with {displayName.split(' ')[0]}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Public Lists Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-xl font-black text-[#2C2A29] flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#4A6B5D]" />
              Travel Lists ({publicLists.length})
            </h2>
          </div>

          {publicLists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {publicLists.map((list) => (
                <WanderListCard key={list.id} list={list} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#E6DFD5] bg-white p-10 text-center space-y-3 shadow-sm">
              <User className="mx-auto h-9 w-9 text-[#4A6B5D] stroke-[1.5]" />
              <h3 className="font-sans text-base font-bold text-[#2C2A29]">
                No public lists yet
              </h3>
              <p className="text-xs text-[#78726D] font-medium max-w-xs mx-auto">
                {displayName} hasn't published any travel lists publicly yet. Check back later!
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Travel Taste Match CTA */}
          {profile.username && (
            <div className="rounded-3xl bg-[#2C2A29] text-white p-6 space-y-3 shadow-sm">
              <div className="text-2xl">✨</div>
              <h3 className="font-sans text-base font-black">
                Compare Travel Tastes
              </h3>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                See how much your travel style overlaps with {displayName.split(' ')[0]} using Trackilio Blend.
              </p>
              <Link
                href={`/blend?with=${encodeURIComponent(profile.username)}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A6B5D] hover:bg-[#3B594B] text-white font-bold px-4 py-2.5 text-xs shadow-sm active-press transition-colors"
              >
                Try Blend
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* Daily Fact */}
          <DailyFactCard />
        </div>
      </div>
    </div>
  );
}
