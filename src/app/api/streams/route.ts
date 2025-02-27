import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
//@ts-ignore
import { google } from 'googleapis';
import axios from 'axios'
import { string, z } from "zod";

const YT_REGEX = new RegExp(
  "^https?:\\/\\/(www\\.)?youtube\\.com\\/watch\\?v=[\\w-]+(&.*)?$"
);
const SPOTIFY_REGEX = new RegExp(
  "^https?:\\/\\/open\\.spotify\\.com\\/track\\/[\\w-]+$"
);

const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z
    .string()
    .url()
    .refine((url) => YT_REGEX.test(url) || SPOTIFY_REGEX.test(url), {
      message: "Invalid YouTube or Spotify URL",
    }),
});

async function getVideoDetails(extractedId: string){
    try {
        const response = await axios.get(process.env.YOUTUBE_API_URL || "", {
          params: {
            part: 'snippet',  // Fetch the snippet part (title, description, thumbnails, etc.)
            id: extractedId,
            key: process.env.YOUTUBE_API_KEY,  // Your API key
          },
        });
    
        if (response.data.items && response.data.items.length > 0) {
          const video = response.data.items[0].snippet;
          const title = video.title;
          const thumbnail = video.thumbnails.high.url;  // Get the highest quality thumbnail
          return { title, thumbnail };
        } else {
          console.error("Video not found");
        }
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
}



export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await req.json());
    const urlObj = new URL(data.url);
    const extractedId = urlObj.searchParams.get("v");
    if (!extractedId) {
      return NextResponse.json(
        {
          message: "Wrong Url ",
        },
        {
          status: 411,
        }
      );
    }
const { title, thumbnail }:any = await getVideoDetails(extractedId);

      
    await prisma.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube",
        title,
        thumbnail
      },
    });

    return NextResponse.json(
      { message: "Stream added successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "Error while adding streams",
      },
      {
        status: 411,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  const streams = await prisma.stream.findMany({
    where: {
      userId: creatorId ?? "",
    },
  });
  return NextResponse.json({
    streams,
  });
}
