import { useQuery } from "@tanstack/react-query";

export const useAIModels = () => {
  return useQuery({
    queryKey: ["ai-models"],
    queryFn: async () => {
      const res = await fetch("/api/ai/get-model"); // ✅ Fixed with leading slash
      if (!res.ok) {
        throw new Error("Failed to fetch models");
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};