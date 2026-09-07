"use client";

import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalInfoSectionProps {
  form: any;
}

export function AdditionalInfoSection({ form }: AdditionalInfoSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card className="border border-slate-200 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl overflow-hidden transition-colors duration-300">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 dark:border-zinc-900/40 bg-violet-50/20 dark:bg-slate-900/10">
        <CardTitle className="text-xs md:text-sm font-extrabold tracking-wider text-slate-800 dark:text-zinc-300 uppercase flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          Additional Metadata
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <ConstraintsField register={register} error={errors.constraints} />
        <HintsField register={register} />
        <EditorialField register={register} />
      </CardContent>
    </Card>
  );
}

interface FieldProps {
  register: any;
  error?: any;
}

function ConstraintsField({ register, error }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-extrabold tracking-wider uppercase text-slate-600 dark:text-zinc-400">
        Execution Constraints
      </Label>
      <Textarea
        {...register("constraints")}
        placeholder="e.g., 1 <= nums.length <= 10^5, Time Limit: 1.0s"
        className="min-h-24 p-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 rounded-xl focus:border-violet-500/50 focus:ring-0 font-mono transition-all duration-200 resize-y"
      />
      {error && (
        <p className="text-xs font-semibold text-red-500 dark:text-red-400 font-mono tracking-wide mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
}

function HintsField({ register }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-extrabold tracking-wider uppercase text-slate-600 dark:text-zinc-400">
        Algorithmic Hints (Optional)
      </Label>
      <Textarea
        {...register("hints")}
        placeholder="Provide sequential logical hints to guide the user toward the optimal runtime strategy..."
        className="min-h-24 p-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 rounded-xl focus:border-violet-500/50 focus:ring-0 transition-all duration-200 resize-y"
      />
    </div>
  );
}

function EditorialField({ register }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-extrabold tracking-wider uppercase text-slate-600 dark:text-zinc-400">
        Problem Editorial (Optional)
      </Label>
      <Textarea
        {...register("editorial")}
        placeholder="Document the formal runtime proof, space complexity breakdowns, and structural optimal path maps..."
        className="min-h-32 p-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 rounded-xl focus:border-violet-500/50 focus:ring-0 transition-all duration-200 resize-y"
      />
    </div>
  );
}
