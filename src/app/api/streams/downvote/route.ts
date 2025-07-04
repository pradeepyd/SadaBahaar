import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { broadcastToAll } from '@/ws-server';

const DownvoteSchema = z.object({
  streamId: z.string(),
  roomId: z.string(),
});

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user?.id) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const body = await req.json();
    const { streamId, roomId } = body;
    if (!streamId || !roomId) {
      return NextResponse.json({ error: 'streamId and roomId are required' }, { status: 400 });
    }

    const data = DownvoteSchema.parse(body);
    
    // Check if user exists in database, if not create them
    let dbUser = await prisma.user.findUnique({
        where: { id: user.id }
    });

    if (!dbUser) {
        dbUser = await prisma.user.create({
            data: {
                id: user.id,
                email: user.emailAddresses[0]?.emailAddress || "",
                role: "User",
                provider: "Google"
            }
        });
    }
    
    // Find the stream in the room
    const stream = await prisma.stream.findFirst({
      where: { id: streamId, roomId } as unknown as { id: string; roomId: string }
    });
    if (!stream) {
      return NextResponse.json({ error: 'Stream not found in this room' }, { status: 404 });
    }
    
    // Check if user has already upvoted this stream
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_streamId: {
          userId: user.id,
          streamId: data.streamId,
        },
      },
    });

    // If user has upvoted, remove the upvote first
    if (existingUpvote) {
      await prisma.upvote.delete({
        where: {
          userId_streamId: {
            userId: user.id,
            streamId: data.streamId,
          },
        },
      });
    }

    // Check if user has already downvoted this stream
    const existingDownvote = await prisma.downvote.findUnique({
      where: {
        userId_streamId: {
          userId: user.id,
          streamId: data.streamId,
        },
      },
    });

    if (existingDownvote) {
      // Remove downvote if already exists
      await prisma.downvote.delete({
        where: {
          userId_streamId: {
            userId: user.id,
            streamId: data.streamId,
          },
        },
      });
      broadcastToAll({ type: 'vote', action: 'remove-downvote', streamId: data.streamId, userId: user.id });
      return NextResponse.json({ message: "Downvote removed successfully" });
    } else {
      // Add downvote
      await prisma.downvote.create({
        data: {
          userId: user.id,
          streamId: data.streamId,
        },
      });
      broadcastToAll({ type: 'vote', action: 'add-downvote', streamId: data.streamId, userId: user.id });
      return NextResponse.json({ message: "Downvote added successfully" });
    }
  } catch (e) {
    console.error("Error while downvoting:", e);
    return NextResponse.json(
      {
        message: "Error while downvoting",
      },
      {
        status: 411,
      }
    );
  }
}
