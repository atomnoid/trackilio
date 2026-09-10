import { getSiteUrl } from '@/lib/utils';
import { Profile } from '@/types/database';

interface ProfileJsonLdProps {
  profile: Profile;
  publicListsCount: number;
  username: string;
}

export function ProfileJsonLd({ profile, publicListsCount, username }: ProfileJsonLdProps) {
  const siteUrl = getSiteUrl();
  const profileUrl = `${siteUrl}/u/${username}`;

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.display_name || username,
    url: profileUrl,
    ...(profile.avatar_url ? { image: profile.avatar_url } : {}),
    ...(profile.bio ? { description: profile.bio } : {}),
    ...(profile.location ? { address: { '@type': 'PostalAddress', addressLocality: profile.location } } : {}),
    sameAs: [profileUrl],
  };

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${profile.display_name || username}'s Travel Lists`,
        item: profileUrl,
      },
    ],
  };

  // Emit a ProfilePage entity describing the page itself
  const profilePage = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: profileUrl,
    name: `${profile.display_name || username} on Trackilio`,
    description:
      profile.bio ||
      `${profile.display_name || username} has shared ${publicListsCount} travel list${publicListsCount !== 1 ? 's' : ''} on Trackilio.`,
    mainEntity: {
      '@type': 'Person',
      name: profile.display_name || username,
      url: profileUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePage) }}
      />
    </>
  );
}
