import prisma from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const  user = await currentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const streams = await prisma.stream.findMany({
      where: {
        userId:user.id
      },
      include:{
        _count:{
            select:{
                upvotes:true
            }
        },
        upvotes:{
            where:{
                userId:user.id
            }
        }
      },
      
    });
    // console.log(streams)
    return NextResponse.json({
      streams:streams.map(({_count,...rest}) => ({
        ...rest,upvotes:_count.upvotes,
        haveUpvoted:rest.upvotes.length ? true :false
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
