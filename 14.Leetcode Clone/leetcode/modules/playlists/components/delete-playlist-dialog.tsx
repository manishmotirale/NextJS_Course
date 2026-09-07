"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeletePlaylistDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  playlistName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeletePlaylistDialog({
  isOpen,
  isDeleting,
  playlistName,
  onClose,
  onConfirm,
}: DeletePlaylistDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl border border-slate-200 dark:border-zinc-800/80 bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl font-mono">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-extrabold tracking-wider uppercase text-slate-900 dark:text-white">
              Delete Playlist
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-sm text-slate-500 dark:text-zinc-400 font-sans">
            You are about to delete{" "}
            <span className="font-bold text-slate-700 dark:text-zinc-200">
              {playlistName ? `"${playlistName}"` : "this playlist"}
            </span>
            . The problems themselves are not deleted — only this collection.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl font-bold tracking-wide text-xs uppercase border-slate-200 dark:border-zinc-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl font-bold tracking-wide text-xs uppercase bg-rose-600 hover:bg-rose-700 text-white gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Playlist"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
