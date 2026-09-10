import { NextResponse } from 'next/server';
import { getSiteUrl } from '@/lib/utils';
import { getSitemapChunkList } from '@/lib/sitemap-config';

export const revalidate = 3600;

export async function GET() {
  const siteUrl = getSiteUrl();
  const chunks = await getSitemapChunkList();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunks
  .map(
    (chunk) => `  <sitemap>
    <loc>${siteUrl}/sitemap/${chunk.id}.xml</loc>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
