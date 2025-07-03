import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
const { broadcastToAll } = require('@/ws-server');

const UpvoteSchema = z.object({
    streamId: z.string(),
    roomId: z.string(),
})

export async function POST(req: NextRequest) {
    const user = await currentUser();
    if (!user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { streamId, roomId } = body;
        if (!streamId || !roomId) {
            return NextResponse.json({ error: 'streamId and roomId are required' }, { status: 400 });
        }

        const data = UpvoteSchema.parse(body);
        
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
        
        // Check if user has already downvoted this stream
        const existingDownvote = await prisma.downvote.findUnique({
            where: {
                userId_streamId: {
                    userId: user.id,
                    streamId: data.streamId,
                },
            },
        });

        // If user has downvoted, remove the downvote first
        if (existingDownvote) {
            await prisma.downvote.delete({
                where: {
                    userId_streamId: {
                        userId: user.id,
                        streamId: data.streamId,
                    },
                },
            });
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

        if (existingUpvote) {
            // Remove upvote if already exists
            await prisma.upvote.delete({
                where: {
                    userId_streamId: {
                        userId: user.id,
                        streamId: data.streamId,
                    },
                },
            });
            broadcastToAll({ type: 'vote', action: 'remove-upvote', streamId: data.streamId, userId: user.id });
            return NextResponse.json({ message: "Upvote removed successfully" });
        } else {
            // Add upvote
            await prisma.upvote.create({
                data: {
                    userId: user.id,
                    streamId: data.streamId,
                },
            });
            broadcastToAll({ type: 'vote', action: 'add-upvote', streamId: data.streamId, userId: user.id });
            return NextResponse.json({ message: "Upvote added successfully" });
        }
    } catch (e) {
        console.error("Error while upvoting:", e);
        return NextResponse.json({
            message: "Error while upvoting"
        }, {
            status: 411
        });
    }
}