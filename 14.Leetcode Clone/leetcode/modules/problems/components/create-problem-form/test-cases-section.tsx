"use client";

import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TestCasesSectionProps {
  form: any;
  testCasesArray: any;
}

export function TestCasesSection({
  form,
  testCasesArray,
}: TestCasesSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const { fields, append, remove } = testCasesArray;

  return (
    <Card className="border border-slate-200 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl overflow-hidden transition-colors duration-300">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 dark:border-zinc-900/40 bg-violet-50/20 dark:bg-slate-900/10">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-xs md:text-sm font-extrabold tracking-wider text-slate-800 dark:text-zinc-300 uppercase flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            Test Cases Matrix
          </CardTitle>
          <Button
            type="button"
            size="sm"
            onClick={() => append({ input: "", output: "" })}
            className="gap-2 bg-violet-500/10 dark:bg-violet-500/10 hover:bg-violet-500/20 dark:hover:bg-violet-500/20 text-violet-600 dark:text-violet-400 border border-violet-500/20 font-extrabold tracking-wider text-[11px] uppercase h-9 rounded-xl px-4 transition-all duration-200"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Test Case
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {fields.map((field: any, index: number) => (
          <TestCaseCard
            key={field.id}
            index={index}
            register={register}
            errors={errors}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
          />
        ))}
        {errors.testCases && !Array.isArray(errors.testCases) && (
          <p className="text-xs font-semibold text-red-500 dark:text-red-400 mt-2 font-mono tracking-wide">
            {errors.testCases.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface TestCaseCardProps {
  index: number;
  register: any;
  errors: any;
  onRemove: () => void;
  canRemove: boolean;
}

function TestCaseCard({
  index,
  register,
  errors,
  onRemove,
  canRemove,
}: TestCaseCardProps) {
  return (
    <Card className="border border-slate-200 dark:border-zinc-800/50 bg-white dark:bg-slate-950 rounded-xl overflow-hidden transition-all duration-300 shadow-sm">
      <CardHeader className="p-4 md:p-5 pb-3 border-b border-slate-100 dark:border-zinc-900/40 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex justify-between items-center gap-4">
          <CardTitle className="text-xs md:text-sm font-extrabold tracking-wider text-slate-700 dark:text-zinc-400 uppercase">
            Test Case #{index + 1}
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            disabled={!canRemove}
            className="text-red-500 hover:text-red-600 hover:bg-red-500/5 dark:hover:bg-red-500/10 font-extrabold tracking-wider text-[11px] uppercase h-8 px-3 rounded-lg gap-1.5 transition-all duration-200 disabled:opacity-30"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Block */}
          <div className="space-y-2">
            <Label className="text-[11px] font-extrabold tracking-wider uppercase text-slate-600 dark:text-zinc-400">
              Input Vector
            </Label>
            <Textarea
              {...register(`testCases.${index}.input`)}
              placeholder="Enter standard stream input values..."
              className="min-h-24 p-3 text-sm bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 rounded-xl focus:border-violet-500/50 focus:ring-0 font-mono transition-all duration-200 resize-y"
            />
            {errors.testCases?.[index]?.input && (
              <p className="text-xs font-semibold text-red-500 dark:text-red-400 font-mono tracking-wide mt-1">
                {errors.testCases[index].input.message}
              </p>
            )}
          </div>

          {/* Output Block */}
          <div className="space-y-2">
            <Label className="text-[11px] font-extrabold tracking-wider uppercase text-slate-600 dark:text-zinc-400">
              Expected Output
            </Label>
            <Textarea
              {...register(`testCases.${index}.output`)}
              placeholder="Enter matching expected execution output..."
              className="min-h-24 p-3 text-sm bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 rounded-xl focus:border-violet-500/50 focus:ring-0 font-mono transition-all duration-200 resize-y"
            />
            {errors.testCases?.[index]?.output && (
              <p className="text-xs font-semibold text-red-500 dark:text-red-400 font-mono tracking-wide mt-1">
                {errors.testCases[index].output.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
