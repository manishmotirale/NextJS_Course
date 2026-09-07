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

/** Remove a problem from a playlist (owner only). */
export async function POST(req: NextRequest) {
  try {
    const user = await getDbUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { problemId, playlistId } = await req.json();
    if (!problemId || !playlistId) {
      return NextResponse.json(
        { success: false, error: "problemId and playlistId are required" },
        { status: 400 }
      );
    }

    // Verify the playlist belongs to this user
    const playlist = await prisma.playlist.findFirst({
      where: { id: playlistId, userId: user.id },
      select: { id: true },
    });
    if (!playlist) {
      return NextResponse.json(
        { success: false, error: "Playlist not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.problemPlaylist.deleteMany({
      where: { playlistId, problemId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[remove-problem] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to remove problem from playlist" },
      { status: 500 }
    );
  }
}
