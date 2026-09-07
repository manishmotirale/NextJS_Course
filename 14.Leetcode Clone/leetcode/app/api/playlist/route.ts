import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

async function getDbUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;
  return prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    select: { id: true },
  });
}

export async function GET(req: NextRequest) {
  try {
    const user = await getDbUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const playlists = await prisma.playlist.findMany({
      where: { userId: user.id },
      include: {
        problems: {
          include: {
            problem: {
              select: { id: true, title: true, difficulty: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, playlists });
  } catch (err) {
    console.error("[playlist GET] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch playlists" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getDbUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Playlist name is required" },
        { status: 400 }
      );
    }

    const playlist = await prisma.playlist.create({
      data: { name, description, userId: user.id },
    });

    return NextResponse.json({ success: true, playlist });
  } catch (err) {
    console.error("[playlist POST] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create playlist" },
      { status: 500 }
    );
  }
}