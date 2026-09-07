"use client";

import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIFFICULTIES } from "../constant";

/**
 * Filters section with search, difficulty, and tag dropdowns
 */
export function ProblemsFilters({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
  selectedTag,
  onTagChange,
  allTags = [],
  status,
  onStatusChange,
}: any) {
  return (
    <Card className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md shadow-sm transition-all duration-300">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-900/60 bg-slate-50/50 dark:bg-zinc-900/10">
        <div className="flex items-center gap-2 text-slate-800 dark:text-zinc-200">
          <Filter className="h-4 w-4 stroke-[2.5] text-violet-500" />
          <h3 className="text-xs font-mono font-extrabold tracking-wider uppercase">
            Filter Engine_
          </h3>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <SearchInput value={search} onChange={onSearchChange} />
          </div>

          {/* Status, Difficulty & Tag Selects */}
          <div className="flex flex-col sm:flex-row gap-3">
            <StatusSelect value={status} onChange={onStatusChange} />
            <DifficultySelect
              value={difficulty}
              onChange={onDifficultyChange}
            />
            <TagSelect
              value={selectedTag}
              onChange={onTagChange}
              tags={allTags}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Search input with icon
 */
function SearchInput({ value, onChange }: any) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500 stroke-[2.5]" />
      <Input
        placeholder="Search by title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 pl-11 pr-4 bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-200 dark:border-zinc-800/60 rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-violet-500 text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 placeholder:dark:text-zinc-500 font-medium transition-all"
      />
    </div>
  );
}

/**
 * Status filter dropdown (All / Solved / Unsolved)
 */
function StatusSelect({ value, onChange }: any) {
  const options = [
    { value: "ALL", label: "All Status" },
    { value: "SOLVED", label: "Solved" },
    { value: "UNSOLVED", label: "Unsolved" },
  ];
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[150px] h-11 bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-200 dark:border-zinc-800/60 rounded-xl text-xs font-mono font-bold tracking-wider text-slate-600 dark:text-zinc-400 uppercase focus:ring-1 focus:ring-violet-500 shadow-sm">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-lg">
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="text-xs font-mono font-bold tracking-wider uppercase text-slate-700 dark:text-zinc-300 focus:bg-violet-500/5 dark:focus:bg-violet-500/10"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/**
 * Difficulty filter dropdown
 */
function DifficultySelect({ value, onChange }: any) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[180px] h-11 bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-200 dark:border-zinc-800/60 rounded-xl text-xs font-mono font-bold tracking-wider text-slate-600 dark:text-zinc-400 uppercase focus:ring-1 focus:ring-violet-500 shadow-sm">
        <SelectValue placeholder="Select difficulty" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-lg">
        <SelectItem
          value="ALL"
          className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 dark:text-zinc-500"
        >
          All Difficulties
        </SelectItem>
        {DIFFICULTIES.map((diff: string) => (
          <SelectItem
            key={diff}
            value={diff}
            className="text-xs font-mono font-extrabold tracking-widest uppercase text-slate-700 dark:text-zinc-300 focus:bg-violet-500/5 dark:focus:bg-violet-500/10"
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/**
 * Tag filter dropdown
 */
function TagSelect({ value, onChange, tags }: any) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[180px] h-11 bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-200 dark:border-zinc-800/60 rounded-xl text-xs font-mono font-bold tracking-wider text-slate-600 dark:text-zinc-400 uppercase focus:ring-1 focus:ring-violet-500 shadow-sm">
        <SelectValue placeholder="Select tag" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-lg max-h-[280px]">
        <SelectItem
          value="ALL"
          className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 dark:text-zinc-500"
        >
          All Tags
        </SelectItem>
        {tags.map((tag: string) => (
          <SelectItem
            key={tag}
            value={tag}
            className="text-xs font-mono font-bold tracking-wider uppercase text-slate-700 dark:text-zinc-300 focus:bg-violet-500/5 dark:focus:bg-violet-500/10"
          >
            {tag}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
