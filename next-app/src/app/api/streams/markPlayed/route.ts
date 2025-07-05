import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/db';
import axios from 'axios';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('markPlayed body:', body);
        const { streamId, roomId } = body;
        if (!streamId || !roomId) return NextResponse.json({ error: 'Missing streamId or roomId', received: body }, { status: 400 });
        // Only update if stream is in the room
        await prisma.stream.updateMany({
            where: { id: streamId, roomId } as { id: string; roomId: string },
            data: { lastPlayedAt: new Date() } as { lastPlayedAt: Date }
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
        await axios.post(process.env.NEXT_PUBLIC_WS_BROADCAST_URL || "http://localhost:3001/broadcast", {
            type: 'queue', action: 'mark-played', streamId, roomId
        });
        return NextResponse.json({ message: 'Marked as played' });
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 400 });
    }
} 