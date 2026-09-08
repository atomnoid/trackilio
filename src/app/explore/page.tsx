import { redirect } from 'next/navigation';

interface ExplorePageProps {
  searchParams: Promise<{ query?: string; destination?: string }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.query ? `?query=${encodeURIComponent(resolvedParams.query)}` : '';
  const destination = resolvedParams.destination
    ? `${query ? '&' : '?'}destination=${encodeURIComponent(resolvedParams.destination)}`
    : '';

  redirect(`/discover${query}${destination}`);
}
