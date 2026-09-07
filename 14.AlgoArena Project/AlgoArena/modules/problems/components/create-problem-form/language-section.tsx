"use client";

import { Controller } from "react-hook-form";
import { Code2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { LANGUAGES } from "../../schema";
import { CodeEditor } from "./code-editor";

interface LanguageSectionsProps {
  form: any;
}

export function LanguageSections({ form }: LanguageSectionsProps) {
  return (
    <div className="space-y-8">
      {LANGUAGES.map((language: string) => (
        <LanguageCard key={language} language={language} form={form} />
      ))}
    </div>
  );
}

interface LanguageCardProps {
  language: string;
  form: any;
}

function LanguageCard({ language, form }: LanguageCardProps) {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <Card className="border border-slate-200 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl overflow-hidden transition-colors duration-300">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 dark:border-zinc-900/40 bg-violet-50/20 dark:bg-slate-900/10">
        <CardTitle className="text-xs md:text-sm font-extrabold tracking-wider text-slate-800 dark:text-zinc-300 uppercase flex items-center gap-2">
          <Code2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          Environment Configuration: {language}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <StarterCodeEditor
          language={language}
          control={control}
          error={errors.codeSnippets?.[language]}
        />
        <ReferenceSolutionEditor
          language={language}
          control={control}
          error={errors.referenceSolutions?.[language]}
        />
        <ExamplesFields
          language={language}
          register={register}
          errors={errors}
        />
      </CardContent>
    </Card>
  );
}

interface EditorProps {
  language: string;
  control: any;
  error?: any;
}

function StarterCodeEditor({ language, control, error }: EditorProps) {
  return (
    <Card className="border border-slate-200 dark:border-zinc-800/50 bg-white dark:bg-slate-950 rounded-xl overflow-hidden transition-all duration-300 shadow-sm">
      <CardHeader className="p-4 md:p-5 pb-3 border-b border-slate-100 dark:border-zinc-900/40 bg-slate-50/30 dark:bg-slate-900/30">
        <CardTitle className="text-xs font-extrabold tracking-wider text-slate-700 dark:text-zinc-400 uppercase">
          Starter Code Template
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800/80 bg-slate-900">
          <Controller
            name={`codeSnippets.${language}`}
            control={control}
            render={({ field }) => (
              <CodeEditor
                value={field.value}
                onChange={field.onChange}
                language={language.toLowerCase()}
              />
            )}
          />
        </div>
        {error && (
          <p className="text-xs font-semibold text-red-500 dark:text-red-400 font-mono tracking-wide mt-2">
            {error.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ReferenceSolutionEditor({ language, control, error }: EditorProps) {
  return (
    <Card className="border border-slate-200 dark:border-zinc-800/50 bg-white dark:bg-slate-950 rounded-xl overflow-hidden transition-all duration-300 shadow-sm">
      <CardHeader className="p-4 md:p-5 pb-3 border-b border-slate-100 dark:border-zinc-900/40 bg-slate-50/30 dark:bg-slate-900/30">
        <CardTitle className="text-xs font-extrabold tracking-wider text-slate-700 dark:text-zinc-400 uppercase flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
          Reference Solution Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800/80 bg-slate-900">
          <Controller
            name={`referenceSolutions.${language}`}
            control={control}
            render={({ field }) => (
              <CodeEditor
                value={field.value}
                onChange={field.onChange}
                language={language.toLowerCase()}
              />
            )}
          />
        </div>
        {error && (
          <p className="text-xs font-semibold text-red-500 dark:text-red-400 font-mono tracking-wide mt-2">
            {error.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface ExamplesFieldsProps {
  language: string;
  register: any;
  errors: any;
}

function ExamplesFields({ language, register, errors }: ExamplesFieldsProps) {
  return (
    <Card className="border border-slate-200 dark:border-zinc-800/50 bg-white dark:bg-slate-950 rounded-xl overflow-hidden transition-all duration-300 shadow-sm">
      <CardHeader className="p-4 md:p-5 pb-3 border-b border-slate-100 dark:border-zinc-900/40 bg-slate-50/30 dark:bg-slate-900/30">
        <CardTitle className="text-xs font-extrabold tracking-wider text-slate-700 dark:text-zinc-400 uppercase">
          Problem Examples
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Example Input */}
          <div className="space-y-2">
            <Label className="text-[11px] font-extrabold tracking-wider uppercase text-slate-600 dark:text-zinc-400">
              Example Input
            </Label>
            <Textarea
              {...register(`examples.${language}.input`)}
              placeholder="Enter context block input vector..."
              className="min-h-24 p-3 text-sm bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 rounded-xl focus:border-violet-500/50 focus:ring-0 font-mono transition-all duration-200 resize-y"
            />
            {errors.examples?.[language]?.input && (
              <p className="text-xs font-semibold text-red-500 dark:text-red-400 font-mono tracking-wide mt-1">
                {errors.examples[language].input.message}
              </p>
            )}
          </div>

          {/* Example Output */}
          <div className="space-y-2">
            <Label className="text-[11px] font-extrabold tracking-wider uppercase text-slate-600 dark:text-zinc-400">
              Example Output
            </Label>
            <Textarea
              {...register(`examples.${language}.output`)}
              placeholder="Enter matching string output evaluation..."
              className="min-h-24 p-3 text-sm bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 rounded-xl focus:border-violet-500/50 focus:ring-0 font-mono transition-all duration-200 resize-y"
            />
            {errors.examples?.[language]?.output && (
              <p className="text-xs font-semibold text-red-500 dark:text-red-400 font-mono tracking-wide mt-1">
                {errors.examples[language].output.message}
              </p>
            )}
          </div>

          {/* Explanation Area */}
          <div className="md:col-span-2 space-y-2">
            <Label className="text-[11px] font-extrabold tracking-wider uppercase text-slate-600 dark:text-zinc-400">
              Algorithmic Explanation
            </Label>
            <Textarea
              {...register(`examples.${language}.explanation`)}
              placeholder="Elaborate on the transform mapping process for this clear sample context case..."
              className="min-h-28 p-3 text-sm bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 rounded-xl focus:border-violet-500/50 focus:ring-0 transition-all duration-200 resize-y"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
