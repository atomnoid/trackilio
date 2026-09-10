import { getSiteUrl } from '@/lib/utils';
import { Place } from '@/types/database';

interface PlaceJsonLdProps {
  place: Place;
}

export function PlaceJsonLd({ place }: PlaceJsonLdProps) {
  const siteUrl = getSiteUrl();
  const placeUrl = `${siteUrl}/place/${place.slug || place.id}`;

  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: place.name,
    description: place.description || `${place.name} in ${place.location || place.city || 'Trackilio'}.`,
    url: placeUrl,
    ...(place.address || place.location
      ? {
          address: {
            '@type': 'PostalAddress',
            addressLocality: place.city || place.location,
            addressCountry: place.country,
            streetAddress: place.address || undefined,
          },
        }
      : {}),
    ...(place.lat != null && place.lng != null
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: place.lat,
            longitude: place.lng,
          },
        }
      : {}),
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
        name: 'Discover',
        item: `${siteUrl}/discover`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: place.name,
        item: placeUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
    </>
  );
}
