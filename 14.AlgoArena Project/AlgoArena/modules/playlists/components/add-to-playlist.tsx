"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Check, ListPlus, Library } from "lucide-react";
import { toast } from "sonner";

const AddToPlaylistModal = ({ isOpen, onClose, onSubmit, problemId }: any) => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  const loadPlaylists = async () => {
    try {
      setLoadingList(true);
      const response = await fetch("/api/playlist");
      const data = await response.json();
      if (data.success) {
        setPlaylists(data.playlists);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error("Error fetching playlists: ", error);
      toast.error(error?.message || "Failed to fetch playlists");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadPlaylists();
  }, [isOpen]);

  const isProblemInPlaylist = (playlist: any) =>
    Array.isArray(playlist.problems) &&
    playlist.problems.some((p: any) => p.problemId === problemId);

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      setAddingId(playlistId);
      await onSubmit(problemId, playlistId);
      // Refresh so the "Added" state reflects immediately; keep modal open.
      await loadPlaylists();
    } catch (error: any) {
      console.error("Error adding to playlist: ", error);
      toast.error(error?.message || "Failed to add problem to playlist");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-lg font-mono sm:max-w-md">
        <DialogHeader className="select-none">
          <DialogTitle className="text-base font-extrabold uppercase tracking-wider text-slate-800 dark:text-zinc-200 flex items-center gap-2">
            <ListPlus className="w-4 h-4 text-violet-500" />
            Add to Playlist_
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
            Route this problem into one of your index vectors.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[320px] w-full pr-3 mt-1">
          {loadingList ? (
            <div className="flex items-center justify-center py-10 text-slate-400 dark:text-zinc-600">
              <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : playlists.length > 0 ? (
            <div className="space-y-2">
              {playlists.map((playlist) => {
                const added = isProblemInPlaylist(playlist);
                const busy = addingId === playlist.id;
                return (
                  <div
                    key={playlist.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 dark:border-zinc-900/80 bg-slate-50/30 dark:bg-zinc-900/10 hover:border-violet-500/20 dark:hover:border-violet-500/20 transition-all duration-150"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">
                        {playlist.name}
                      </h3>
                      <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400 dark:text-zinc-600 block">
                        {(playlist.problems?.length ?? 0)} problems
                      </span>
                    </div>

                    {added ? (
                      <Button
                        size="sm"
                        disabled
                        className="h-8 px-3 rounded-lg font-bold text-[10px] uppercase tracking-wider gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-none hover:bg-emerald-500/10 disabled:opacity-100"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Added
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleAddToPlaylist(playlist.id)}
                        disabled={busy}
                        className="h-8 px-3 rounded-lg font-bold text-[10px] uppercase tracking-wider gap-1.5 bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/10 active:scale-[0.98] transition-all"
                      >
                        {busy ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Plus className="h-3.5 w-3.5 stroke-[3]" />
                        )}
                        Add
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 space-y-3 select-none">
              <Library className="size-6 text-slate-300 dark:text-zinc-700 stroke-[2]" />
              <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                no_playlists_found
              </p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-600 font-sans text-center max-w-[240px]">
                Create a playlist from the Problems page first, then route problems into it.
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddToPlaylistModal;
