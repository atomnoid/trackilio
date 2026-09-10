import { HotAirBalloonLoading } from '@/components/brand/HotAirBalloonLoading';

export default function RootLoading() {
  return (
    <HotAirBalloonLoading
      fullScreen={true}
      message="Flying to your destination..."
      submessage="Loading curated travel spots and guides"
      size={140}
    />
  );
}
