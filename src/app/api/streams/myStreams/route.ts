import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions); 
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const userId = session.user.id;

        const streams = await prisma.stream.findMany({
            where: {
                userId: userId ,
            },
        });
        return NextResponse.json({
            streams,
        });
  }
  