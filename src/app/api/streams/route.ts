import { NextRequest } from "next/server";
import { z } from 'zod';

const CreateStreamSchema = z.object({
    creatorId : z.string(),
    url: z.string().url().refine((url) => 
        url.includes("youtube") || url.includes("spotify"))
})

export async function POST( req : NextRequest){
    try{
        const data = CreateStreamSchema.safeParse(await req.json())

    }catch(e){

    }
}