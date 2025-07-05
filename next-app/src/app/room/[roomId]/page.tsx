import { CreatorDashboard } from '@/components/Dashboard';

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  return <CreatorDashboard roomId={roomId} />;
} 