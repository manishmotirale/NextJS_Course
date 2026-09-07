"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ProblemsHeader } from "./problems-header";
import { useProblemFilters } from "../hooks/use-problem-filters";
import { ProblemsFilters } from "./problem-filters";
import { usePagination } from "../hooks/use-pagination";
import { ProblemRow } from "./problem-row";
import { ProblemsEmpty } from "./problem-empty";
import { ProblemsPagination } from "./problems-pagination";
import { DeleteProblemDialog } from "./delete-problem-dialog";
import { deleteProblem } from "../actions";
import CreatePlaylistModal from "@/modules/playlists/components/create-playlists";
import { usePlaylistActions } from "@/modules/playlists/hooks/use-playlist-action";
import AddToPlaylistModal from "@/modules/playlists/components/add-to-playlist";

const ProblemsTable = ({ problems = [], user, dailyProblemId }: any) => {
  const router = useRouter();
  const filters = useProblemFilters(problems);
  const pagination = usePagination(filters.filteredProblems, 10); // 10 items per page
  const playlist = usePlaylistActions();

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title?: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const requestDelete = (problemId: string) => {
    const target = problems.find((p: any) => p.id === problemId);
    setDeleteTarget({ id: problemId, title: target?.title });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const result = await deleteProblem(deleteTarget.id);
      if (result.success) {
        toast.success("Problem deleted successfully");
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete problem");
      }
    } catch {
      toast.error("Something went wrong while deleting");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6 relative z-10 text-slate-900 dark:text-zinc-100 transition-colors">
      {/* Platform Workspace Context Header */}
      <ProblemsHeader
        onCreatePlaylist={playlist.openCreateModal}
        problems={filters.filteredProblems}
        dailyProblemId={dailyProblemId}
      />

      {/* Platform Filter Control Rig */}
      <ProblemsFilters
        search={filters.search}
        onSearchChange={filters.setSearch}
        difficulty={filters.difficulty}
        onDifficultyChange={filters.setDifficulty}
        selectedTag={filters.selectedTag}
        onTagChange={filters.setSelectedTag}
        allTags={filters.allTags}
        status={filters.status}
        onStatusChange={filters.setStatus}
      />

      {/* Master Problems Table Canvas */}
      <Card className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md shadow-md transition-all duration-300">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-100/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-zinc-800/80">
              <TableRow className="hover:bg-transparent border-none">
                {/* 💡 Aligned and added pl-4 to match the body cell indicator layout */}
                <TableHead className="w-[120px] pl-5 h-12 text-[10px] font-extrabold tracking-wider text-slate-500 dark:text-zinc-400 uppercase font-mono">
                  # / Status
                </TableHead>
                <TableHead className="h-12 text-[10px] font-extrabold tracking-wider text-slate-500 dark:text-zinc-400 uppercase font-mono">
                  Problem Title
                </TableHead>
                <TableHead className="text-center h-12 text-[10px] font-extrabold tracking-wider text-slate-500 dark:text-zinc-400 uppercase font-mono">
                  Tags
                </TableHead>
                <TableHead className="w-[120px] h-12 text-[10px] font-extrabold tracking-wider text-slate-500 dark:text-zinc-400 uppercase font-mono">
                  Difficulty
                </TableHead>
                <TableHead className="w-[200px] text-right pr-6 h-12 text-[10px] font-extrabold tracking-wider text-slate-500 dark:text-zinc-400 uppercase font-mono">
                  Workspace Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-200/60 dark:divide-zinc-800/60">
              {pagination.paginatedItems.length > 0 ? (
                pagination.paginatedItems.map((problem, idx) => (
                  <ProblemRow
                    key={problem.id}
                    problem={problem}
                    number={pagination.displayRange.start + idx}
                    user={user}
                    onDelete={requestDelete}
                    onSave={playlist.openAddToPlaylist}
                  />
                ))
              ) : (
                <TableRow className="hover:bg-transparent border-none">
                  <TableCell colSpan={5} className="h-48 p-0">
                    <ProblemsEmpty />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Workspace Pagination Context Module */}
      {pagination.showPagination && (
        <div className="flex justify-center pt-2">
          <ProblemsPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            displayRange={pagination.displayRange}
            canGoPrev={pagination.canGoPrevious}
            canGoNext={pagination.canGoNext}
            onPrev={pagination.goToPreviousPage}
            onNext={pagination.goToNextPage}
            onPageChange={pagination.goToPage}
          />
        </div>
      )}

      <CreatePlaylistModal
        isOpen={playlist.isCreateModalOpen}
        onClose={playlist.closeCreateModal}
        onSubmit={playlist.handleCreatePlaylist}
      />

      <AddToPlaylistModal
        isOpen={playlist.isAddToPlalistModalOpen}
        onClose={playlist.closeAddToPlaylistModal}
        onSubmit={playlist.handleAddToPlaylist}
        problemId={playlist.selectedProblemId}
      />

      <DeleteProblemDialog
        isOpen={!!deleteTarget}
        isDeleting={isDeleting}
        problemTitle={deleteTarget?.title}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ProblemsTable;
