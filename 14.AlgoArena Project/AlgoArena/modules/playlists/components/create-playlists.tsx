"use client";

import React, { useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

const playlistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

const CreatePlaylistModal = ({ isOpen, onClose, onSubmit }: any) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(playlistSchema),
  });

  const handleFormSubmit = async (value: z.infer<typeof playlistSchema>) => {
    try {
      setIsLoading(true);
      await onSubmit(value);
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating Playlist: ", error);
      toast.error("Failed to create playlist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-lg font-mono">
        <DialogHeader className="select-none">
          <DialogTitle className="text-base font-extrabold uppercase tracking-wider text-slate-800 dark:text-zinc-200">
            Create Playlist Matrix_
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
            Organize core structural problems inside an index vector.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 pt-2"
        >
          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-400"
            >
              Playlist Name
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g., Dynamic Programming Arrays"
              className="h-10 bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-200 dark:border-zinc-800/60 rounded-xl text-xs focus-visible:ring-1 focus-visible:ring-violet-500 font-medium"
            />
            {errors.name && (
              <p className="text-[10px] font-bold text-rose-500 uppercase mt-1">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="description"
              className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-400"
            >
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Provide a functional brief..."
              className="min-h-[80px] bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-200 dark:border-zinc-800/60 rounded-xl text-xs focus-visible:ring-1 focus-visible:ring-violet-500 font-medium font-sans"
            />
            {errors.description && (
              <p className="text-[10px] font-bold text-rose-500 uppercase mt-1">
                {errors.description.message as string}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 select-none">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="h-9 px-4 border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-slate-950/40 rounded-xl text-slate-700 dark:text-zinc-300 font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-9 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-white shadow-md shadow-violet-500/10 active:scale-[0.98] transition-all"
            >
              {isLoading ? "Compiling..." : "Build List"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlaylistModal;
