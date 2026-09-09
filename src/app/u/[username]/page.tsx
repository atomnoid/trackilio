import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPublicProfileByUsernameOrId } from '@/services/profiles';
import { WanderListCard } from '@/components/lists/WanderListCard';
import { ProfileJsonLd } from '@/components/seo/ProfileJsonLd';
import { MapPin, Globe, Layers, ArrowRight, User, Settings, Sparkles } from 'lucide-react';
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

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
      {/* Structured Data */}
      <ProfileJsonLd
        profile={profile}
        publicListsCount={listCount}
        username={profile.username ?? username}
      />

      {/* Serene Pastel Header Card */}
      <header className="rounded-3xl bg-white/95 backdrop-blur-md border border-[#E7E0EE] p-6 sm:p-8 md:p-10 shadow-xs relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#C5ADC5]/15 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#B2B5E0]/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border border-[#E7E0EE] shadow-xs"
              />
            ) : (
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-[#C5ADC5] to-[#B2B5E0] text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-xs">
                {initials}
              </div>
            )}
          </div>

          {/* Profile Identity */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl font-black text-[#2A2735] tracking-tight">
                {displayName}
              </h1>
              {profile.username && (
                <span className="rounded-full bg-[#F6F1F6] border border-[#E7E0EE] px-3 py-0.5 text-xs font-bold text-[#8E6D8E]">
                  @{profile.username}
                </span>
              )}
            </div>

            {profile.bio && (
              <p className="text-sm sm:text-base text-[#595567] font-medium leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            )}

            {/* Badges / Stats */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-bold text-[#847F95]">
              {profile.location && (
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FAF9FC] border border-[#E7E0EE] px-3 py-1 text-[#8E6D8E]">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FAF9FC] border border-[#E7E0EE] px-3 py-1 text-[#6469AC]">
                <Globe className="h-3.5 w-3.5" />
                {listCount} Curated List{listCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Actions: Edit Profile (if self) or Blend Taste */}
          <div className="pt-2 sm:pt-0 w-full sm:w-auto flex flex-col sm:flex-row gap-2 shrink-0">
            {isSelf ? (
              <Link
                href="/settings"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#FAF9FC] hover:bg-[#F6F1F6] border border-[#E7E0EE] text-[#2A2735] font-bold px-4 py-2.5 text-xs sm:text-sm active-press transition-colors shadow-2xs"
              >
                <Settings className="h-4 w-4 text-[#847F95]" />
                <span>Edit Settings</span>
              </Link>
            ) : profile.username ? (
              <Link
                href={`/blend?with=${encodeURIComponent(profile.username)}`}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C5ADC5] to-[#B2B5E0] hover:opacity-95 text-white font-extrabold px-5 py-2.5 text-xs sm:text-sm shadow-xs active-press transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Blend Taste</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      {/* Curated Lists Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-[#E7E0EE]">
          <h2 className="font-sans text-xl sm:text-2xl font-black text-[#2A2735] flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#6469AC]" />
            Curated Travel Lists
          </h2>
          <span className="text-xs font-bold text-[#8E6D8E] bg-[#F6F1F6] border border-[#E7E0EE] px-3 py-1 rounded-full">
            {listCount}
          </span>
        </div>

        {listCount > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {publicLists.map((list) => (
              <WanderListCard key={list.id} list={list} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-[#E7E0EE] bg-white/90 p-10 sm:p-14 text-center space-y-4 shadow-xs">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-[#F6F1F6] border border-[#E7E0EE] text-[#6469AC] flex items-center justify-center">
              <User className="h-6 w-6 stroke-[1.75]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-sans text-base sm:text-lg font-bold text-[#2A2735]">
                No public lists yet
              </h3>
              <p className="text-xs sm:text-sm text-[#595567] font-medium max-w-sm mx-auto">
                {displayName} hasn&apos;t shared any public travel lists yet. Check back soon for new itineraries!
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#6469AC] hover:underline"
              >
                Discover other travelers&apos; lists <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
