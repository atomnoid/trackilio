import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlendSession } from '@/services/blend';
import { InteractiveBlendResult } from '@/components/blend/InteractiveBlendResult';
import { getSiteUrl } from '@/lib/utils';

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
  const siteUrl = getSiteUrl();

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

export default async function BlendResultPage({ params }: BlendResultPageProps) {
  const { id } = await params;
  const result = await getBlendSession(id);

  if (!result) notFound();

  return (
    <InteractiveBlendResult
      blend={{
        id,
        score: result.score,
        label: result.label,
        sharedPlaces: result.sharedPlaces,
        sharedDestinations: result.sharedDestinations,
        sharedCategories: result.sharedCategories,
        userA: result.userA,
        userB: result.userB,
      }}
    />
  );
}
