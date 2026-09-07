"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { List, Calendar, Library, Settings2, Trash2, Hash } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ManagePlaylistModal } from "@/modules/playlists/components/manage-playlist";
import { DeletePlaylistDialog } from "@/modules/playlists/components/delete-playlist-dialog";

const PlaylistsSection = ({ playlists = [] }: any) => {
  const router = useRouter();
  const [manageTarget, setManageTarget] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: any) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/playlist/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Playlist deleted");
        setDeleteTarget(null);
        router.refresh();
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete playlist");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-900/60 bg-slate-50/50 dark:bg-zinc-900/10 select-none">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-zinc-200">
            <List className="size-4 stroke-[2.5] text-violet-500" />
            <span className="text-xs font-mono font-extrabold tracking-wider uppercase">
              Custom Playlists_
            </span>
          </CardTitle>
          <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md shadow-none">
            {playlists.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-2 font-mono select-none">
            <Library className="size-6 text-slate-300 dark:text-zinc-700 stroke-[2]" />
            <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              no_custom_playlists_built
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[280px] pr-2">
            <div className="space-y-3">
              {playlists.map((playlist: any) => (
                <div
                  key={playlist.id}
                  className="group border border-slate-100 dark:border-zinc-900/80 bg-slate-50/30 dark:bg-zinc-900/10 p-3.5 rounded-xl font-mono hover:border-violet-500/20 dark:hover:border-violet-500/20 transition-all duration-150"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors truncate">
                        {playlist.name}
                      </h4>
                      {playlist.description && (
                        <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-sans font-normal leading-relaxed line-clamp-2">
                          {playlist.description}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Manage playlist"
                        onClick={() => setManageTarget(playlist)}
                        className="h-7 w-7 text-slate-400 hover:text-violet-500 hover:bg-violet-500/10 rounded-lg"
                      >
                        <Settings2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Delete playlist"
                        onClick={() => setDeleteTarget(playlist)}
                        className="h-7 w-7 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 dark:border-zinc-900/80 pt-2 text-[9px] font-semibold text-slate-400 dark:text-zinc-600">
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      <span>{playlist.problems?.length ?? 0} problems</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Created {formatDate(playlist.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <ManagePlaylistModal
          isOpen={!!manageTarget}
          playlist={manageTarget}
          onClose={() => setManageTarget(null)}
          onChanged={() => router.refresh()}
        />

        <DeletePlaylistDialog
          isOpen={!!deleteTarget}
          isDeleting={isDeleting}
          playlistName={deleteTarget?.name}
          onClose={() => !isDeleting && setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      </CardContent>
    </Card>
  );
};

export default PlaylistsSection;
