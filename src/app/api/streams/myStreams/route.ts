import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = session.user;
    const streams = await prisma.stream.findMany({
      where: {
        userId: user.id,
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
    return NextResponse.json({
      streams:streams.map(({_count,...rest}) => ({...rest,upvotes:_count.upvotes}))
    });
  } catch (error) {
    console.error("Error fetching streams:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
