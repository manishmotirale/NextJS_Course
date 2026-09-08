import { useQuery } from "@tanstack/react-query";

interface AIModel {
  id: string;
  name: string;
  [key: string]: any;
}

interface ModelsResponse {
  models: AIModel[];
  [key: string]: any;
}

export const useAIModels = () => {
  return useQuery<ModelsResponse>({
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