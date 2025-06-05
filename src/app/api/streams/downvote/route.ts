
import prisma from "@/lib/db";
import { auth, currentUser} from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpvoteSchema = z.object({
  streamId: z.string(),
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
    const data = UpvoteSchema.parse(await req.json());
    await prisma.upvote.delete({
      where: {
        userId_streamId: {
          userId:user.id,
          streamId: data.streamId,
        },
      },
    });
     return NextResponse.json({ message: "Upvote removed successfully" });
  } catch (e) {
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
