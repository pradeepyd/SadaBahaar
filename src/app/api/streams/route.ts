import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import axios from 'axios';
import { broadcastToAll } from "@/ws-server";

async function getVideoDetails(extractedId: string): Promise<{ title: string; thumbnail: string } | undefined> {
    try {
        const response = await axios.get(process.env.YOUTUBE_API_URL || "", {
          params: {
            part: 'snippet',  // Fetch the snippet part (title, description, thumbnails, etc.)
            id: extractedId,
            key: process.env.YOUTUBE_API_KEY,  // Your API key
          },
        });
    
        if (response.data.items && response.data.items.length > 0) {
          const video = response.data.items[0].snippet;
          const title = video.title;
          const thumbnail = video.thumbnails?.high?.url || video.thumbnails?.default?.url || ""; // Get the highest quality thumbnail
          return { title, thumbnail };
        } else {
          console.error("Video not found");
          return undefined;
        }
      } catch (error) {
        console.error("Error fetching video details:", error);
        return undefined;
      }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { url, roomId } = body;
    if (!roomId) {
      return NextResponse.json({ message: "roomId is required" }, { status: 400 });
    }

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

    const urlObj = new URL(url);
    const extractedId = urlObj.searchParams.get("v");
    if (!extractedId) {
      return NextResponse.json(
        {
          message: "Wrong Url ",
        },
        {
          status: 411,
        }
      );
    }
    
    const videoDetails = await getVideoDetails(extractedId);
    const title = videoDetails?.title || "Unknown Title";
    const thumbnail = videoDetails?.thumbnail || "";

    await prisma.stream.create({
      data: {
        userId: user.id,
        roomId,
        url: url,
        extractedId,
        type: "Youtube",
        title,
        thumbnail
      },
    });
    
    broadcastToAll({ type: 'queue', action: 'add-song', userId: user.id, roomId });
    
    return NextResponse.json(
      { message:"success" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        message: "Error while adding streams",
      },
      {
        status: 411,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    const roomId = req.nextUrl.searchParams.get("roomId");
    if (!roomId) {
      return NextResponse.json({ error: 'roomId is required' }, { status: 400 });
    }
    // Fetch all streams for the room, do not filter by lastPlayedAt
    const streams = await prisma.stream.findMany({
      where: {
        roomId,
        active: true,
      },
      include: {
        _count: {
          select: {
            upvotes: true,
            downvotes: true
          }
        },
        upvotes: user ? {
          where: {
            userId: user.id
          }
        } : false,
        downvotes: user ? {
          where: {
            userId: user.id
          }
        } : false
      }
    });
    // Sort by vote score, then recency
    const sorted = streams.sort((a, b) => {
      const aScore = a._count.upvotes - a._count.downvotes;
      const bScore = b._count.upvotes - b._count.downvotes;
      if (bScore !== aScore) return bScore - aScore;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    // Map to frontend Stream shape
    const mapped = sorted.map((s) => ({
      id: s.id,
      title: s.title,
      extractedId: s.extractedId,
      upvotes: s._count.upvotes,
      downvotes: s._count.downvotes,
      thumbnail: s.thumbnail,
      haveUpvoted: s.upvotes && s.upvotes.length > 0,
      haveDownvoted: s.downvotes && s.downvotes.length > 0,
      url: s.url,
      type: s.type,
      lastPlayedAt: s.lastPlayedAt?.toISOString() || null,
    }));
    // Fetch room playback sync info
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { currentSongId: true, currentSongStartedAt: true, creatorId: true }
    });
    return NextResponse.json({ streams: mapped, currentSongId: room?.currentSongId, currentSongStartedAt: room?.currentSongStartedAt, creatorId: room?.creatorId });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
