"use client";

import { useEffect, useState } from "react";
import { getProblemById } from "../actions";

export function useProblem(id: string) {
  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const problemData = await getProblemById(id);

        if (problemData.success) {
          setProblem(problemData.data as any);
        }
      } catch (error) {
        console.error("Error fetching problem: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  return {
    problem,
    isLoading,
  };
}
