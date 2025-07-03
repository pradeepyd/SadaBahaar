import { CreatorDashboard } from '@/components/Dashboard';

export default function RoomPage({ params }: { params: { roomId: string } }) {
  return <CreatorDashboard roomId={params.roomId} />;
} 