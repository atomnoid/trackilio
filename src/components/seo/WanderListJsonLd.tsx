import { getSiteUrl } from '@/lib/utils';
import { WanderList, ListPlace } from '@/types/database';

interface JsonLdProps {
  list: WanderList;
  places: ListPlace[];
}

export function WanderListJsonLd({ list, places }: JsonLdProps) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/l/${list.slug}`;

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
        name: 'Discover',
        item: `${siteUrl}/discover`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: list.title,
        item: url,
      },
    ],
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: list.title,
    description: list.description || `Travel list for ${list.destination || 'various places'}`,
    url: url,
    numberOfItems: places.length,
    itemListElement: places.map((lp, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Place',
        name: lp.place?.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: lp.place?.location || undefined,
          addressCountry: lp.place?.country || undefined,
        },
        description: lp.note || undefined,
        sameAs: lp.place?.maps_url || undefined,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
    </>
  );
}
