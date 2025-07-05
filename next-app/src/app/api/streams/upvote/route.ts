import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import prisma from '@/lib/db';
import axios from 'axios';
import { currentUser } from "@clerk/nextjs/server";

const UpvoteSchema = z.object({
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
        const { streamId, roomId } = UpvoteSchema.parse(data);

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

        // Remove any existing downvote for this user and song
        await prisma.downvote.deleteMany({ where: { userId: user.id, streamId } });
        // Upvote logic: add upvote to the stream
        try {
          await prisma.upvote.create({
            data: {
              userId: user.id,
              streamId: streamId,
            }
          });
        } catch (err: unknown) {
          // Ignore unique constraint violation (already upvoted)
          if (isPrismaError(err) && err.code !== 'P2002') {
            console.error('Upvote error:', err);
            throw err;
          }
        }
        // Count upvotes after voting
        const upvoteCount = await prisma.upvote.count({ where: { streamId } });
        await axios.post(process.env.NEXT_PUBLIC_WS_BROADCAST_URL || "http://localhost:3001/broadcast", {
            type: 'vote', action: 'add-upvote', streamId, userId: user.id, roomId
        });
        return NextResponse.json({ message: 'Upvoted', upvotes: upvoteCount });
    } catch (err) {
        console.error('Upvote API error:', err);
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
        const { streamId, roomId } = UpvoteSchema.parse(data);
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
        // Remove upvote logic
        await prisma.upvote.deleteMany({ where: { userId: user.id, streamId } });
        const upvoteCount = await prisma.upvote.count({ where: { streamId } });
        await axios.post(process.env.NEXT_PUBLIC_WS_BROADCAST_URL || "http://localhost:3001/broadcast", {
            type: 'vote', action: 'remove-upvote', streamId, userId: user.id, roomId
        });
        return NextResponse.json({ message: 'Upvote removed', upvotes: upvoteCount });
    } catch (err) {
        console.error('Upvote DELETE API error:', err);
        return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 400 });
    }
}