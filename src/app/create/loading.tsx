import { HotAirBalloonLoading } from '@/components/brand/HotAirBalloonLoading';

export default function CreateListLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <HotAirBalloonLoading
        message="Setting up your new travel guide..."
        submessage="Getting itinerary editor and map ready"
        size={120}
      />
    </div>
  );
}
