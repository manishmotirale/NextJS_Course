import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUserData } from "@/modules/auth/actions";
import { getProblemDifficultyCounts } from "@/modules/problems/actions";
import { SubmissionHistory } from "@/modules/problems/components/submission-history";
import PlaylistsSection from "@/modules/profile/components/playlist-section";
import ProfileStats from "@/modules/profile/components/profile-stats";
import SolvedProblems from "@/modules/profile/components/solved-problems";
import DifficultyBreakdown from "@/modules/profile/components/difficulty-breakdown";
import UserInfoCard from "@/modules/profile/components/user-info-card";

/**
 * Current streak = consecutive calendar days (ending today or yesterday) that
 * have at least one Accepted submission.
 */
function computeStreak(submissions: any[]): number {
  const toKey = (d: Date) => d.toISOString().slice(0, 10);
  const acceptedDays = new Set(
    submissions
      .filter((s) => s.status === "Accepted")
      .map((s) => toKey(new Date(s.createdAt))),
  );
  if (acceptedDays.size === 0) return 0;

  const cursor = new Date();
  // Allow the streak to count from today, or from yesterday if today is pending.
  if (!acceptedDays.has(toKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!acceptedDays.has(toKey(cursor))) return 0;
  }

  let streak = 0;
  while (acceptedDays.has(toKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

const ProfilePage = async () => {
  const profileData: any = await getCurrentUserData();

  // Redirect unauthenticated users to sign-in
  if (!profileData || "error" in profileData) {
    redirect("/sign-in");
  }

  // Safety fallbacks to prevent runtime map or loop breakage drops
  const safeSubmissions = profileData?.submissions || [];
  const safeSolvedProblems = profileData?.solvedProblems || [];
  const safePlaylists = profileData?.playlists || [];

  const streak = computeStreak(safeSubmissions);
  const { data: difficultyTotals } = await getProblemDifficultyCounts();

  return (
    <div className="min-h-screen text-slate-900 dark:text-zinc-100 transition-colors pt-28 pb-16 relative overflow-hidden">
      {/* Immersive Profile Backplate Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-purple-500/5 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-7xl space-y-6 relative z-10">
        <UserInfoCard userData={profileData} />

        <ProfileStats
          submissions={safeSubmissions}
          solvedCount={safeSolvedProblems.length}
          playlistCount={safePlaylists.length}
          streak={streak}
        />

        <DifficultyBreakdown
          solvedProblems={safeSolvedProblems}
          totals={difficultyTotals}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Submissions Matrix Feed Column */}
          <div className="lg:col-span-7">
            <SubmissionHistory submissions={safeSubmissions} />
          </div>

          {/* Aggregated Collections Column */}
          <div className="lg:col-span-5 space-y-6">
            <SolvedProblems solvedProblems={safeSolvedProblems} />
            <PlaylistsSection playlists={safePlaylists} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
