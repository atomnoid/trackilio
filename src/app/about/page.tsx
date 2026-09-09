import type { Metadata } from 'next';
import { InteractiveAbout } from '@/components/about/InteractiveAbout';

export const metadata: Metadata = {
  title: 'About Trackilio | How It Works & Interactive Guide',
  description:
    'Discover how Trackilio works — collect travel spots, collaborate on itineraries with friends by @username, and discover travel compatibility through Travel Blend.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <InteractiveAbout />
    </div>
  );
}
