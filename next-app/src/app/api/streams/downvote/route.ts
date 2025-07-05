import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import prisma from '@/lib/db';
import axios from 'axios';
import { currentUser } from "@clerk/nextjs/server";

const DownvoteSchema = z.object({
     streamId: z.string(),
     roomId: z.string(),
});

function isPrismaError(err: unknown): err is { code: string } {
  return typeof err === 'object' && err !== null && 'code' in err && typeof (err as { code?: unknown }).code === 'string';
}

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user?.id) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const data = await req.json();
        const { streamId, roomId } = DownvoteSchema.parse(data);

        // Ensure user exists in DB
        await prisma.user.upsert({
          where: { id: user.id },
          update: {},
          create: {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || "",
            role: "Creator",
            provider: "Google"
          }
        });

        // Remove any existing upvote for this user and song
        await prisma.upvote.deleteMany({ where: { userId: user.id, streamId } });
        // Downvote logic: add downvote to the stream
        try {
          await prisma.downvote.create({
            data: {
              userId: user.id,
              streamId: streamId,
            }
          });
        } catch (err: unknown) {
          // Ignore unique constraint violation (already downvoted)
          if (isPrismaError(err) && err.code !== 'P2002') {
            console.error('Downvote error:', err);
            throw err;
          }
        }
        // Count downvotes after voting
        const downvoteCount = await prisma.downvote.count({ where: { streamId } });
        await axios.post(process.env.NEXT_PUBLIC_WS_BROADCAST_URL || "http://localhost:3001/broadcast", {
            type: 'vote', action: 'add-downvote', streamId, userId: user.id, roomId
        });
        return NextResponse.json({ message: 'Downvoted', downvotes: downvoteCount });
    } catch (err) {
        console.error('Downvote API error:', err);
        return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user?.id) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const data = await req.json();
        const { streamId, roomId } = DownvoteSchema.parse(data);
        // Ensure user exists in DB
        await prisma.user.upsert({
          where: { id: user.id },
          update: {},
          create: {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || "",
            role: "Creator",
            provider: "Google"
          }
        });
        // Remove downvote logic
        await prisma.downvote.deleteMany({ where: { userId: user.id, streamId } });
        const downvoteCount = await prisma.downvote.count({ where: { streamId } });
        await axios.post(process.env.NEXT_PUBLIC_WS_BROADCAST_URL || "http://localhost:3001/broadcast", {
            type: 'vote', action: 'remove-downvote', streamId, userId: user.id, roomId
        });
        return NextResponse.json({ message: 'Downvote removed', downvotes: downvoteCount });
    } catch (err) {
        console.error('Downvote DELETE API error:', err);
        return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 400 });
    }
}
