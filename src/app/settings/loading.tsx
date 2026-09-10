import { HotAirBalloonLoading } from '@/components/brand/HotAirBalloonLoading';

export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <HotAirBalloonLoading
        message="Loading Account Settings..."
        submessage="Retrieving profile preferences and privacy options"
        size={110}
      />
    </div>
  );
}
