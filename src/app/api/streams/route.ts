import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
//@ts-ignore
import { google } from 'googleapis';
import axios from 'axios'
import * as z from "zod";
import { error } from "console";
import { auth, currentUser } from "@clerk/nextjs/server";
const { broadcastToAll } = require('@/ws-server');
import { addMinutes, isAfter, subMinutes } from 'date-fns';

const YT_REGEX = new RegExp(
  "^https?:\\/\\/(www\\.)?youtube\\.com\\/watch\\?v=[\\w-]+(&.*)?$"
);
const SPOTIFY_REGEX = new RegExp(
  "^https?:\\/\\/open\\.spotify\\.com\\/track\\/[\\w-]+$"
);

const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });

const CreateStreamSchema = z.object({
  url: z
    .string()
    .url()
    .refine((url) => YT_REGEX.test(url) || SPOTIFY_REGEX.test(url), {
      message: "Invalid YouTube or Spotify URL",
    }),
});

async function getVideoDetails(extractedId: string){
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
        }
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const data = CreateStreamSchema.parse(body);
    const { roomId } = body;
    if (!roomId) {
      return NextResponse.json({ message: "roomId is required" }, { status: 400 });
    }

    console.log("Processing stream for user:", user.id);
    
    // Check if user exists in database, if not create them
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser) {
      console.log("Creating new user in database:", user.id);
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress || "",
          role: "User",
          provider: "Google"
        }
      });
    }

    const urlObj = new URL(data.url);
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
    
    const { title, thumbnail }:any = await getVideoDetails(extractedId);

    console.log("Creating stream for user:", user.id);
    
    await prisma.stream.create({
      data: {
        userId: user.id,
        roomId,
        url: data.url,
        extractedId,
        type: "Youtube",
        title: title || "Unknown Title",
        thumbnail: thumbnail || ""
      } as any,
    });
    
    broadcastToAll({ type: 'queue', action: 'add-song', userId: user.id, roomId });
    
    console.log("Stream created successfully");

    return NextResponse.json(
      { message:"success" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating stream:", error);
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
      } as any,
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
    const sorted = (streams as any[]).sort((a, b) => {
      const aScore = a._count.upvotes - a._count.downvotes;
      const bScore = b._count.upvotes - b._count.downvotes;
      if (bScore !== aScore) return bScore - aScore;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    // Map to frontend Stream shape
    const mapped = sorted.map((s: any) => ({
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
      lastPlayedAt: s.lastPlayedAt,
    }));
    // Fetch room playback sync info
    // @ts-ignore: prisma.room is correct, false positive due to Prisma $extends
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { currentSongId: true, currentSongStartedAt: true, creatorId: true }
    });
    return NextResponse.json({ streams: mapped, currentSongId: room?.currentSongId, currentSongStartedAt: room?.currentSongStartedAt, creatorId: room?.creatorId });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Liked streams endpoint
export async function GET_LIKED(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) return NextResponse.json({ streams: [] });
    // Find streams the user has upvoted
    const upvotes = await prisma.upvote.findMany({
      where: { userId: user.id },
      select: { streamId: true }
    });
    const streamIds = upvotes.map(u => u.streamId);
    if (streamIds.length === 0) return NextResponse.json({ streams: [] });
    const streams = await prisma.stream.findMany({
      where: { id: { in: streamIds } },
      include: {
        _count: { select: { upvotes: true, downvotes: true } },
        upvotes: { where: { userId: user.id } },
        downvotes: { where: { userId: user.id } }
      }
    });
    return NextResponse.json({ streams });
  } catch (error) {
    return NextResponse.json({ streams: [] });
  }
}

// User uploads endpoint
export async function GET_UPLOADS(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) return NextResponse.json({ streams: [] });
    const streams = await prisma.stream.findMany({
      where: { userId: user.id },
      include: {
        _count: { select: { upvotes: true, downvotes: true } },
        upvotes: { where: { userId: user.id } },
        downvotes: { where: { userId: user.id } }
      }
    });
    return NextResponse.json({ streams });
  } catch (error) {
    return NextResponse.json({ streams: [] });
  }
}

// Recently played endpoint
export async function GET_RECENT(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) return NextResponse.json({ streams: [] });
    const fiveMinutesAgo = subMinutes(new Date(), 5);
    const streams = await prisma.stream.findMany({
      where: { userId: user.id },
      include: {
        _count: { select: { upvotes: true, downvotes: true } },
        upvotes: { where: { userId: user.id } },
        downvotes: { where: { userId: user.id } }
      }
    });
    const recent = (streams as any[]).filter(s => s.lastPlayedAt && new Date(s.lastPlayedAt) >= fiveMinutesAgo);
    return NextResponse.json({ streams: recent });
  } catch (error) {
    return NextResponse.json({ streams: [] });
  }
}
