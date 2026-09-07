"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormHeader } from "./form-header";
import { useCreateProblem } from "@/hooks/use-create-problem";
import { BasicInfoSection } from "./basic-info-section";
import { TagsSection } from "./tag-section";
import { TestCasesSection } from "./test-cases-section";
import { LanguageSections } from "./language-section";
import { AdditionalInfoSection } from "./additional-info-section";

interface CreateProblemFormProps {
  problemId?: string;
  initialData?: any;
}

export function CreateProblemForm({ problemId, initialData }: CreateProblemFormProps = {}) {
  const {
    form,
    isLoading,
    isEditMode,
    sampleType,
    setSampleType,
    skipValidation,
    toggleSkipValidation,
    onSubmit,
    loadSampleData,
    testCasesArray,
    tagsArray,
  } = useCreateProblem({ problemId, initialData });

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl relative">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-violet-500/5 dark:bg-violet-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <Card className="border border-slate-200 dark:border-zinc-800/80 bg-white/90 dark:bg-slate-950/40 backdrop-blur-xl shadow-xl dark:shadow-2xl overflow-hidden rounded-2xl transition-colors duration-300">
        <FormHeader
          sampleType={sampleType}
          setSampleType={setSampleType}
          onLoadSample={loadSampleData}
          skipValidation={skipValidation}
          onToggleSkipValidation={toggleSkipValidation}
          isEditMode={isEditMode}
        />

        <CardContent className="p-6 md:p-8">
          <form onSubmit={onSubmit} className="space-y-10">
            <div className="space-y-8">
              <BasicInfoSection form={form} />
              <TagsSection form={form} tagsArray={tagsArray} />
              <TestCasesSection form={form} testCasesArray={testCasesArray} />
              <LanguageSections form={form} />
              <AdditionalInfoSection form={form} />
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-zinc-900/60 flex justify-end">
              <SubmitButton
                isLoading={isLoading}
                skipValidation={skipValidation}
                isEditMode={isEditMode}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SubmitButton({
  isLoading,
  skipValidation,
  isEditMode,
}: {
  isLoading: boolean;
  skipValidation: boolean;
  isEditMode?: boolean;
}) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={isLoading}
      className="gap-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 hover:scale-[1.02] active:scale-98 text-white font-extrabold tracking-wider uppercase text-xs rounded-xl shadow-lg shadow-indigo-500/20 px-8 h-12 transition-all duration-200 disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {skipValidation ? "Saving..." : "Validating & Saving..."}
        </>
      ) : (
        <>
          <Plus className="w-4 h-4 stroke-[3]" />
          {isEditMode
            ? skipValidation
              ? "Save Changes"
              : "Validate & Update"
            : skipValidation
              ? "Save Problem"
              : "Validate & Create"}
        </>
      )}
    </Button>
  );
}
