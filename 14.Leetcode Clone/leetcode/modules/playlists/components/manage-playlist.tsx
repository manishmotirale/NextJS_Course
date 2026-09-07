"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Settings2, Save, Plus, X, Search, Library } from "lucide-react";
import { toast } from "sonner";
import { getAllProblems } from "@/modules/problems/actions";

interface ManagePlaylistModalProps {
  isOpen: boolean;
  playlist: any | null;
  onClose: () => void;
  onChanged: () => void; // refresh parent after any mutation
}

const difficultyStyles: Record<string, string> = {
  EASY: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  HARD: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

export function ManagePlaylistModal({
  isOpen,
  playlist,
  onClose,
  onChanged,
}: ManagePlaylistModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [savingDetails, setSavingDetails] = useState(false);

  // problems currently in the playlist (local mirror for instant UI updates)
  const [members, setMembers] = useState<any[]>([]);
  const [allProblems, setAllProblems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && playlist) {
      setName(playlist.name ?? "");
      setDescription(playlist.description ?? "");
      setMembers(
        (playlist.problems ?? []).map((pp: any) => ({
          id: pp.problem?.id ?? pp.problemId,
          title: pp.problem?.title ?? "Untitled",
          difficulty: pp.problem?.difficulty ?? "EASY",
        })),
      );
      setSearch("");
      // Load all problems for the "add" picker
      (async () => {
        const res = await getAllProblems();
        if (res.success && res.data) {
          setAllProblems(
            res.data.map((p: any) => ({
              id: p.id,
              title: p.title,
              difficulty: p.difficulty,
            })),
          );
        }
      })();
    }
  }, [isOpen, playlist]);

  const memberIds = useMemo(() => new Set(members.map((m) => m.id)), [members]);

  const availableProblems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allProblems
      .filter((p) => !memberIds.has(p.id))
      .filter((p) => (q ? p.title.toLowerCase().includes(q) : true))
      .slice(0, 50);
  }, [allProblems, memberIds, search]);

  if (!playlist) return null;

  const saveDetails = async () => {
    if (!name.trim()) {
      toast.error("Playlist name is required");
      return;
    }
    try {
      setSavingDetails(true);
      const res = await fetch(`/api/playlist/${playlist.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Playlist updated");
        onChanged();
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to update playlist");
    } finally {
      setSavingDetails(false);
    }
  };

  const addProblem = async (problem: any) => {
    try {
      setMutatingId(problem.id);
      const res = await fetch("/api/playlist/add-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: problem.id, playlistId: playlist.id }),
      });
      const data = await res.json();
      if (data.success) {
        setMembers((prev) => [...prev, problem]);
        onChanged();
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to add problem");
    } finally {
      setMutatingId(null);
    }
  };

  const removeProblem = async (problemId: string) => {
    try {
      setMutatingId(problemId);
      const res = await fetch("/api/playlist/remove-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, playlistId: playlist.id }),
      });
      const data = await res.json();
      if (data.success) {
        setMembers((prev) => prev.filter((m) => m.id !== problemId));
        onChanged();
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to remove problem");
    } finally {
      setMutatingId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-lg font-mono sm:max-w-lg">
        <DialogHeader className="select-none">
          <DialogTitle className="text-base font-extrabold uppercase tracking-wider text-slate-800 dark:text-zinc-200 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-violet-500" />
            Manage Playlist_
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
            Rename your index vector and curate its problem set.
          </DialogDescription>
        </DialogHeader>

        {/* Rename section */}
        <div className="space-y-3 pt-1">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
              Playlist Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-200 dark:border-zinc-800/60 rounded-xl text-xs focus-visible:ring-1 focus-visible:ring-violet-500 font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
              Description (Optional)
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[60px] bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-200 dark:border-zinc-800/60 rounded-xl text-xs focus-visible:ring-1 focus-visible:ring-violet-500 font-medium font-sans"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={saveDetails}
              disabled={savingDetails}
              className="h-9 px-4 rounded-xl font-bold text-[10px] uppercase tracking-wider gap-1.5 bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/10 active:scale-[0.98] transition-all"
            >
              {savingDetails ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Save Details
            </Button>
          </div>
        </div>

        {/* Current problems */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-900/60">
          <Label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-400 pt-2 block">
            In this playlist ({members.length})
          </Label>
          {members.length === 0 ? (
            <p className="text-[10px] text-slate-400 dark:text-zinc-600 font-sans py-2">
              No problems yet. Add some from the list below.
            </p>
          ) : (
            <ScrollArea className="max-h-[120px] pr-3">
              <div className="space-y-1.5">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg border border-slate-100 dark:border-zinc-900/80 bg-slate-50/30 dark:bg-zinc-900/10"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge
                        variant="outline"
                        className={`${difficultyStyles[m.difficulty] || difficultyStyles.EASY} text-[8px] font-extrabold tracking-widest px-1.5 py-0 rounded border uppercase shrink-0`}
                      >
                        {m.difficulty?.[0] ?? "E"}
                      </Badge>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 truncate">
                        {m.title}
                      </span>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeProblem(m.id)}
                      disabled={mutatingId === m.id}
                      className="h-6 w-6 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-md shrink-0"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Add problems */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-900/60">
          <Label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-400 pt-2 block">
            Add problems
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-zinc-600" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="h-9 pl-9 bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-200 dark:border-zinc-800/60 rounded-xl text-xs focus-visible:ring-1 focus-visible:ring-violet-500 font-medium"
            />
          </div>
          <ScrollArea className="max-h-[140px] pr-3">
            {availableProblems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 gap-1.5 select-none">
                <Library className="size-5 text-slate-300 dark:text-zinc-700" />
                <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-wider">
                  {search ? "no_matches" : "all_problems_added"}
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {availableProblems.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg border border-slate-100 dark:border-zinc-900/80 bg-slate-50/30 dark:bg-zinc-900/10 hover:border-violet-500/20 transition-all"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge
                        variant="outline"
                        className={`${difficultyStyles[p.difficulty] || difficultyStyles.EASY} text-[8px] font-extrabold tracking-widest px-1.5 py-0 rounded border uppercase shrink-0`}
                      >
                        {p.difficulty?.[0] ?? "E"}
                      </Badge>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 truncate">
                        {p.title}
                      </span>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => addProblem(p)}
                      disabled={mutatingId === p.id}
                      className="h-6 w-6 text-slate-400 hover:text-violet-500 hover:bg-violet-500/10 rounded-md shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5 stroke-[3]" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-zinc-900/60">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-9 px-4 rounded-xl font-bold text-[10px] uppercase tracking-wider border-slate-200 dark:border-zinc-800"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
