import { HotAirBalloonLoading } from '@/components/brand/HotAirBalloonLoading';

export default function PlaceLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <HotAirBalloonLoading
        message="Loading Place Details"
        submessage="Getting spot coordinates, photos, and community ratings..."
        size={120}
      />
    </div>
  );
}
