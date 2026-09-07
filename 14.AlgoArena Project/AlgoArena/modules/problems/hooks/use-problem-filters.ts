"use client";

import { useState, useMemo } from "react";

export function useProblemFilters(problems: any[]) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selectedTag, setSelectedTag] = useState(""); // 💡 Aligned names to match what table passes down
  const [status, setStatus] = useState("ALL"); // ALL | SOLVED | UNSOLVED

  // Extract all unique tags from the problems
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    problems.forEach((problem) => {
      problem.tags?.forEach((tag: string) => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase()),
      )
      .filter((problem) =>
        !difficulty || difficulty === "ALL"
          ? true
          : problem.difficulty === difficulty,
      )
      .filter((problem) =>
        !selectedTag || selectedTag === "ALL"
          ? true
          : problem.tags?.includes(selectedTag),
      )
      .filter((problem) => {
        if (status === "ALL") return true;
        const solved = (problem.solvedBy?.length ?? 0) > 0;
        return status === "SOLVED" ? solved : !solved;
      });
  }, [problems, search, difficulty, selectedTag, status]);

  return {
    allTags,
    filteredProblems,
    search,
    setSearch,
    difficulty,
    setDifficulty,
    selectedTag, // 💡 Exposing explicit state names expected by table filter injection fields
    setSelectedTag, // 💡 Exposing explicit state names expected by table filter injection fields
    selectedTags: selectedTag, // Fallback support aliases
    setSelectedTags: setSelectedTag, // Fallback support aliases
    status,
    setStatus,
  };
}
