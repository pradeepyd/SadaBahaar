import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const streams = await prisma.stream.findMany({
      where: {
        userId: user.id
      },
      include: {
        _count: {
          select: {
            upvotes: true,
            downvotes: true
            }
        },
        upvotes: {
          where: {
            userId: user.id
          }
        },
        downvotes: {
          where: {
            userId: user.id
            }
        }
      },
    });
    
    return NextResponse.json({
      streams: streams.map(({ _count, upvotes, downvotes, ...rest }) => ({
        ...rest,
        upvotes: _count.upvotes,
        downvotes: _count.downvotes,
        haveUpvoted: upvotes.length > 0,
        haveDownvoted: downvotes.length > 0
      }))
    });
  } catch (error) {
    console.error("Error fetching streams:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

