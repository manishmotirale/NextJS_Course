"use client";

import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DIFFICULTY_OPTIONS } from "../../schema";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { problemSchema } from "@/modules/problems/schema";

type ProblemFormData = z.infer<typeof problemSchema>;

interface BasicInfoSectionProps {
  form: UseFormReturn<any>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-colors duration-300">
      <TitleField register={register} error={errors.title} />
      <DescriptionField register={register} error={errors.description} />
      <DifficultyField control={control} error={errors.difficulty} />
    </div>
  );
}

interface FieldProps {
  register: any;
  error?: any;
}

interface DifficultyFieldProps {
  control: any;
  error?: any;
}

function TitleField({ register, error }: FieldProps) {
  return (
    <div className="md:col-span-2 space-y-2">
      <Label htmlFor="title" className="text-xs font-extrabold tracking-wider uppercase text-slate-800 dark:text-zinc-300">
        Problem Title
      </Label>
      <Input
        id="title"
        {...register("title")}
        placeholder="e.g., Two Sum Matrix"
        className="h-11 px-4 text-base bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 rounded-xl focus:border-violet-500/50 focus:ring-0 transition-all duration-200"
      />
      {error && <p className="text-xs font-semibold text-red-500 dark:text-red-400 mt-1 font-mono tracking-wide">{error.message}</p>}
    </div>
  );
}

function DescriptionField({ register, error }: FieldProps) {
  return (
    <div className="md:col-span-2 space-y-2">
      <Label htmlFor="description" className="text-xs font-extrabold tracking-wider uppercase text-slate-800 dark:text-zinc-300">
        Problem Description
      </Label>
      <Textarea
        id="description"
        {...register("description")}
        placeholder="Describe the logic challenge, runtime restrictions, and computational boundaries..."
        className="min-h-36 p-4 text-base bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 rounded-xl focus:border-violet-500/50 focus:ring-0 transition-all duration-200 resize-y"
      />
      {error && <p className="text-xs font-semibold text-red-500 dark:text-red-400 mt-1 font-mono tracking-wide">{error.message}</p>}
    </div>
  );
}

function DifficultyField({ control, error }: DifficultyFieldProps) {
  return (
    <div className="space-y-2 md:col-span-1">
      <Label htmlFor="difficulty" className="text-xs font-extrabold tracking-wider uppercase text-slate-800 dark:text-zinc-300">
        Complexity Tier
      </Label>
      <Controller
        name="difficulty"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger id="difficulty" className="h-11 bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-zinc-800/80 text-slate-700 dark:text-zinc-300 rounded-xl focus:border-violet-500/50 transition-all duration-200">
              <SelectValue placeholder="Select context tier" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl">
              {DIFFICULTY_OPTIONS.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="focus:bg-violet-500/10 dark:focus:bg-violet-500/10 text-slate-900 dark:text-zinc-100 cursor-pointer rounded-lg m-1"
                >
                  <Badge variant="secondary" className={`font-extrabold tracking-wider text-[10px] rounded-md border ${option.className}`}>
                    {option.label}
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-xs font-semibold text-red-500 dark:text-red-400 mt-1 font-mono tracking-wide">{error.message}</p>}
    </div>
  );
}