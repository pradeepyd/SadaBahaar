import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: 'Room name is required' }, { status: 400 });
    // Ensure user exists in DB
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        role: "Creator",
        provider: "Google"
      }
    });
    const room = await prisma.room.create({
      data: { name, creatorId: user.id },
    });
    return NextResponse.json({ id: room.id, name: room.name, creatorId: room.creatorId });
  } catch (err) {
    console.error('Error in /api/rooms:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 