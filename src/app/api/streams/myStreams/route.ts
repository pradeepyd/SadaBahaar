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


export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { url, title, thumbnail, extractedId, type } = body;

    if (!url || !title || !extractedId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newStream = await prisma.stream.create({
      data: {
        userId: user.id,
        url,
        title,
        extractedId,
        thumbnail,
        type,
      },
    });

    return NextResponse.json({ stream: newStream }, { status: 201 });
  } catch (error) {
    console.error("Error creating stream:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}