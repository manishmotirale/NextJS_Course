"use client";

import { FileText, Download, ShieldOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface FormHeaderProps {
  sampleType: any;
  setSampleType: any;
  onLoadSample: () => void;
  skipValidation: boolean;
  onToggleSkipValidation: () => void;
  isEditMode?: boolean;
}

export function FormHeader({
  sampleType,
  setSampleType,
  onLoadSample,
  skipValidation,
  onToggleSkipValidation,
  isEditMode = false,
}: FormHeaderProps) {
  return (
    <CardHeader className="p-6 md:p-8 pb-4 border-b border-slate-100 dark:border-zinc-900/60 bg-violet-50/30 dark:bg-slate-900/10">
      <div className="flex flex-col gap-4">
        {/* Row 1: Title + Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl md:text-2xl font-extrabold tracking-wider text-slate-900 dark:text-white uppercase flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-600 dark:text-violet-400">
              <FileText className="w-6 h-6" />
            </div>
            {isEditMode ? "Edit Problem" : "Create Problem"}
          </CardTitle>

          {/* Sample loader is only useful when authoring a new problem */}
          {!isEditMode && (
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <SampleTypeToggle
                sampleType={sampleType}
                setSampleType={setSampleType}
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onLoadSample}
                className="gap-2 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-violet-500/5 dark:hover:bg-violet-500/10 font-extrabold tracking-wider text-[11px] uppercase rounded-xl h-9 px-4 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                Load Sample
              </Button>
            </div>
          )}
        </div>

        {/* Row 2: Validation toggle banner */}
        <div
          onClick={onToggleSkipValidation}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
            skipValidation
              ? "bg-amber-50 dark:bg-amber-900/10 border-amber-300/60 dark:border-amber-700/40 text-amber-700 dark:text-amber-400"
              : "bg-emerald-50/60 dark:bg-emerald-900/10 border-emerald-300/60 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-400"
          }`}
        >
          {skipValidation ? (
            <ShieldOff className="w-4 h-4 shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-widest">
              {skipValidation
                ? "Validation Skipped — Problem will be saved without running reference solutions"
                : "Validation Enabled — Reference solutions will be run against test cases via Wandbox (free)"}
            </p>
          </div>

          {/* Toggle pill */}
          <div
            className={`shrink-0 w-10 h-5 rounded-full transition-colors duration-200 flex items-center ${
              skipValidation
                ? "bg-amber-400 dark:bg-amber-600 justify-end"
                : "bg-emerald-500 dark:bg-emerald-600 justify-start"
            } px-0.5`}
          >
            <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
          </div>
        </div>
      </div>
    </CardHeader>
  );
}

function SampleTypeToggle({ sampleType, setSampleType }: any) {
  return (
    <div className="flex p-1 bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/80 rounded-xl max-w-fit">
      <Button
        type="button"
        size="sm"
        className={`rounded-lg font-extrabold tracking-wider text-[10px] uppercase px-4 h-7 transition-all ${
          sampleType === "DP"
            ? "bg-white dark:bg-slate-800 text-violet-600 dark:text-white shadow-sm border border-slate-200/50 dark:border-zinc-700/50"
            : "bg-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
        }`}
        onClick={() => setSampleType("DP")}
      >
        DP Matrix
      </Button>
      <Button
        type="button"
        size="sm"
        className={`rounded-lg font-extrabold tracking-wider text-[10px] uppercase px-4 h-7 transition-all ${
          sampleType === "string"
            ? "bg-white dark:bg-slate-800 text-violet-600 dark:text-white shadow-sm border border-slate-200/50 dark:border-zinc-700/50"
            : "bg-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
        }`}
        onClick={() => setSampleType("string")}
      >
        String Stream
      </Button>
    </div>
  );
}