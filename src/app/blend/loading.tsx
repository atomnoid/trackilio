import { HotAirBalloonLoading } from '@/components/brand/HotAirBalloonLoading';

export default function BlendLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <HotAirBalloonLoading
        message="Loading Blend Match Engine"
        submessage="Comparing travel tastes, spot affinities, and destination vibes..."
        size={130}
      />
    </div>
  );
}
