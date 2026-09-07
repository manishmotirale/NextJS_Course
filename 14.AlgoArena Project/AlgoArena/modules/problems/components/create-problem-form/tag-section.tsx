"use client";

import { Plus, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { problemSchema } from "@/modules/problems/schema";

type ProblemFormData = z.infer<typeof problemSchema>;

interface TagsSectionProps {
  form: UseFormReturn<any>;
  tagsArray: any;
}

export function TagsSection({ form, tagsArray }: TagsSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const { fields, append, remove } = tagsArray;

  return (
    <Card className="border border-slate-200 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl overflow-hidden transition-colors duration-300">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 dark:border-zinc-900/40 bg-violet-50/20 dark:bg-slate-900/10">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-xs md:text-sm font-extrabold tracking-wider text-slate-800 dark:text-zinc-300 uppercase flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            Topic Tags
          </CardTitle>
          <Button
            type="button"
            size="sm"
            onClick={() => append({ value: "" })}
            className="gap-2 bg-violet-500/10 dark:bg-violet-500/10 hover:bg-violet-500/20 dark:hover:bg-violet-500/20 text-violet-600 dark:text-violet-400 border border-violet-500/20 font-extrabold tracking-wider text-[11px] uppercase h-9 rounded-xl px-4 transition-all duration-200"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Tag
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map((field: any, index: number) => (
            <TagItem
              key={field.id}
              index={index}
              register={register}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
            />
          ))}
        </div>
        {errors.tags && (
          <p className="text-xs font-semibold text-red-500 dark:text-red-400 mt-3 font-mono tracking-wide">
            {(errors.tags as any)?.message ||
              (errors.tags as any)?.[0]?.value?.message ||
              "Please fill all tag fields"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface TagItemProps {
  index: number;
  register: any;
  onRemove: () => void;
  canRemove: boolean;
}

function TagItem({ index, register, onRemove, canRemove }: TagItemProps) {
  return (
    <div className="flex gap-2 items-center group">
      <Input
        {...register(`tags.${index}.value`)}
        placeholder="e.g., Dynamic Programming"
        className="flex-1 h-10 px-4 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 rounded-xl focus:border-violet-500/50 focus:ring-0 transition-all duration-200"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={!canRemove}
        className="h-10 w-10 p-0 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/5 dark:hover:bg-red-500/10 disabled:opacity-30 transition-all duration-200"
      >
        <Trash2 className="w-4 h-4 transition-transform group-hover:scale-105" />
      </Button>
    </div>
  );
}
