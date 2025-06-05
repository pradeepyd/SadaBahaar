import prisma from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';

const UpvoteSchema = z.object({
    streamId:z.string(),
})


export async function POST( req : NextRequest){
    const user =  await currentUser();
    if (!user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    // Now you can use `userId` directly in your logic without fetching from DB
    // console.log("User ID:", userId);

    // return NextResponse.json({ message: "User ID retrieved", userId });

    try {
        const data = UpvoteSchema.parse(await req.json());
        await prisma.upvote.create({
            data:{
                userId:user.id,
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