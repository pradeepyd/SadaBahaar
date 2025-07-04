import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { subMinutes } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    const roomId = req.nextUrl.searchParams.get('roomId');
    if (!user?.id || !roomId) return NextResponse.json({ streams: [] });
    const fiveMinutesAgo = subMinutes(new Date(), 5);
    const streams = await prisma.stream.findMany({
      where: { userId: user.id, roomId } as { userId: string; roomId: string },
      include: {
        _count: { select: { upvotes: true, downvotes: true } },
        upvotes: { where: { userId: user.id } },
        downvotes: { where: { userId: user.id } }
      }
    });
    // Only include streams with lastPlayedAt in the last 5 minutes
    const recent = streams.filter(s => s.lastPlayedAt && s.lastPlayedAt >= fiveMinutesAgo);
    // Map to frontend Stream shape
    const mapped = recent.map((s) => ({
      id: s.id,
      title: s.title,
      extractedId: s.extractedId,
      upvotes: s._count.upvotes,
      downvotes: s._count.downvotes,
      thumbnail: s.thumbnail,
      haveUpvoted: s.upvotes.length > 0,
      haveDownvoted: s.downvotes.length > 0,
      url: s.url,
      type: s.type,
      lastPlayedAt: s.lastPlayedAt?.toISOString() || null,
    }));
    return NextResponse.json({ streams: mapped });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 