import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';

const UpvoteSchema = z.object({
    streamId:z.string(),
})


export async function POST( req : NextRequest){
    const session = await getServerSession(authOptions); 
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id; // No DB call needed

    // Now you can use `userId` directly in your logic without fetching from DB
    console.log("User ID:", userId);

    // return NextResponse.json({ message: "User ID retrieved", userId });

    try {
        const data = UpvoteSchema.parse(await req.json());
        await prisma.upvote.create({
            data:{
                userId:userId,
                streamId:data.streamId
            }
        })
    } catch (e) {
        return  NextResponse.json({
            message : "Error while upvoting"
        },{
            status:411
        })
    }
}