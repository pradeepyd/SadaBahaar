import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    const roomId = req.nextUrl.searchParams.get('roomId');
    if (!user?.id || !roomId) return NextResponse.json({ streams: [] });
    // Find streams the user has upvoted in this room
    const upvotes = await prisma.upvote.findMany({
      where: { userId: user.id },
      select: { streamId: true }
    });
    const streamIds = upvotes.map((u: { streamId: string }) => u.streamId);
    if (streamIds.length === 0) return NextResponse.json({ streams: [] });
    const streams = await prisma.stream.findMany({
      where: { id: { in: streamIds }, roomId },
      include: {
        _count: { select: { upvotes: true, downvotes: true } },
        upvotes: { where: { userId: user.id } },
        downvotes: { where: { userId: user.id } }
      }
    });
    // Map to frontend Stream shape
    const mapped = streams.map((s) => ({
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