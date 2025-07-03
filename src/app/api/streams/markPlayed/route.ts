import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
const { broadcastToAll } = require('@/ws-server');

export async function POST(req: NextRequest) {
  try {
    const { streamId, roomId } = await req.json();
    if (!streamId || !roomId) return NextResponse.json({ error: 'Missing streamId or roomId' }, { status: 400 });
    // Only update if stream is in the room
    await prisma.stream.updateMany({
      where: { id: streamId, roomId } as any,
      data: { lastPlayedAt: new Date() } as any
    });
    // Set current song and start time for playback sync
    await prisma.room.update({
      where: { id: roomId },
      data: {
        currentSongId: streamId,
        currentSongStartedAt: new Date()
      }
    });
    // Clear all upvotes and downvotes for this stream
    await prisma.upvote.deleteMany({ where: { streamId } });
    await prisma.downvote.deleteMany({ where: { streamId } });
    // Broadcast queue update
    broadcastToAll({ type: 'queue', action: 'mark-played', streamId, roomId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 