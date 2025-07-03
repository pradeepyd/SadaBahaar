import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    
    if (!creatorId) {
      return NextResponse.json({ error: "Creator ID is required" }, { status: 400 });
    }

    // Get the most recent song
    const currentSong = await prisma.stream.findFirst({
      where: {
        userId: creatorId,
        active: true,
      },
      include: {
        _count: {
          select: {
            upvotes: true,
            downvotes: true
          }
        }
      }
    });

    if (!currentSong) {
      return NextResponse.json({ currentSong: null });
    }

    return NextResponse.json({
      currentSong: {
        ...currentSong,
        upvotes: currentSong._count.upvotes,
        downvotes: currentSong._count.downvotes
      }
    });
  } catch (error) {
    console.error("Error fetching current song:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 