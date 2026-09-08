import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlendSession } from '@/services/blend';
import { AnimatedScore } from '@/components/blend/AnimatedScore';
import { ShareBlendButton } from '@/components/blend/ShareBlendButton';
import { MapPin, ArrowRight, RefreshCw } from 'lucide-react';

export const revalidate = 3600; // Blend results are immutable after creation

interface BlendResultPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BlendResultPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getBlendSession(id);

  if (!result) {
    return {
      title: 'Blend Not Found | Trackilio',
      robots: { index: false, follow: false },
    };
  }

  const nameA = result.userA.display_name || result.userA.username || 'Traveler A';
  const nameB = result.userB.display_name || result.userB.username || 'Traveler B';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: `${nameA} & ${nameB} — ${result.score}% Travel Match | Trackilio`,
    description: `${nameA} and ${nameB} are ${result.score}% travel compatible on Trackilio. ${result.label}. Check your Blend!`,
    alternates: {
      canonical: `${siteUrl}/blend/${id}`,
    },
    openGraph: {
      title: `${nameA} & ${nameB} got ${result.score}% on Trackilio Blend!`,
      description: `"${result.label}" — See how your travel tastes compare.`,
      url: `${siteUrl}/blend/${id}`,
    },
    twitter: {
      card: 'summary',
      title: `${nameA} & ${nameB} got ${result.score}% on Trackilio Blend!`,
      description: `"${result.label}" — Find your Travel Twin on Trackilio.`,
    },
  };
}

/** Determine score ring / color based on score value */
function getScoreColor(score: number) {
  if (score >= 80) return { ring: '#4A6B5D', bg: '#EDF5F0', text: '#2A4D3E' };
  if (score >= 60) return { ring: '#5B7FA6', bg: '#EBF2F9', text: '#1E3A5F' };
  if (score >= 40) return { ring: '#C17A35', bg: '#FDF3E7', text: '#7A4A10' };
  return { ring: '#9E8A78', bg: '#F5F1E8', text: '#5C4D3E' };
}

export default async function BlendResultPage({ params }: BlendResultPageProps) {
  const { id } = await params;
  const result = await getBlendSession(id);

  if (!result) notFound();

  const nameA = result.userA.display_name || result.userA.username || 'Traveler A';
  const nameB = result.userB.display_name || result.userB.username || 'Traveler B';
  const initialsA = nameA.slice(0, 2).toUpperCase();
  const initialsB = nameB.slice(0, 2).toUpperCase();
  const colors = getScoreColor(result.score);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 space-y-8">
      {/* Score Hero Card */}
      <section
        className="rounded-3xl p-8 sm:p-10 text-center space-y-5 border shadow-sm"
        style={{ background: colors.bg, borderColor: `${colors.ring}33` }}
      >
        {/* Avatars */}
        <div className="flex items-center justify-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-[#2C2A29] text-white font-black text-xl flex items-center justify-center shadow-sm">
            {initialsA}
          </div>
          <span className="text-2xl">✨</span>
          <div className="h-14 w-14 rounded-2xl bg-[#4A6B5D] text-white font-black text-xl flex items-center justify-center shadow-sm">
            {initialsB}
          </div>
        </div>

        {/* Score */}
        <div>
          <div
            className="font-sans font-black leading-none"
            style={{ fontSize: 'clamp(4rem, 16vw, 7rem)', color: colors.ring }}
          >
            <AnimatedScore targetScore={result.score} />
            <span className="text-4xl sm:text-5xl">%</span>
          </div>
          <p className="font-serif italic text-2xl sm:text-3xl font-normal mt-1" style={{ color: colors.text }}>
            {result.label}
          </p>
        </div>

        <p className="text-sm font-medium" style={{ color: colors.text }}>
          <strong>{nameA}</strong> and <strong>{nameB}</strong> are{' '}
          <strong>{result.score}%</strong> travel compatible
        </p>

        {/* Share CTA */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <ShareBlendButton
            blendId={id}
            score={result.score}
            label={result.label}
            nameA={nameA}
            nameB={nameB}
          />
          <Link
            href="/blend"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-[#E6DFD5] hover:border-[#2C2A29] text-[#2C2A29] font-bold px-6 py-3 text-sm shadow-sm active-press transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            New Blend
          </Link>
        </div>
      </section>

      {/* Shared Places */}
      {result.sharedPlaces.length > 0 && (
        <section className="rounded-3xl bg-white border border-[#E6DFD5] p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="font-sans text-lg font-black text-[#2C2A29]">
            Places you both saved ({result.sharedPlaces.length})
          </h2>
          <div className="space-y-2">
            {result.sharedPlaces.map((place, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl bg-[#FAF6F0] border border-[#E6DFD5] px-4 py-2.5"
              >
                <MapPin className="h-4 w-4 text-[#4A6B5D] shrink-0" />
                <div>
                  <span className="text-sm font-bold text-[#2C2A29]">{place.name}</span>
                  {place.destination && (
                    <span className="ml-2 text-xs text-[#78726D] font-medium">
                      — {place.destination}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Shared Destinations */}
      {result.sharedDestinations.length > 0 && (
        <section className="rounded-3xl bg-[#F5F1E8] border border-[#E6DFD5] p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="font-sans text-base font-black text-[#2C2A29]">
            Destinations you both love
          </h2>
          <div className="flex flex-wrap gap-2">
            {result.sharedDestinations.map((dest, i) => (
              <span
                key={i}
                className="rounded-full bg-[#4A6B5D] text-white px-3.5 py-1.5 text-xs font-bold"
              >
                📍 {dest}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* No overlap message */}
      {result.sharedPlaces.length === 0 && result.sharedDestinations.length === 0 && (
        <section className="rounded-3xl bg-[#F5F1E8] border border-[#E6DFD5] p-8 text-center space-y-2 shadow-sm">
          <div className="text-3xl">🌎</div>
          <h2 className="font-sans text-base font-bold text-[#2C2A29]">
            Different travel worlds — for now!
          </h2>
          <p className="text-xs text-[#78726D] font-medium max-w-xs mx-auto">
            You have no public places in common yet. Explore more and Blend again later!
          </p>
        </section>
      )}

      {/* Profile Links */}
      <section className="flex flex-col sm:flex-row gap-3">
        {result.userA.username && (
          <Link
            href={`/u/${result.userA.username}`}
            className="flex-1 rounded-2xl bg-white border border-[#E6DFD5] p-5 hover:border-[#2C2A29] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#78726D]">
                  View Profile
                </p>
                <p className="font-sans text-sm font-black text-[#2C2A29] mt-0.5">{nameA}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#4A6B5D] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        )}
        {result.userB.username && (
          <Link
            href={`/u/${result.userB.username}`}
            className="flex-1 rounded-2xl bg-white border border-[#E6DFD5] p-5 hover:border-[#2C2A29] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#78726D]">
                  View Profile
                </p>
                <p className="font-sans text-sm font-black text-[#2C2A29] mt-0.5">{nameB}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#4A6B5D] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        )}
      </section>
    </div>
  );
}
