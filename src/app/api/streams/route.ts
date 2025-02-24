import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';

const YT_REGEX = new RegExp("^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+$") 
const SPOTIFY_REGEX = new RegExp("^https?:\/\/open\.spotify\.com\/track\/[\w-]+$")


const CreateStreamSchema = z.object({
    creatorId : z.string(),
    url: z.string().url().refine((url) => 
        url.includes("youtube") || url.includes("spotify"))
})

export async function POST( req : NextRequest){
    try{
        const data = CreateStreamSchema.parse(await req.json())
        const isYT = YT_REGEX.test(data.url);
        if(!isYT){
            return  NextResponse.json({
                message : "Wrong Url "
            },{
                status:411
            })
        }
        
        const extractedId = data.url.split("?v=")[1]

        prisma.stream.create({
            data:{
                userId:data.creatorId,
                url:data.url,
                extractedId,
                type:"Youtube"
            }  
        })
    }catch(e){
        return  NextResponse.json({
            message : "Error while adding streams"
        },{
            status:411
        })
    }
}