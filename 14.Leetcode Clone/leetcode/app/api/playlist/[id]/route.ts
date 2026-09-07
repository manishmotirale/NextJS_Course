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

/** Rename / update a playlist's name and description (owner only). */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getDbUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, description } = await req.json();
    if (!name || String(name).trim() === "") {
      return NextResponse.json(
        { success: false, error: "Playlist name is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await prisma.playlist.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Playlist not found or access denied" },
        { status: 404 }
      );
    }

    const playlist = await prisma.playlist.update({
      where: { id },
      data: {
        name: String(name).trim(),
        description: description ? String(description) : null,
      },
    });

    return NextResponse.json({ success: true, playlist });
  } catch (err: any) {
    console.error("[playlist PATCH] Error:", err);
    // Unique constraint (name + userId) violation
    if (err?.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "You already have a playlist with this name" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update playlist" },
      { status: 500 }
    );
  }
}

/** Delete a playlist and all its problem links (owner only). */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getDbUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const existing = await prisma.playlist.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Playlist not found or access denied" },
        { status: 404 }
      );
    }

    // ProblemPlaylist rows cascade-delete with the playlist (schema onDelete: Cascade)
    await prisma.playlist.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[playlist DELETE] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete playlist" },
      { status: 500 }
    );
  }
}
